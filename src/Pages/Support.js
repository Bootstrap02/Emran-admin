
// pages/Admin/AdminSupport.jsx
//
// Place this file at: src/pages/Admin/AdminSupport.jsx
// Place ReplyEmailModal.jsx at: src/Components/ReplyEmailModal.jsx
// (the import path below assumes that exact layout — adjust if yours differs)
//
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiUser, FiMail, FiClock, FiInbox, FiCornerUpLeft, FiLoader, FiUserPlus } from 'react-icons/fi';
import ReplyEmailModal from '../../Components/ReplyEmailModal';

const API = 'https://campusbuy-backend-nkmx.onrender.com';

const Support = () => {
  const [conversations, setConversations] = useState([]);   // inbox: users with at least 1 message
  const [loadingInbox, setLoadingInbox]    = useState(true);

  const [search, setSearch]               = useState('');
  const [searchResults, setSearchResults] = useState(null); // null = not searching; [] = searched, no match
  const [searching, setSearching]         = useState(false);

  const [selected, setSelected]           = useState(null); // { user, messages }
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyOpen, setReplyOpen]         = useState(false);

  /* ── Load inbox once on mount ── */
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get(`${API}/mobilcreatemessages/inbox`);
        setConversations(res.data?.conversations || []);
      } catch (err) {
        console.error('Failed to load inbox:', err);
        setConversations([]);
      } finally {
        setLoadingInbox(false);
      }
    };
    fetchInbox();
  }, []);

  /* ── Debounced "search ANY member by name" — same backend FindUser uses ── */
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) { setSearchResults(null); return; }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await axios.get(`${API}/mobilcreateadmin/findusername`, {
          params: { type: 'name', query: q },
        });
        setSearchResults(res.data?.users || []);
      } catch (err) {
        console.error('Member search failed:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  /* ── Map of existing conversations by user id, for merging with search results ── */
  const conversationMap = useMemo(() => {
    const map = {};
    conversations.forEach((c) => { if (c?.user?._id) map[c.user._id] = c; });
    return map;
  }, [conversations]);

  /* ── The list actually shown: either the inbox, or search results
        merged with any existing conversation data for that person ── */
  const displayList = useMemo(() => {
    if (searchResults !== null) {
      return searchResults
        .filter((u) => u && u._id)
        .map((u) => {
          const existing = conversationMap[u._id];
          return existing || {
            user: { _id: u._id, fullname: u.fullname, email: u.email, image: u.image },
            lastMessage: '',
            lastMessageAt: null,
            unread: false,
            noHistory: true,
          };
        });
    }
    return conversations.filter((c) => c && c.user);
  }, [searchResults, conversations, conversationMap]);

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

  /* ── Select a person (from inbox OR search) and load their thread ──
        Works even for someone with zero message history. */
  const selectPerson = async (entry) => {
    const user = entry?.user;
    if (!user?._id) return;

    setSelected({ user, messages: [] });
    setLoadingThread(true);
    try {
      const res = await axios.get(`${API}/mobilcreatemessages/user/${user._id}`);
      const msgs = res.data?.user?.messages || [];
      const sorted = [...msgs].sort((a, b) => new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0));
      setSelected({ user, messages: sorted });
    } catch (err) {
      console.error('Failed to load thread:', err);
      setSelected({ user, messages: [] });
    } finally {
      setLoadingThread(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#001F5B] flex items-center gap-3">
            <FiInbox className="text-[#E30613]" /> Support Inbox
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Search any member by name to message them, or pick up an existing conversation. Replies go straight to their registered email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100" style={{ minHeight: 600 }}>

          {/* ── LEFT: search + list ── */}
          <div className="border-r border-gray-100 flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search any member by name…"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613]"
                />
                {searching && (
                  <FiLoader className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={15} />
                )}
              </div>
              {searchResults !== null && (
                <p className="text-xs text-gray-400 mt-2 px-1">
                  {searchResults.length === 0 ? 'No members match that name' : `${searchResults.length} member(s) found`}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingInbox && searchResults === null ? (
                <div className="text-center py-20 text-gray-400 text-sm">Loading conversations…</div>
              ) : displayList.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm px-6">
                  {searchResults !== null
                    ? 'No members found. Try a different spelling.'
                    : 'No messages yet — search a member above to start one.'}
                </div>
              ) : displayList.map((entry) => {
                const u = entry.user;
                const isSelected = selected?.user?._id === u._id;
                return (
                  <button
                    key={u._id}
                    onClick={() => selectPerson(entry)}
                    className={`w-full text-left px-5 py-4 flex items-start gap-4 border-b border-gray-50 transition ${
                      isSelected ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}>
                    <div className="w-11 h-11 rounded-full bg-[#001F5B]/10 flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                      {u.image?.[0]
                        ? <img src={u.image[0]} alt={u.fullname} className="w-full h-full object-cover" />
                        : <FiUser size={18} className="text-[#001F5B]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-[#001F5B] text-[15px] truncate">{u.fullname}</p>
                        {entry.lastMessageAt && (
                          <span className="text-[11px] text-gray-400 flex-shrink-0 flex items-center gap-1">
                            <FiClock size={9} />{fmtTime(entry.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{u.email}</p>
                      {entry.noHistory ? (
                        <p className="text-[13px] text-gray-400 italic mt-1.5">No messages yet — tap to send one</p>
                      ) : (
                        <p className="text-[13px] text-gray-600 truncate mt-1.5">{entry.lastMessage}</p>
                      )}
                    </div>
                    {entry.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#E30613] flex-shrink-0 mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: thread view ── */}
          <div className="flex flex-col min-h-[400px]">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3 px-6 text-center">
                <FiInbox size={48} />
                <p className="text-sm text-gray-400">Search a member or pick a conversation to get started</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#001F5B]/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {selected.user.image?.[0]
                        ? <img src={selected.user.image[0]} alt={selected.user.fullname} className="w-full h-full object-cover" />
                        : <FiUser size={16} className="text-[#001F5B]" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#001F5B] text-sm truncate">{selected.user.fullname}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 truncate"><FiMail size={11} />{selected.user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setReplyOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#E30613] hover:bg-[#c20511] text-white rounded-xl text-sm font-bold transition shadow-md active:scale-95 flex-shrink-0">
                    <FiCornerUpLeft size={14} /> Reply via Email
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col gap-4">
                  {loadingThread ? (
                    <div className="text-center py-16 text-gray-400 text-sm">Loading messages…</div>
                  ) : selected.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-300">
                      <FiUserPlus size={40} />
                      <p className="text-sm text-gray-400">No messages in this thread yet.<br />Use "Reply via Email" to send the first one.</p>
                    </div>
                  ) : selected.messages.map((msg, idx) => {
                    if (!msg) return null;
                    const fromUser = String(msg.createdBy) === String(selected.user._id);
                    return (
                      <div key={msg._id || idx} className={`flex ${fromUser ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
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

                <div className="px-6 py-4 border-t border-gray-100 bg-white">
                  <button onClick={() => setReplyOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#E30613]/30 text-[#E30613] rounded-xl text-sm font-semibold hover:bg-red-50 transition">
                    <FiCornerUpLeft size={14} /> Reply — sent straight to {selected.user.email}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reusable reply modal — same one used in AllUsers / FindUser */}
      <ReplyEmailModal
        user={selected?.user}
        isOpen={replyOpen}
        onClose={() => setReplyOpen(false)}
        defaultSubject={selected ? 'Re: Your message to EMRAN' : ''}
      />
    </div>
  );
};

export default Support;
