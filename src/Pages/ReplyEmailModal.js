// components/ReplyEmailModal.jsx
// Reusable modal — drop anywhere in admin pages.
// Usage:
//   <ReplyEmailModal
//     user={selectedUser}          // { _id, fullname, email }
//     isOpen={replyModalOpen}
//     onClose={() => setReplyModalOpen(false)}
//     defaultSubject="Re: Your enquiry"   // optional
//   />

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiSend, FiUser, FiMail, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com';

const ReplyEmailModal = ({ user, isOpen, onClose, defaultSubject = '' }) => {
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('');
  const [sending, setSending]   = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, text }

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const adminName = adminData?.fullname || 'EMRAN Admin';

  /* Reset whenever a new user is selected or modal opens */
  useEffect(() => {
    if (isOpen) {
      setSubject(defaultSubject);
      setMessage('');
      setFeedback(null);
    }
  }, [isOpen, defaultSubject]);

  if (!isOpen || !user) return null;

  const handleSend = async () => {
    if (!subject.trim()) { setFeedback({ type: 'error', text: 'Please enter a subject.' }); return; }
    if (!message.trim()) { setFeedback({ type: 'error', text: 'Please enter a message.' }); return; }

    setSending(true);
    setFeedback(null);

    try {
      await axios.post(`${API}/mobilcreateuser/support-email`, {
        userId:   user._id,
        subject:  subject.trim(),
        message:  message.trim(),
        adminName,
      });
      setFeedback({ type: 'success', text: `Email sent to ${user.email}` });
      setMessage('');
      setTimeout(() => { onClose(); setFeedback(null); }, 1800);
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to send. Try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#001F5B] to-[#003494] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center overflow-hidden flex-shrink-0">
              {user.image?.[0]
                ? <img src={user.image[0]} alt={user.fullname} className="w-full h-full object-cover"/>
                : <FiUser size={18} className="text-white"/>
              }
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">{user.fullname}</p>
              <p className="text-white/65 text-xs flex items-center gap-1">
                <FiMail size={10}/>{user.email}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/12 flex items-center justify-center text-white hover:bg-white/20 transition text-lg">
            <FiX/>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 flex flex-col gap-4">

          {/* Feedback banner */}
          {feedback && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${
              feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {feedback.type === 'success' ? <FiCheckCircle/> : <FiXCircle/>}
              {feedback.text}
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Subject <span className="text-[#E30613]">*</span>
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Re: Your membership dues"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Message <span className="text-[#E30613]">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here…"
              rows={7}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 focus:border-[#E30613] resize-none leading-relaxed"
            />
          </div>

          {/* Sender note */}
          <p className="text-xs text-gray-400">
            Sending as <span className="font-semibold text-gray-600">{adminName}</span> · reply goes directly to {user.email}
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm transition">
            Cancel
          </button>
          <button onClick={handleSend} disabled={sending || !subject.trim() || !message.trim()}
            className={`px-7 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
              sending || !subject.trim() || !message.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#E30613] hover:bg-[#c20511] text-white shadow-md active:scale-95'
            }`}>
            {sending ? <><FiLoader className="animate-spin" size={14}/>Sending…</> : <><FiSend size={14}/>Send Email</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyEmailModal;
