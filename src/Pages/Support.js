
// pages/Admin/AdminSupport.jsx
//
// Layout: the search + compose panel is pinned at the top of the page and
// never scrolls. Only the message-history list below it scrolls internally
// (its own capped-height box), with a delete icon per row.
//
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiSearch, FiSend, FiUser, FiMail, FiPhone, FiCheckCircle, FiXCircle,
  FiLoader, FiX, FiTrash2, FiInbox, FiClock,
} from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com';

const Support = () => {
  /* ── Search (mirrors FindUser exactly: type → press Search) ── */
  const [searchType, setSearchType]   = useState('name'); // name | email | phone
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null); // null = no search run yet
  const [searchLoading, setSearchLoading]  = useState(false);
  const [searchError, setSearchError]      = useState('');

  /* ── Compose ── */
  const [selectedUser, setSelectedUser] = useState(null);
  const [subject, setSubject]           = useState('');
  const [message, setMessage]           = useState('');
  const [sending, setSending]           = useState(false);
  const [feedback, setFeedback]         = useState(null);

  /* ── History (scrollable, below) ── */
  const [conversations, setConversations] = useState([]);
  const [loadingInbox, setLoadingInbox]    = useState(true);
  const [deletingId, setDeletingId]        = useState(null);

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const adminName = adminData?.fullname || 'EMRAN Admin';

  const fetchInbox = useCallback(async () => {
    setLoadingInbox(true);
    try {
      const res = await axios.get(`${API}/mobilcreatemessages/inbox`);
      setConversations(res.data?.conversations || []);
    } catch (err) {
      console.error('Failed to load inbox:', err);
      setConversations([]);
    } finally {
      setLoadingInbox(false);
    }
  }, []);

  useEffect(() => { fetchInbox(); }, [fetchInbox]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  /* ── Search: identical pattern to FindUser — built as a query-string URL,
        triggered only by submit, not on every keystroke. ── */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setSearchError('Please enter a search term'); return; }

    setSearchLoading(true);
    setSearchError('');
    setSearchResults(null);

    try {
      const res = await axios.get(
        `${API}/mobilcreateadmin/findusername?type=${searchType}&query=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchResults(res.data.users || res.data || []);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to search users';
      setSearchError(errMsg);
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const pickUser = (u) => {
    setSelectedUser(u);
    setSearchResults(null);
    setSearchQuery('');
    setSearchError('');
  };

  const clearSelected = () => {
    setSelectedUser(null);
    setSubject('');
    setMessage('');
  };

  const handleSend = async () => {
    if (!selectedUser)    return showFeedback('error', 'Please find and select a member first.');
    if (!subject.trim())  return showFeedback('error', 'Please enter a subject.');
    if (!message.trim())  return showFeedback('error', 'Please enter a message.');

    setSending(true);
    try {
      await axios.post(`${API}/mobilcreateuser/support-email`, {
        userId:  selectedUser._id,
        subject: subject.trim(),
        message: message.trim(),
        adminName,
      });
      showFeedback('success', `Message sent to ${selectedUser.email}`);
      setSubject('');
      setMessage('');
      setSelectedUser(null);
      fetchInbox(); // refresh history so the new conversation appears
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  /* Clicking a history row pre-fills the compose panel above with that person */
  const quickReply = (user) => {
    setSelectedUser(user);
    setSubject('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (e, userId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this entire conversation? This cannot be undone.')) return;
    setDeletingId(userId);
    try {
      await axios.delete(`${API}/mobilcreatemessages/conversation/${userId}`);
      setConversations((prev) => prev.filter((c) => c.user._id !== userId));
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      alert(err.response?.data?.message || 'Failed to delete conversation');
    } finally {
      setDeletingId(null);
    }
  };

  const fmtTime = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    return sameDay
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { day: '2-digit', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ════════════════ TOP — fixed, never scrolls ════════════════ */}
        <div className="sticky top-4 z-20 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 mb-8">
          <h1 className="text-2xl font-extrabold text-[#001F5B] mb-1">Member Support</h1>
          <p className="text-gray-500 text-sm mb-6">Find a member, then send a message straight to their registered email.</p>

          {feedback && (
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl mb-5 text-sm font-semibold ${
              feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {feedback.type === 'success' ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
              {feedback.text}
            </div>
          )}

          {!selectedUser ? (
            <>
              {/* ── Search form — same shape as FindUser ── */}
              <form onSubmit={handleSearch}>
                <div className="flex flex-wrap gap-5 mb-4">
                  {['name', 'email', 'phone'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="searchType" value={t} checked={searchType === t}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="w-4 h-4 text-[#E30613] border-gray-300 focus:ring-[#E30613]" />
                      <span className="text-sm font-medium text-gray-700 capitalize">By {t}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === 'name' ? 'Type a full name…' :
                      searchType === 'email' ? 'Type an email…' : 'Type a phone number…'
                    }
                    className="w-full min-w-0 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition text-sm"
                  />
                  <button type="submit" disabled={searchLoading}
                    className="w-full sm:w-auto px-5 py-3 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition font-bold flex items-center justify-center gap-2 text-sm flex-shrink-0">
                    {searchLoading ? <FiLoader className="animate-spin" /> : <FiSearch />} Search
                  </button>
                </div>
              </form>

              {searchError && (
                <p className="text-red-600 text-sm mt-3">{searchError}</p>
              )}

              {/* ── Search results ── */}
              {searchResults !== null && (
                <div className="mt-5 border border-gray-100 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">No members found matching that search.</div>
                  ) : searchResults.map((u) => (
                    <button key={u._id} onClick={() => pickUser(u)}
                      className="w-full text-left px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-b-0 hover:bg-red-50/40 transition">
                      <div className="w-10 h-10 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {u.image?.[0]
                          ? <img src={u.image[0]} alt={u.fullname} className="w-full h-full object-cover" />
                          : <FiUser size={16} className="text-[#001F5B]" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#001F5B] text-sm truncate">{u.fullname}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><FiMail size={11} />{u.email}</div>
                        {u.phone && <div className="flex items-center gap-1 text-xs text-gray-400"><FiPhone size={11} />{u.phone}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* ── Selected member + compose ── */}
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-green-200">
                    {selectedUser.image?.[0]
                      ? <img src={selectedUser.image[0]} alt={selectedUser.fullname} className="w-full h-full object-cover" />
                      : <FiUser size={14} className="text-green-700" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-green-800 truncate">{selectedUser.fullname}</p>
                    <p className="text-xs text-green-600 truncate">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={clearSelected} className="text-green-700 hover:text-green-900 flex-shrink-0 ml-3">
                  <FiX size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Subject <span className="text-[#E30613]">*</span>
                  </label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Re: Your membership dues"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Message <span className="text-[#E30613]">*</span>
                  </label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here…" rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613] resize-none leading-relaxed" />
                </div>
                <p className="text-xs text-gray-400">
                  Sending as <span className="font-semibold text-gray-600">{adminName}</span> via EMRAN Secretariat
                </p>
                <button onClick={handleSend} disabled={sending || !subject.trim() || !message.trim()}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition ${
                    sending || !subject.trim() || !message.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#E30613] hover:bg-[#c20511] text-white shadow-lg active:scale-95'
                  }`}>
                  {sending ? <><FiLoader className="animate-spin" size={16} /> Sending…</> : <><FiSend size={16} /> Send Message</>}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ════════════════ BOTTOM — scrollable history, with delete ════════════════ */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#001F5B] flex items-center gap-2 mb-1">
            <FiInbox className="text-[#E30613]" /> Message History
          </h2>
          <p className="text-gray-400 text-xs mb-5">Tap a row to quickly reply to that member, or delete a conversation entirely.</p>

          <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-50 border border-gray-50 rounded-2xl">
            {loadingInbox ? (
              <div className="text-center py-16 text-gray-400 text-sm">Loading message history…</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">No messages yet. Search a member above to send the first one.</div>
            ) : conversations.map((conv) => {
              if (!conv?.user?._id) return null;
              const u = conv.user;
              return (
                <div key={u._id} onClick={() => quickReply(u)}
                  className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition cursor-pointer">
                  <div className="w-11 h-11 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                    {u.image?.[0]
                      ? <img src={u.image[0]} alt={u.fullname} className="w-full h-full object-cover" />
                      : <FiUser size={18} className="text-[#001F5B]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-[#001F5B] text-[15px] truncate">{u.fullname}</p>
                      {conv.lastMessageAt && (
                        <span className="text-[11px] text-gray-400 flex-shrink-0 flex items-center gap-1">
                          <FiClock size={9} />{fmtTime(conv.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{u.email}</p>
                    <p className="text-[13px] text-gray-600 truncate mt-1.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && <span className="w-2 h-2 rounded-full bg-[#E30613] flex-shrink-0 mt-2" />}
                  <button onClick={(e) => handleDelete(e, u._id)} disabled={deletingId === u._id}
                    title="Delete conversation"
                    className="text-gray-300 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50 flex-shrink-0">
                    {deletingId === u._id ? <FiLoader className="animate-spin" size={16} /> : <FiTrash2 size={16} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
