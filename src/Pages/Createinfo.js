import React, { useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiLoader, FiXCircle, FiCheckCircle } from 'react-icons/fi';


export const CreateNotification = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // for nice top message
const { id } = useParams();   // ← destructuring gives you the actual string ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    if (!title.trim() || !content.trim()) {
      setFeedback({ type: 'error', text: 'Title and content are required' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatenotifications/${id}`,
        { title, content }, // ← send JSON
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setFeedback({
        type: 'success',
        text: response.data.message || 'Notification created successfully!',
      });

      setTitle('');
      setContent('');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create notification',
      });
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">
          Create New Notification
        </h1>

        {/* Top Feedback Modal */}
        {feedback && (
          <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-fade-in-down ${
              feedback.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            } p-5 rounded-xl shadow-lg border ${
              feedback.type === 'success' ? 'border-green-300' : 'border-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {feedback.type === 'success' ? (
                <FiCheckCircle className="text-2xl" />
              ) : (
                <FiXCircle className="text-2xl" />
              )}
              <p className="font-medium">{feedback.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dues Reminder"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the notification message here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-2xl" />
                Creating...
              </>
            ) : (
              'Create Notification'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export const CreateNewsevent = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const {id} = useParams()

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      setMessage({ type: 'error', text: 'Title and body are required' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Step 1: Create news/event (no image)
     const  createResponse = await axios.post(
        `https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents/${id}`,
        { title, body }, // ← send JSON
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newsEventId = createResponse.data.newsEvent._id; // Get the ID

      // Step 2: Upload image if selected
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('images', image);

        await axios.put(
          `https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents/image/${newsEventId}`,
          imageFormData
        );
      }
      setMessage({ type: 'success', text: 'News/Event created successfully!' });
      setTitle('');
      setBody('');
      setImage(null);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create news/event';
      setMessage({ type: 'error', text: errMsg });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">
          Create New News/Event
        </h1>

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-8 p-5 rounded-xl text-center text-lg font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              News/Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., EMRAN AGM 2025"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the full content here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-[#E30613]/10 file:text-[#E30613] file:font-medium hover:file:bg-[#E30613]/20 transition"
            />
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-xl border border-gray-200 shadow"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></div>
                Creating...
              </>
            ) : (
              'Create News/Event'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export const CreateAlert = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const {id} = useParams();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        await axios.post(`https://campusbuy-backend-nkmx.onrender.com/mobilcreatealert/${id}`,
        { title, content }, // ← send JSON
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Alert created successfully!');
      setTitle('');
      setContent('');
    } catch (err) {
      alert('Failed to create alert');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">
          Create New Alert
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Alert Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dues Reminder"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the alert message here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}
          >
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

