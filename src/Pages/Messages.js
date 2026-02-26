import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiSend, FiUser } from 'react-icons/fi';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);

  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  const admin = JSON.parse(localStorage.getItem('adminData')) || {};

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat]);

  const openChatModal = async (chat) => {
    try {
      setModalOpen(true);
      setLoadingChat(true);
      setReplyText('');
      const response = await axios.get(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatemessages/user/${chat.user}`
      );
      const userData = response.data.user;
      setSelectedChat({
        userId: userData._id.toString(),
        userName: userData.fullname,
        messages: userData.messages || [],
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load conversation");
      setModalOpen(false);
    } finally {
      setLoadingChat(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedChat(null);
    setReplyText('');
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedChat) return;

    try {
      setSending(true);

      const response = await axios.post(
        'https://campusbuy-backend-nkmx.onrender.com/mobilcreatemessages/admincreatemessage',
        {
          id: selectedChat.userId,
          adminId: admin.id,
          content: replyText.trim(),
        }
      );

      const newMessage = response.data.message;

      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      setReplyText('');
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Messages & Conversations
          </h1>
          <p className="text-xl text-gray-600">
            View and reply to messages
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="divide-y divide-gray-200">
            {messages.length === 0 ? (
              <div className="p-16 text-center text-gray-500 text-xl">
                No messages yet
              </div>
            ) : (
              messages.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => openChatModal(chat)}
                  className="flex items-center gap-6 p-6 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#E30613]/10 flex items-center justify-center">
                      <FiUser className="text-3xl text-[#E30613]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {chat.userName}
                    </p>
                    <p className="text-gray-600 truncate">
                      {chat.content}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(chat.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FiUser className="text-4xl text-white" />
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedChat?.userName || "Loading..."}
                  </h2>
                  <p className="text-sm opacity-90">Conversation</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:text-[#E30613] text-3xl"
              >
                <FiX />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              {loadingChat ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  Loading conversation...
                </div>
              ) : selectedChat?.messages?.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages yet
                </div>
              ) : (
                selectedChat?.messages?.map((msg) => {
                   const isUserMessage = msg.createdBy === selectedChat.userId;
                    console.log(selectedChat.userId)
                   console.log(selectedChat.messages[5])
                   console.log(typeof selectedChat.userId);           // correct
                    console.log(typeof selectedChat.messages[5].createdBy); // correct
                  return(
                  <div
                    key={msg._id}
                    className={`mb-6 flex ${
                     isUserMessage
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-6 py-4 shadow ${
          isUserMessage
            ? 'bg-[#E30613] text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none'
        }`}
                    >
                      <p className="text-base leading-relaxed">
                        {msg.content}
                      </p>
                      <p className="text-xs mt-2 opacity-70 text-right">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  )
                  
})
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="bg-white border-t border-gray-200 p-6 flex items-center gap-4">
              <input
                type="text"
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && sendReply()
                }
                className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:border-[#E30613] transition"
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
                className={`p-4 rounded-full transition ${
                  replyText.trim() && !sending
                    ? 'bg-[#E30613] text-white hover:bg-[#c20511]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {sending ? '...' : <FiSend className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;