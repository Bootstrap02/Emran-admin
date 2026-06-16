// pages/Admin/AdminSupport.jsx — Inbox view, replies go to user's email
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiUser, FiMail, FiClock, FiInbox, FiCornerUpLeft } from 'react-icons/fi';
import ReplyEmailModal from './ReplyEmailModal';

const API = 'https://campusbuy-backend-nkmx.onrender.com';

const Support = () => {
  const [conversations, setConversations] = useState([]); // list of {user, lastMessage, time}
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null); // full thread for right panel
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get(`${API}/mobilcreatemessages/inbox`);
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error('Failed to load inbox:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c =>
      c.user?.fullname?.toLowerCase().includes(q) ||
      c.user?.email?.toLowerCase().includes(q) ||
      c.lastMessage?.toLowerCase().includes(q)
    );
  }, [search, conversations]);

  const openThread = async (conv) => {
    setLoadingThread(true);
    setSelected({ user: conv.user, messages: [] });
    try {
      const res = await axios.get(`${API}/mobilcreatemessages/user/${conv.user._id}`);
      setSelected({ user: conv.user, messages: res.data.user?.messages || [] });
    } catch (err) {
      console.error('Failed to load thread:', err);
    } finally {
      setLoadingThread(false);
    }
  };

  const fmtTime = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const now  = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    return sameDay
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { day: '2-digit', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#001F5B] flex items-center gap-3">
            <FiInbox className="text-[#E30613]"/> Support Inbox
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Replies are sent directly to the member's registered email — not stored in-app.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100" style={{ minHeight: 560 }}>

          {/* ── LEFT: conversation list ── */}
          <div className="border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members…"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-16 text-gray-400 text-sm">Loading conversations…</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm">No messages yet</div>
              ) : filtered.map((conv) => (
                <button
                  key={conv.user._id}
                  onClick={() => openThread(conv)}
                  className={`w-full text-left px-4 py-3.5 flex items-start gap-3 border-b border-gray-50 transition ${
                    selected?.user?._id === conv.user._id ? 'bg-red-50' : 'hover:bg-gray-50'
                  }`}>
                  <div className="w-10 h-10 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {conv.user.image?.[0]
                      ? <img src={conv.user.image[0]} alt={conv.user.fullname} className="w-full h-full object-cover"/>
                      : <FiUser size={16} className="text-[#001F5B]"/>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="font-semibold text-[#001F5B] text-sm truncate">{conv.user.fullname}</p>
                      <span className="text-[11px] text-gray-400 flex-shrink-0 flex items-center gap-0.5">
                        <FiClock size={9}/>{fmtTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#E30613] flex-shrink-0 mt-1.5"/>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: thread view ── */}
          <div className="flex flex-col">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
                <FiInbox size={48}/>
                <p className="text-sm text-gray-400">Select a conversation to view messages</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#001F5B]/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {selected.user.image?.[0]
                        ? <img src={selected.user.image[0]} alt={selected.user.fullname} className="w-full h-full object-cover"/>
                        : <FiUser size={16} className="text-[#001F5B]"/>
                      }
                    </div>
                    <div>
                      <p className="font-bold text-[#001F5B] text-sm">{selected.user.fullname}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><FiMail size={11}/>{selected.user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setReplyOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#E30613] hover:bg-[#c20511] text-white rounded-xl text-sm font-bold transition shadow-md active:scale-95">
                    <FiCornerUpLeft size={14}/> Reply via Email
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col gap-4">
                  {loadingThread ? (
                    <div className="text-center py-16 text-gray-400 text-sm">Loading messages…</div>
                  ) : selected.messages.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">No messages in this thread yet</div>
                  ) : selected.messages.map((msg) => {
                    const fromUser = msg.createdBy === selected.user._id || msg.from === 'user';
                    return (
                      <div key={msg._id} className={`flex ${fromUser ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                          fromUser
                            ? 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                            : 'bg-[#001F5B] text-white rounded-tr-sm'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-[10px] mt-1.5 ${fromUser ? 'text-gray-400' : 'text-white/60'}`}>
                            {new Date(msg.createdAt).toLocaleString([], { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer hint instead of inline composer — replies go through modal/email */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white">
                  <button onClick={() => setReplyOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#E30613]/30 text-[#E30613] rounded-xl text-sm font-semibold hover:bg-red-50 transition">
                    <FiCornerUpLeft size={14}/> Click to reply — sent straight to {selected.user.email}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reusable reply modal */}
      <ReplyEmailModal
        user={selected?.user}
        isOpen={replyOpen}
        onClose={() => setReplyOpen(false)}
        defaultSubject={selected ? `Re: Your message to EMRAN` : ''}
      />
    </div>
  );
};

export default Support;
