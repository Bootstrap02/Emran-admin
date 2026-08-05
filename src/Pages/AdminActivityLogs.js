import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com';

const getAdminIdFromStorage = () => {
  try {
    const d = JSON.parse(localStorage.getItem('userData')) || JSON.parse(localStorage.getItem('adminData'));
    return d?.user?._id || d?._id || d?.id || d?.userId || '';
  } catch (e) { return ''; }
};

const AdminActivityLogs = () => {
  const [adminId, setAdminId] = useState(getAdminIdFromStorage());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = {};
      if (adminId) params.adminId = adminId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await axios.get(`${API_BASE}/adminactivitylogs`, { params });
      if (res?.data?.logs) setLogs(res.data.logs);
      else setLogs(res?.data?.logs || res?.data?.data || []);
      if ((res?.data?.logs || res?.data?.data || []).length === 0) setError('No logs found for the given criteria.');
    } catch (err) {
      console.error('Query error:', err);
      setError(err.response?.data?.message || 'Failed to fetch logs.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!logs || logs.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Admin Activity Logs', 14, 18);
    const columns = ['Date', 'Admin ID', 'Admin Name', 'Title', 'Details', 'Target'];
    const rows = logs.map(l => [
      new Date(l.createdAt).toLocaleString(),
      l.admin || '-',
      l.adminName || '-',
      l.title || '-',
      l.details ? (l.details.length > 200 ? l.details.substring(0, 197) + '...' : l.details) : '-',
      l.targetUserName || l.targetUser || '-',
    ]);
    autoTable(doc, {
      startY: 24,
      head: [columns],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [14, 47, 93] }
    });
    doc.save('admin-activity-logs.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-[#001F5B] mb-4">Admin Activity Logs</h1>

      <form onSubmit={handleQuery} className="bg-white p-6 rounded-2xl shadow mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Admin ID (optional)</label>
          <input value={adminId} onChange={e => setAdminId(e.target.value)} placeholder="Admin ID" className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 border rounded-lg" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-[#E30613] text-white px-6 py-3 rounded-lg font-bold">{loading ? 'Searching...' : 'Search'}</button>
          <button type="button" onClick={() => { setAdminId(''); setStartDate(''); setEndDate(''); setLogs([]); setError(''); }} className="bg-gray-200 px-4 py-3 rounded-lg">Clear</button>
          <button type="button" onClick={downloadPdf} className="ml-auto bg-blue-600 text-white px-4 py-3 rounded-lg" disabled={!logs || logs.length===0}>Download PDF</button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      <div className="grid gap-4">
        {logs.map(log => (
          <div key={log._id || `${log.admin}-${log.createdAt}`} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</div>
              <h3 className="text-xl font-semibold text-[#001F5B] mt-1">{log.title || '—'}</h3>
              <p className="text-gray-700 mt-2">{log.details || '-'}</p>
            </div>
            <div className="w-56 text-right">
              <div className="text-sm text-gray-500">Admin</div>
              <div className="font-medium text-gray-800">{log.adminName || log.admin || '-'}</div>
              <div className="text-sm text-gray-500 mt-3">Target</div>
              <div className="font-medium text-gray-800">{log.targetUserName || log.targetUser || '-'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminActivityLogs;
