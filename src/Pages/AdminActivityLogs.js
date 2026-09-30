
// Pages/AdminActivityLogs.js
// Shows activity logs for ALL admins combined
// Each admin gets a distinct colour so you can visually differentiate actions
// Filters: any admin, date range, action title

import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com';

// Colour palette — cycles through for each unique admin
const ADMIN_COLORS = [
  { bg: '#EFF6FF', border: '#3B82F6', badge: '#1D4ED8', text: '#1E3A8A' }, // blue
  { bg: '#FEF3C7', border: '#F59E0B', badge: '#B45309', text: '#92400E' }, // amber
  { bg: '#F0FDF4', border: '#22C55E', badge: '#15803D', text: '#14532D' }, // green
  { bg: '#FDF2F8', border: '#EC4899', badge: '#BE185D', text: '#831843' }, // pink
  { bg: '#F5F3FF', border: '#8B5CF6', badge: '#6D28D9', text: '#4C1D95' }, // purple
  { bg: '#FFF1F2', border: '#F43F5E', badge: '#BE123C', text: '#881337' }, // rose
  { bg: '#ECFEFF', border: '#06B6D4', badge: '#0E7490', text: '#164E63' }, // cyan
  { bg: '#FFF7ED', border: '#F97316', badge: '#C2410C', text: '#7C2D12' }, // orange
];

