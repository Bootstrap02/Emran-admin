// src/pages/Messages.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiSend, FiUser } from 'react-icons/fi';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Load conversations (from localStorage or dummy data)
  useEffect(() => {
    // Replace with real API fetch later
    // const fetchConversations = async () => {
    //   const res = await axios.get('YOUR_CONVERSATIONS_API');
    //   setConversations(res.data);
    // };
    // fetchConversations();

    // Dummy conversations (remove when API is ready)
    const dummy = [
      {
        id: 1,
        sender: 'Admin',
        lastMessage: 'Your dues payment has been confirmed. Welcome!',
        lastMessageTime: '2h ago',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        messages: [
          { id: 1, sender: 'Admin', text: 'Hello! Your dues payment has been confirmed.', time: '1h ago' },
          { id: 2, sender: 'You', text: 'Thank you so much!', time: '1h ago' },
          { id: 3, sender: 'Admin', text: 'You’re welcome. Let us know if you need help.', time: '50min ago' },
        ],
      },
      {
        id: 2,
        sender: 'Support Team',
        lastMessage: 'We received your health coverage request.',
        lastMessageTime: 'Yesterday',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        messages: [
          { id: 1, sender: 'Support Team', text: 'Good day! We received your request.', time: 'Yesterday' },
          { id: 2, sender: 'You', text: 'Thank you, when will it be processed?', time: 'Yesterday' },
        ],
      },
      {
        id: 3,
        sender: 'Admin',
        lastMessage: 'Reminder: AGM is next month.',
        lastMessageTime: '3 days ago',
        avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
        messages: [
          { id: 1, sender: 'Admin', text: 'Just a reminder about the AGM.', time: '3 days ago' },
        ],
      },
    ];

    setConversations(dummy);
  }, []);

  // Open modal with selected chat
  const openChatModal = (chat) => {
    setSelectedChat(chat);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedChat(null);
    setReplyText('');
  };

  // Send reply (dummy for now — replace with API)
  const sendReply = () => {
    if (!replyText.trim()) return;

    // Simulate sending
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: replyText,
      time: 'Just now',
    };

    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: replyText,
      lastMessageTime: 'Just now',
    }));

    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Messages & Conversations
          </h1>
          <p className="text-xl text-gray-600">
            View and reply to messages from members and support team
          </p>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="divide-y divide-gray-200">
            {conversations.length === 0 ? (
              <div className="p-16 text-center text-gray-500 text-xl">
                No conversations yet
              </div>
            ) : (
              conversations.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => openChatModal(chat)}
                  className="flex items-center gap-6 p-6 hover:bg-gray-50 transition cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {chat.avatar ? (
                      <img
                        src={chat.avatar}
                        alt={chat.sender}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#E30613]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#E30613]/10 flex items-center justify-center">
                        <FiUser className="text-3xl text-[#E30613]" />
                      </div>
                    )}
                  </div>

                  {/* Message Preview */}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {chat.sender}
                    </p>
                    <p className="text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>

                  {/* Time */}
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
                {selectedChat.avatar ? (
                  <img
                    src={selectedChat.avatar}
                    alt={selectedChat.sender}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <FiUser className="text-4xl text-white" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{selectedChat.sender}</h2>
                  <p className="text-sm opacity-90">Online • Last active 2 min ago</p>
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
                  className={`mb-6 flex ${
                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
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