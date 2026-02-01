// src/pages/Messages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiSend, FiUser, FiLoader } from 'react-icons/fi';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messages = JSON.parse(localStorage.getItem('messages'));


  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {

        setConversations(messages.data || []);
      } catch (err) {
        setError('Failed to load conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const openChatModal = (chat) => {
    setSelectedChat(chat);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedChat(null);
    setReplyText('');
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedChat) return;

    try {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        text: replyText.trim(),
        time: 'Just now',
      };

      // Simulate UI update
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: replyText.trim(),
        lastMessageTime: 'Just now',
      }));

      // Real API call
      await axios.post('https://campusbuy-backend-nkmx.onrender.com/mobilcreatemessages', {
        receiverId: selectedChat.id,
        content: replyText.trim(),
      });

      setReplyText('');
    } catch (err) {
      alert('Failed to send message');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="text-6xl text-[#E30613] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Messages & Conversations
          </h1>
          <p className="text-xl text-gray-600">
            View and reply to messages from super admin
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="divide-y divide-gray-200">
            {conversations.length === 0 ? (
              <div className="p-16 text-center text-gray-500 text-xl">
                No messages yet
              </div>
            ) : (
              conversations.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => openChatModal(chat)}
                  className="flex items-center gap-6 p-6 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    {chat.sender.avatar ? (
                      <img
                        src={chat.sender.avatar}
                        alt={chat.sender.fullname}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#E30613]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#E30613]/10 flex items-center justify-center">
                        <FiUser className="text-3xl text-[#E30613]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {chat.sender.fullname || chat.sender}
                    </p>
                    <p className="text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>

                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {chat.lastMessageTime}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {modalOpen && selectedChat && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedChat.sender.avatar ? (
                  <img
                    src={selectedChat.sender.avatar}
                    alt={selectedChat.sender.fullname}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <FiUser className="text-4xl text-white" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedChat.sender.fullname || selectedChat.sender}
                  </h2>
                  <p className="text-sm opacity-90">Super Admin</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-white hover:text-[#E30613] text-3xl">
                <FiX />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              {selectedChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-6 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 shadow ${
                      msg.sender === 'You'
                        ? 'bg-[#E30613] text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-base leading-relaxed">{msg.text}</p>
                    <p className="text-xs mt-2 opacity-70 text-right">
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="bg-white border-t border-gray-200 p-6 flex items-center gap-4">
              <input
                type="text"
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:border-[#E30613] transition"
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                className={`p-4 rounded-full transition ${
                  replyText.trim()
                    ? 'bg-[#E30613] text-white hover:bg-[#c20511]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiSend className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;