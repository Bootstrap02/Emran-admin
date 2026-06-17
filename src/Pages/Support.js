
// pages/Admin/AdminSupport.jsx
//
// THE "SUPPORT" COMPONENT — separate from Messages.jsx.
// Purpose: shows existing conversations (the inbox) and lets you reply to
// whichever one you click. No search here — that's what Messages.jsx is for.
//
// Layout: the reply panel is pinned at the top and never scrolls. Only the
// conversation list below it scrolls (its own capped-height box), with a
// delete icon per row so old threads don't pile up.
//
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiSend, FiUser, FiMail, FiCheckCircle, FiXCircle, FiLoader,
  FiX, FiTrash2, FiInbox, FiClock, FiCornerUpLeft,
} from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com';

const Support = () => {
  /* ── Reply panel (top, pinned) ── */
  const [selectedUser, setSelectedUser] = useState(null);
  const [subject, setSubject]           = useState('');
  const [message, setMessage]           = useState('');
  const [sending, setSending]           = useState(false);
  const [feedback, setFeedback]         = useState(null);

  /* ── Conversation list (bottom, scrollable) ── */
  const [conversations, setConversations] = useState([]);
  const [loadingInbox, setLoadingInbox]    = useState(true);
  const [deletingId, setDeletingId]        = useState(null);

  /* ── Read-first modal: clicking a conversation opens this to show the
        actual message before doing anything else. Reply lives inside it. ── */
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUser, setViewUser]           = useState(null);
  const [viewMessages, setViewMessages]   = useState([]);
  const [viewLoading, setViewLoading]     = useState(false);

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

  /* Loads a person into the pinned reply panel above */
  const selectConversation = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setSubject('');
    setMessage('');
  };

  /* Clicking a conversation row opens the read-first modal instead of
     jumping straight to reply — you need to read the message first. */
  const openViewModal = async (conv) => {
    if (!conv?.user) return;
    setViewUser(conv.user);
    setViewMessages([]);
    setViewModalOpen(true);
    setViewLoading(true);
    try {
      const res = await axios.get(`${API}/mobilcreatemessages/user/${conv.user._id}`);
      const msgs = res.data?.user?.messages || [];
      const sorted = [...msgs].sort((a, b) => new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0));
      setViewMessages(sorted);
    } catch (err) {
      console.error('Failed to load thread:', err);
      setViewMessages([]);
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewUser(null);
    setViewMessages([]);
  };

  /* The Reply button lives inside the read modal — clicking it closes the
     modal and loads that person into the pinned reply panel above. */
  const handleReplyFromModal = () => {
    selectConversation(viewUser);
    closeViewModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSelected = () => {
    setSelectedUser(null);
    setSubject('');
    setMessage('');
  };

  const handleSend = async () => {
    if (!selectedUser)   return showFeedback('error', 'Select a conversation below first.');
    if (!subject.trim()) return showFeedback('error', 'Please enter a subject.');
    if (!message.trim()) return showFeedback('error', 'Please enter a message.');

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
      fetchInbox(); // refresh so the updated "last message" reflects the reply
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (e, userId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this entire conversation? This cannot be undone.')) return;
    setDeletingId(userId);
    try {
      await axios.delete(`${API}/mobilcreatemessages/conversation/${userId}`);
      setConversations((prev) => prev.filter((c) => c.user._id !== userId));
      if (selectedUser?._id === userId) clearSelected();
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

        {/* ════════════════ TOP — pinned reply panel, never scrolls ════════════════ */}
        <div className="sticky top-4 z-20 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 mb-8">
          <h1 className="text-2xl font-extrabold text-[#001F5B] mb-1 flex items-center gap-2">
            <FiInbox className="text-[#E30613]" /> Support Inbox
          </h1>
          <p className="text-gray-500 text-sm mb-6">Pick a conversation below to reply — it'll appear here.</p>

          {feedback && (
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl mb-5 text-sm font-semibold ${
              feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {feedback.type === 'success' ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
              {feedback.text}
            </div>
          )}

          {!selectedUser ? (
            <div className="text-center py-10 text-gray-400">
              <FiInbox size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversation selected. Choose one from the list below.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-green-200">
                    {selectedUser.image?.[0]
                      ? <img src={selectedUser.image[0]} alt={selectedUser.fullname} className="w-full h-full object-cover" />
                      : <FiUser size={14} className="text-green-700" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-green-800 truncate">Replying to {selectedUser.fullname}</p>
                    <p className="text-xs text-green-600 truncate flex items-center gap-1"><FiMail size={10} />{selectedUser.email}</p>
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
                    placeholder="Type your reply here…" rows={6}
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
                  {sending ? <><FiLoader className="animate-spin" size={16} /> Sending…</> : <><FiSend size={16} /> Send Reply</>}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ════════════════ BOTTOM — scrollable conversation list, with delete ════════════════ */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#001F5B] mb-1">Conversations</h2>
          <p className="text-gray-400 text-xs mb-5">Tap a row to load it into the reply panel above, or delete a conversation entirely.</p>

          <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-50 border border-gray-50 rounded-2xl">
            {loadingInbox ? (
              <div className="text-center py-16 text-gray-400 text-sm">Loading conversations…</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">No messages yet.</div>
            ) : conversations.map((conv) => {
              if (!conv?.user?._id) return null;
              const u = conv.user;
              const isSelected = selectedUser?._id === u._id;
              return (
                <div key={u._id} onClick={() => openViewModal(conv)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-4 transition cursor-pointer ${isSelected ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
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

      {/* ════════════════ READ-FIRST MODAL ════════════════
          Opens when you click a conversation row. Shows the actual
          message thread so you can read it before replying. Reply
          button lives inside here, not on the row itself. */}
      {viewModalOpen && viewUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4" onClick={closeViewModal}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {viewUser.image?.[0]
                    ? <img src={viewUser.image[0]} alt={viewUser.fullname} className="w-full h-full object-cover" />
                    : <FiUser size={16} className="text-[#001F5B]" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#001F5B] text-sm truncate">{viewUser.fullname}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 truncate"><FiMail size={11} />{viewUser.email}</p>
                </div>
              </div>
              <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-3">
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col gap-4">
              {viewLoading ? (
                <div className="text-center py-16 text-gray-400 text-sm">Loading message…</div>
              ) : viewMessages.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm">No messages in this thread.</div>
              ) : viewMessages.map((msg, idx) => {
                if (!msg) return null;
                const fromUser = String(msg.createdBy) === String(viewUser._id);
                return (
                  <div key={msg._id || idx} className={`flex ${fromUser ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      fromUser
                        ? 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                        : 'bg-[#001F5B] text-white rounded-tr-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-[10px] mt-1.5 ${fromUser ? 'text-gray-400' : 'text-white/60'}`}>
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
              <button onClick={closeViewModal}
                className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm transition">
                Close
              </button>
              <button onClick={handleReplyFromModal}
                className="flex-1 px-5 py-3 bg-[#E30613] hover:bg-[#c20511] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-95">
                <FiCornerUpLeft size={14} /> Reply
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
