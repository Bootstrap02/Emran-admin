// pages/admin/AdminElections.jsx
// Full admin elections management:
// - Create election (with positions + candidates inline)
// - View live vote counts
// - Add positions/candidates to existing election
// - End election
// - Declare results
// - Delete election

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiCheckCircle, FiXCircle, FiLoader,
         FiBarChart2, FiUser, FiCalendar, FiAward } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateelection';

const NAVY = '#001F5B';
const RED  = '#E30613';

const statusBadge = (status) => {
  const map = {
    upcoming:          { label: 'Upcoming',          cls: 'bg-blue-100 text-blue-700' },
    active:            { label: 'Active',            cls: 'bg-green-100 text-green-700' },
    ended:             { label: 'Ended',             cls: 'bg-gray-100 text-gray-600' },
    results_declared:  { label: 'Results Declared',  cls: 'bg-purple-100 text-purple-700' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.cls}`}>{s.label}</span>;
};

const emptyCandidate = () => ({ fullName: '', photo: '', manifesto: '' });
const emptyPosition  = () => ({ title: '', candidates: [emptyCandidate()] });

// ── Create Election Form ─────────────────────────────────────────────────────
const CreateElectionForm = ({ adminId, onCreated }) => {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [startDate,   setStartDate]   = useState('');
  const [positions,   setPositions]   = useState([emptyPosition()]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const addPosition  = () => setPositions(p => [...p, emptyPosition()]);
  const removePosition = (pi) => setPositions(p => p.filter((_, i) => i !== pi));

  const setPositionTitle = (pi, val) =>
    setPositions(p => p.map((pos, i) => i === pi ? { ...pos, title: val } : pos));

  const addCandidate = (pi) =>
    setPositions(p => p.map((pos, i) => i === pi
      ? { ...pos, candidates: [...pos.candidates, emptyCandidate()] }
      : pos));

  const removeCandidate = (pi, ci) =>
    setPositions(p => p.map((pos, i) => i === pi
      ? { ...pos, candidates: pos.candidates.filter((_, j) => j !== ci) }
      : pos));

  const setCandidateField = (pi, ci, field, val) =>
    setPositions(p => p.map((pos, i) => i === pi
      ? { ...pos, candidates: pos.candidates.map((c, j) => j === ci ? { ...c, [field]: val } : c) }
      : pos));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !startDate) { setError('Title and start date are required'); return; }
    for (const pos of positions) {
      if (!pos.title.trim()) { setError('All positions must have a title'); return; }
      for (const c of pos.candidates) {
        if (!c.fullName.trim()) { setError('All candidates must have a name'); return; }
      }
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/create`, {
        title, description, startDate, positions, adminId,
      });
      onCreated(res.data.election);
      setTitle(''); setDescription(''); setStartDate('');
      setPositions([emptyPosition()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#E30613] focus:outline-none transition";

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
      <h2 className="text-2xl font-extrabold text-[#001F5B] mb-6 flex items-center gap-3">
        <FiPlus className="text-[#E30613]" /> Create New Election
      </h2>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <FiXCircle /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Election basics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Election Title <span className="text-red-500">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. EMRAN Executive Elections 2026"
              className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
            <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)}
              className={inputCls} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (optional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Brief description of this election..."
            rows={2} className={inputCls + ' resize-none'} />
        </div>

        {/* Positions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#001F5B]">Positions & Candidates</h3>
            <button type="button" onClick={addPosition}
              className="flex items-center gap-2 text-sm font-semibold text-[#001F5B] border-2 border-[#001F5B] px-4 py-2 rounded-xl hover:bg-[#001F5B] hover:text-white transition">
              <FiPlus /> Add Position
            </button>
          </div>

          <div className="space-y-6">
            {positions.map((pos, pi) => (
              <div key={pi} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#001F5B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {pi + 1}
                  </div>
                  <input value={pos.title} onChange={e => setPositionTitle(pi, e.target.value)}
                    placeholder="Position title, e.g. President"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:border-[#E30613] focus:outline-none" />
                  {positions.length > 1 && (
                    <button type="button" onClick={() => removePosition(pi)}
                      className="text-red-500 hover:text-red-700 p-1"><FiTrash2 /></button>
                  )}
                </div>

                {/* Candidates */}
                <div className="space-y-3 ml-10">
                  {pos.candidates.map((c, ci) => (
                    <div key={ci} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FiUser className="text-gray-400 flex-shrink-0" />
                        <input value={c.fullName}
                          onChange={e => setCandidateField(pi, ci, 'fullName', e.target.value)}
                          placeholder="Candidate's full name *"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E30613] focus:outline-none" />
                        {pos.candidates.length > 1 && (
                          <button type="button" onClick={() => removeCandidate(pi, ci)}
                            className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"><FiTrash2 className="text-sm" /></button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input value={c.photo}
                          onChange={e => setCandidateField(pi, ci, 'photo', e.target.value)}
                          placeholder="Photo URL (optional)"
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E30613] focus:outline-none" />
                        <input value={c.manifesto}
                          onChange={e => setCandidateField(pi, ci, 'manifesto', e.target.value)}
                          placeholder="Brief manifesto (optional)"
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E30613] focus:outline-none" />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addCandidate(pi)}
                    className="text-sm text-[#E30613] font-semibold flex items-center gap-1 hover:underline">
                    <FiPlus className="text-xs" /> Add Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg transition flex items-center justify-center gap-3"
          style={{ background: loading ? '#9CA3AF' : RED }}>
          {loading ? <><FiLoader className="animate-spin" /> Creating Election...</> : 'Create Election'}
        </button>
      </form>
    </div>
  );
};

// ── Election Card (live view + actions) ──────────────────────────────────────
const ElectionCard = ({ election: initElection, onDeleted }) => {
  const [election, setElection] = useState(initElection);
  const [expanded, setExpanded] = useState(false);
  const [loading,  setLoading]  = useState('');
  const [msg,      setMsg]      = useState('');

  const refresh = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/${election._id}`);
      setElection(res.data.election);
    } catch {}
  }, [election._id]);

  // Auto-refresh every 15s when active
  useEffect(() => {
    if (election.status !== 'active') return;
    const timer = setInterval(refresh, 15000);
    return () => clearInterval(timer);
  }, [election.status, refresh]);

  const action = async (label, fn) => {
    if (!window.confirm(`${label}?`)) return;
    setLoading(label);
    try {
      const res = await fn();
      setElection(res.data.election);
      setMsg(res.data.message);
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading('');
    }
  };

  const totalVotes = election.positions.reduce((s, p) =>
    s + p.candidates.reduce((cs, c) => cs + (c.voteCount || 0), 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-5 cursor-pointer"
        onClick={() => setExpanded(x => !x)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-[#001F5B] truncate">{election.title}</h3>
            {statusBadge(election.status)}
          </div>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-3">
            <FiCalendar className="flex-shrink-0" />
            Start: {new Date(election.startDate).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
            {election.endDate && <> · End: {new Date(election.endDate).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</>}
            · {election.positions.length} position{election.positions.length > 1 ? 's' : ''}
            · {election.voters.length} voter{election.voters.length !== 1 ? 's' : ''}
            · {totalVotes} total votes
          </p>
        </div>
        <span className="text-gray-400 ml-4 flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {msg && (
            <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
              msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {msg.toLowerCase().includes('fail') ? <FiXCircle /> : <FiCheckCircle />} {msg}
            </div>
          )}

          {/* Vote tallies by position */}
          <div className="mt-5 space-y-5">
            {election.positions.map((pos, pi) => (
              <div key={pi}>
                <h4 className="text-sm font-bold text-[#001F5B] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FiBarChart2 /> {pos.title}
                </h4>
                <div className="space-y-2">
                  {[...pos.candidates]
                    .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
                    .map((c, ci) => {
                      const posTotal = pos.candidates.reduce((s, x) => s + (x.voteCount || 0), 0);
                      const pct = posTotal > 0 ? Math.round((c.voteCount / posTotal) * 100) : 0;
                      return (
                        <div key={ci} className="flex items-center gap-3">
                          {c.photo
                            ? <img src={c.photo} alt={c.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200" />
                            : <div className="w-8 h-8 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#001F5B]">
                                {c.fullName.charAt(0)}
                              </div>
                          }
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-semibold text-gray-800 truncate">{c.fullName}</span>
                              <span className="text-gray-500 flex-shrink-0 ml-2">{c.voteCount || 0} votes ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, background: ci === 0 ? RED : NAVY }} />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
            {election.status === 'active' && (
              <button disabled={!!loading}
                onClick={() => action('End Election', () => axios.put(`${API}/${election._id}/end`))}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60">
                {loading === 'End Election' ? <FiLoader className="animate-spin" /> : <FiXCircle />} End Election
              </button>
            )}
            {election.status === 'ended' && (
              <button disabled={!!loading}
                onClick={() => action('Declare Results', () => axios.put(`${API}/${election._id}/declare-results`))}
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60"
                style={{ background: RED }}>
                {loading === 'Declare Results' ? <FiLoader className="animate-spin" /> : <FiAward />} Declare Results
              </button>
            )}
            {election.status === 'results_declared' && election.winner && (
              <div className="bg-purple-50 border border-purple-200 text-purple-800 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2">
                <FiAward className="text-purple-600" /> {election.winner}
              </div>
            )}
            <button disabled={!!loading}
              onClick={() => action('Delete this election permanently', () => axios.delete(`${API}/${election._id}`))
                .then(() => onDeleted(election._id))}
              className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition ml-auto disabled:opacity-60">
              {loading === 'Delete this election permanently' ? <FiLoader className="animate-spin" /> : <FiTrash2 />} Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Admin Elections Page ─────────────────────────────────────────────────
const AdminElections = () => {
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const adminId   = adminData?._id || adminData?.id || null;

  const loadElections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/all`);
      setElections(res.data.elections || []);
    } catch (err) {
      console.error('Failed to load elections:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadElections(); }, [loadElections]);

  const handleCreated = (newElection) => {
    setElections(prev => [newElection, ...prev]);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleted = (id) => setElections(prev => prev.filter(e => e._id !== id));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#001F5B]">Elections</h1>
            <p className="text-gray-500 mt-1">Create, manage, and declare results for EMRAN elections.</p>
          </div>
          <button onClick={() => setShowForm(x => !x)}
            className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl transition"
            style={{ background: showForm ? '#6B7280' : RED }}>
            {showForm ? <><FiXCircle /> Cancel</> : <><FiPlus /> New Election</>}
          </button>
        </div>

        {/* Create form */}
        {showForm && <CreateElectionForm adminId={adminId} onCreated={handleCreated} />}

        {/* Election list */}
        {loading ? (
          <div className="text-center py-20 text-[#001F5B] text-xl animate-pulse">Loading elections...</div>
        ) : elections.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-2xl font-bold text-[#001F5B] mb-2">No elections yet</h3>
            <p className="text-gray-500">Click "New Election" above to create your first election.</p>
          </div>
        ) : (
          elections.map(el => (
            <ElectionCard key={el._id} election={el} onDeleted={handleDeleted} />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminElections;

