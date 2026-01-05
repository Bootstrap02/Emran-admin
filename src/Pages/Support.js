// src/pages/Support.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiTrash2 } from 'react-icons/fi';

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get('/api/admin/support');
    setMessages(res.data);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    await axios.post(`/api/admin/support/${selected.id}/reply`, { reply });
    fetchMessages();
    setReply('');
    setSelected(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete message?')) {
      await axios.delete('/api/admin/support/${id}');
      fetchMessages();
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#001F5B] mb-8">Support Messages</h1>

      {/* Messages List */}
      <div className="space-y-8 mb-12">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#001F5B]">{msg.subject}</h3>
                <p className="text-gray-500">From: {msg.user.fullname} ({msg.user.email})</p>
              </div>
              <button onClick={() => handleDelete(msg.id)} className="text-red-600 hover:text-red-800">
                <FiTrash2 className="text-3xl" />
              </button>
            </div>
            <p className="text-lg text-gray-700 mb-6">{msg.message}</p>
            <button 
              onClick={() => setSelected(selected?.id === msg.id ? null : msg)}
              className="bg-[#E30613] hover:bg-[#c20511] text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition transform hover:scale-105"
            >
              {selected?.id === msg.id ? 'Cancel Reply' : 'Reply'}
            </button>
            {selected?.id === msg.id && (
              <form onSubmit={handleReply} className="mt-6 space-y-4">
                <textarea 
                  placeholder="Your response..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] h-32"
                  required
                />
                <button className="flex items-center gap-2 bg-[#001F5B] hover:bg-[#001845] text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105">
                  <FiSend /> Send Reply
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;