const AdminActivityLogs = () => {
  const [startDate,   setStartDate]   = useState('');
  const [endDate,     setEndDate]     = useState('');
  const [filterAdmin, setFilterAdmin] = useState('');
  const [logs,        setLogs]        = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  // Map adminId → colour index (built as logs load)
  const [adminColorMap, setAdminColorMap] = useState({});
  // Every admin that has ever logged an action (from the backend, not just the loaded logs)
  const [adminList,  setAdminList]  = useState([]);
  // _id -> fullname, built from GET /mobilcreateadmin/all (the source of truth for names)
  const [adminNames, setAdminNames] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  const assignColors = useCallback((logList) => {
    const map = { ...adminColorMap };
    let idx   = Object.keys(map).length;
    logList.forEach(l => {
      const key = l.admin || l.adminName || 'unknown';
      if (!map[key]) {
        map[key] = idx % ADMIN_COLORS.length;
        idx++;
      }
    });
    setAdminColorMap(map);
    return map;
  }, [adminColorMap]);

  // Load every admin (full names) + the admins that have log entries, once on open.
  // Plain fetch() is used for /all so the global axios interceptor doesn't tag it
  // with your adminId and add a "getAllAdmins" entry to the logs on every visit.
  useEffect(() => {
    fetch(`${API_BASE}/mobilcreateadmin/all`)
      .then(r => r.json())
      .then(d => {
        const map = {};
        (d.admins || []).forEach(a => { map[a._id] = a.fullname; });
        setAdminNames(map);
      })
      .catch(() => { /* names fall back to whatever the log stored */ });

    axios.get(`${API_BASE}/adminactivitylogs/admins`)
      .then(res => setAdminList(res.data.admins || []))
      .catch(() => { /* dropdown falls back to a text box */ });
  }, []);

  // Best available display name for an admin id (never shows a raw id if a name exists)
  const nameFor = (id, storedName) => adminNames[id] || storedName || (id ? `Admin …${String(id).slice(-6)}` : 'Admin');

  // Shared fetcher. `everyAdmin` = true ignores all filters and pulls ALL admins' logs.
  const fetchLogs = async (everyAdmin) => {
    setError('');
    setLoading(true);
    try {
      const params = { limit: 5000 };
      if (everyAdmin) {
        params.all = true;
      } else {
        if (startDate)   params.startDate = startDate;
        if (endDate)     params.endDate   = endDate;
        if (filterAdmin) params.adminId   = filterAdmin;
        else             params.all       = true;
      }

      const res  = await axios.get(`${API_BASE}/adminactivitylogs`, { params });
      const data = res.data.logs || res.data.data || [];

      assignColors(data);
      setLogs(data);
      setTotalCount(res.data.count ?? data.length);

      if (data.length === 0) setError('No logs found for the selected filters.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activity logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuery   = (e) => { e.preventDefault(); fetchLogs(false); };
  const handleLoadAll = () => {
    setStartDate(''); setEndDate(''); setFilterAdmin('');
    fetchLogs(true);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setFilterAdmin('');
    setLogs([]);
    setTotalCount(0);
    setError('');
  };

  const downloadPdf = () => {
    if (!logs.length) return;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text('EMRAN Admin Activity Logs — All Admins', 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    const columns = ['Date & Time', 'Admin Name', 'Admin ID', 'Action', 'Details', 'Target'];
    const rows    = logs.map(l => [
      new Date(l.createdAt).toLocaleString('en-GB', {
        day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
      }),
      nameFor(l.admin, l.adminName),
      (l.admin || '—').slice(-8), // last 8 chars of ID to save space
      l.title     || '—',
      l.details   ? (l.details.length > 120 ? l.details.slice(0, 117) + '...' : l.details) : '—',
      l.targetUserName || l.targetUser || '—',
    ]);

    // Group rows by admin for coloured sections
    autoTable(doc, {
      startY: 26,
      head:   [columns],
      body:   rows,
      styles:      { fontSize: 8, cellPadding: 2 },
      headStyles:  { fillColor: [0, 31, 91], textColor: 255, fontStyle: 'bold' },
      // Alternate row colour per admin
      didParseCell: (data) => {
        if (data.section === 'body') {
          const log    = logs[data.row.index];
          const key    = log?.admin || log?.adminName || 'unknown';
          const cIdx   = adminColorMap[key] ?? 0;
          const colors = [
            [239,246,255],[254,243,199],[240,253,244],[253,242,248],
            [245,243,255],[255,241,242],[236,254,255],[255,247,237],
          ];
          const c = colors[cIdx % colors.length];
          data.cell.styles.fillColor = c;
        }
      },
    });

    doc.save(`EMRAN_Activity_Logs_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Admins for the dropdown: everyone from /all first, then anyone else seen in logs
  const uniqueAdmins = [...new Map([
    ...Object.entries(adminNames).map(([id, name]) => [id, { id, name }]),
    ...adminList.map(a => [a.id, { id: a.id, name: nameFor(a.id, a.name) }]),
    ...logs.map(l => [l.admin, { id: l.admin, name: nameFor(l.admin, l.adminName) }]),
  ].filter(([id]) => id)).values()].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#001F5B]">Admin Activity Logs</h1>
            <p className="text-gray-500 text-sm mt-1">
              All admin actions across the portal — colour-coded by administrator
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleLoadAll} disabled={loading}
              className="px-6 py-3 bg-[#E30613] text-white rounded-xl font-bold text-sm hover:bg-[#c20511] transition disabled:opacity-60">
              {loading ? 'Loading...' : 'Load All Admins\' Logs'}
            </button>
            {logs.length > 0 && (
              <button onClick={downloadPdf}
                className="px-6 py-3 bg-[#001F5B] text-white rounded-xl font-bold text-sm hover:bg-[#0A3D6B] transition">
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Filter form */}
        <form onSubmit={handleQuery}
          className="bg-white rounded-2xl shadow p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Start Date
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              End Date
            </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Filter by Admin (optional)
            </label>
            {uniqueAdmins.length > 0 ? (
              <select value={filterAdmin} onChange={e => setFilterAdmin(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none">
                <option value="">All Admins</option>
                {uniqueAdmins.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            ) : (
              <input value={filterAdmin} onChange={e => setFilterAdmin(e.target.value)}
                placeholder="Paste Admin ID to filter"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#001F5B] focus:outline-none" />
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-[#E30613] text-white rounded-xl font-bold text-sm hover:bg-[#c20511] transition disabled:opacity-60">
              {loading ? 'Loading...' : 'Search'}
            </button>
            <button type="button" onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition">
              Clear
            </button>
          </div>
        </form>

        {/* Colour legend */}
        {Object.keys(adminColorMap).length > 0 && (
          <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide w-full mb-1">Admin Legend</p>
            {Object.entries(adminColorMap).map(([key, cIdx]) => {
              const color  = ADMIN_COLORS[cIdx % ADMIN_COLORS.length];
              const admin  = logs.find(l => (l.admin || l.adminName) === key);
              const name   = nameFor(admin?.admin, admin?.adminName) || key;
              return (
                <span key={key}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
                  style={{ background: color.bg, borderColor: color.border, color: color.text }}>
                  <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                    style={{ background: color.border }} />
                  {name}
                </span>
              );
            })}
          </div>
        )}

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* Results count */}
        {logs.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <strong>{logs.length}</strong>{totalCount > logs.length ? ` of ${totalCount}` : ''} log{logs.length !== 1 ? 's' : ''}
            {Object.keys(adminColorMap).length > 0 && ` from ${new Set(logs.map(l => l.admin || l.adminName)).size} admin${new Set(logs.map(l => l.admin || l.adminName)).size > 1 ? 's' : ''}`}
          </p>
        )}

        {/* Log cards */}
        <div className="space-y-3">
          {logs.map(log => {
            const key   = log.admin || log.adminName || 'unknown';
            const cIdx  = adminColorMap[key] ?? 0;
            const color = ADMIN_COLORS[cIdx % ADMIN_COLORS.length];

            return (
              <div key={log._id || `${log.admin}-${log.createdAt}`}
                className="rounded-2xl shadow-sm border-l-4 p-5 flex flex-col sm:flex-row justify-between gap-4"
                style={{ background: color.bg, borderLeftColor: color.border }}>

                {/* Left — action details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: color.badge, color: '#fff' }}>
                      {nameFor(log.admin, log.adminName)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString('en-GB', {
                        day:'numeric', month:'short', year:'numeric',
                        hour:'2-digit', minute:'2-digit'
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mt-1" style={{ color: color.text }}>
                    {log.title || '—'}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{log.details || '—'}</p>
                </div>

                {/* Right — target */}
                {(log.targetUserName || log.targetUser) && (
                  <div className="sm:w-48 sm:text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Target</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {log.targetUserName || log.targetUser?.slice(-8) || '—'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {logs.length === 0 && !error && !loading && (
          <div className="bg-white rounded-2xl shadow p-16 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-[#001F5B] mb-2">No logs loaded yet</h3>
            <p className="text-gray-500">Click “Load All Admins’ Logs”, or pick filters and click Search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityLogs;

