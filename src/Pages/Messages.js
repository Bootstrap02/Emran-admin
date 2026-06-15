// pages/Admin/AdminSupport.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiSend, FiUser, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com';

const Messages = () => {
  const [users,       setUsers]       = useState([]);
  const [filtered,   setFiltered]    = useState([]);
  const [search,     setSearch]      = useState('');
  const [selected,   setSelected]    = useState(null);
  const [subject,    setSubject]     = useState('');
  const [message,    setMessage]     = useState('');
  const [sending,    setSending]     = useState(false);
  const [feedback,   setFeedback]    = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const adminName = adminData?.fullname || 'EMRAN Admin';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/mobilcreateadmin/users`);
        const list = res.data.users || [];
        setUsers(list);
        setFiltered(list);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) { setFiltered(users); return; }
    setFiltered(users.filter(u =>
      u.fullname?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    ));
  }, [search, users]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSend = async () => {
    if (!selected)       return showFeedback('error', 'Please select a member first.');
    if (!subject.trim()) return showFeedback('error', 'Please enter a subject.');
    if (!message.trim()) return showFeedback('error', 'Please enter a message.');

    setSending(true);
    try {
      await axios.post(`${API}/mobilcreateuser/support-email`, {
        userId:   selected._id,
        subject:  subject.trim(),
        message:  message.trim(),
        adminName,
      });
      showFeedback('success', `Message sent to ${selected.email}`);
      setSubject('');
      setMessage('');
      setSelected(null);
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const roleColor = (role) => {
    if (role === 'member')            return 'bg-green-100 text-green-700';
    if (role === 'prospectiveMember') return 'bg-yellow-100 text-yellow-700';
    if (role === 'prospect')          return 'bg-gray-100 text-gray-600';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#001F5B]">Member Support</h1>
        <p className="text-gray-500 mt-1">Send a message directly to a member's registered email address.</p>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold ${feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {feedback.type === 'success' ? <FiCheckCircle size={18}/> : <FiXCircle size={18}/>}
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* ── LEFT: Member selector ── */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#001F5B]">Select Member</h2>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or phone…"
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613]"
            />
          </div>

          {/* Member list */}
          <div className="flex-1 overflow-y-auto max-h-[420px] flex flex-col gap-2 pr-1">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <FiLoader className="animate-spin mr-2" size={20}/> Loading members…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No members found.</div>
            ) : filtered.map(u => (
              <button key={u._id} onClick={() => setSelected(u)}
                className={`w-full text-left px-4 py-3 rounded-2xl border transition flex items-start gap-3 ${
                  selected?._id === u._id
                    ? 'border-[#E30613] bg-red-50 shadow'
                    : 'border-gray-100 bg-gray-50 hover:border-[#E30613]/30 hover:bg-red-50/40'
                }`}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {u.image?.[0]
                    ? <img src={u.image[0]} alt={u.fullname} className="w-full h-full object-cover"/>
                    : <FiUser size={16} className="text-[#001F5B]"/>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#001F5B] text-sm truncate">{u.fullname}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${roleColor(u.role)}`}>{u.role}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <FiMail size={11}/><span className="truncate">{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FiPhone size={11}/><span>{u.phone}</span>
                    </div>
                  )}
                </div>
                {selected?._id === u._id && (
                  <FiCheckCircle size={18} className="text-[#E30613] flex-shrink-0 mt-1"/>
                )}
              </button>
            ))}
          </div>

          {/* Selected summary */}
          {selected && (
            <div className="bg-[#001F5B]/5 rounded-2xl px-4 py-3 text-sm text-[#001F5B]">
              <span className="font-bold">Selected:</span> {selected.fullname}
              <span className="text-gray-500 ml-2">({selected.email})</span>
            </div>
          )}
        </div>

        {/* ── RIGHT: Compose message ── */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5">
          <h2 className="text-lg font-bold text-[#001F5B]">Compose Message</h2>

          {/* To field (read-only preview) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">To</label>
            <div className={`px-4 py-3 rounded-xl border text-sm ${selected ? 'border-green-200 bg-green-50 text-green-800 font-medium' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
              {selected ? `${selected.fullname} <${selected.email}>` : 'No member selected'}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject <span className="text-[#E30613]">*</span></label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Re: Your membership dues"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613]"
            />
          </div>

          {/* Message */}
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message <span className="text-[#E30613]">*</span></label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message here…"
              rows={10}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613] resize-none leading-relaxed"
            />
          </div>

          {/* Sender tag */}
          <div className="text-xs text-gray-400">
            Sending as: <span className="font-semibold text-gray-600">{adminName}</span> via EMRAN Secretariat
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={sending || !selected || !subject.trim() || !message.trim()}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition ${
              sending || !selected || !subject.trim() || !message.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#E30613] hover:bg-[#c20511] text-white shadow-lg active:scale-95'
            }`}>
            {sending
              ? <><FiLoader className="animate-spin" size={16}/> Sending…</>
              : <><FiSend size={16}/> Send Message</>
            }
          </button>
        </div>

      </div>
    </div>
  );
};

export default Messages;
