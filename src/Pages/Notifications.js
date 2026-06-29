
// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiBell } from 'react-icons/fi';

const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com';

// Push notification broadcast — fires after every create/update
// Route: POST /mobilcreatenotifications/push/send-all
const broadcastPush = async (title, message) => {
  try {
    await axios.post(`${API_BASE}/mobilcreatenotifications/push/send-all`, {
      title,
      body: message,
      url: '/dashboard',
    });
    console.log('✅ Push broadcast sent');
  } catch (err) {
    // Push failure should never block the main save — just log it
    console.error('Push broadcast failed:', err.response?.data || err.message);
  }
};

const Notifications = () => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]     = useState({ title: '', message: '', id: null });
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/mobilcreatenotifications`);
      setItems(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setSaving(true);
    try {
      if (form.id) {
        // ── UPDATE existing notification ──
        await axios.put(
          `${API_BASE}/mobilcreatenotifications/${form.id}`,
          { title: form.title, message: form.message }
        );
        showFeedback('success', 'Notification updated successfully.');
      } else {
        // ── CREATE new notification ──
        await axios.post(
          `${API_BASE}/mobilcreatenotifications`,
          { title: form.title, message: form.message }
        );
        showFeedback('success', 'Notification created and push sent to all subscribers.');
      }

      // ── BROADCAST push to every subscribed browser ──
      await broadcastPush(form.title, form.message);

      fetchItems();
      setForm({ title: '', message: '', id: null });
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      showFeedback('error', err.response?.data?.message || 'Failed to save notification.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, message: item.message || item.content || '', id: item._id || item.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await axios.delete(`${API_BASE}/mobilcreatenotifications/${id}`);
      showFeedback('success', 'Notification deleted.');
      fetchItems();
    } catch (err) {
      showFeedback('error', 'Failed to delete notification.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setForm({ title: '', message: '', id: null });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#001F5B] mb-8">Manage Notifications</h1>

      {/* Feedback banner */}
      {feedback.text && (
        <div className={`mb-6 px-6 py-4 rounded-2xl font-semibold text-base ${
          feedback.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {feedback.type === 'success' ? '✅ ' : '❌ '}{feedback.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-[#001F5B] mb-2">
          {form.id ? '✏️ Edit Notification' : '➕ New Notification'}
        </h2>
        {!form.id && (
          <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
            <FiBell className="text-[#E30613]" />
            Saving a new notification will instantly send a browser push notification to all subscribed members.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Notification Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] focus:outline-none"
            required
          />
          <textarea
            placeholder="Notification Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] focus:outline-none h-32 resize-none"
            required
          />
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#E30613] hover:bg-[#c20511] text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 disabled:opacity-60"
            >
              <FiPlus />
              {saving ? 'Saving...' : form.id ? 'Update Notification' : 'Send Notification'}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold px-10 py-4 rounded-2xl transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center text-xl text-[#001F5B] animate-pulse py-12">Loading notifications...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 text-xl py-12">No notifications yet. Create one above.</div>
      ) : (
        <div className="grid gap-6">
          {items.map(item => (
            <div key={item._id || item.id}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FiBell className="text-[#E30613] text-xl flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-[#001F5B]">{item.title}</h3>
                </div>
                <p className="text-lg text-gray-700 mb-3">{item.message || item.content || ''}</p>
                {(item.createdAt || item.timestamps) && (
                  <p className="text-sm text-gray-400">
                    {new Date(item.createdAt || item.timestamps).toLocaleString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-4 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                  title="Edit notification"
                >
                  <FiEdit className="text-3xl" />
                </button>
                <button
                  onClick={() => handleDelete(item._id || item.id)}
                  className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                  title="Delete notification"
                >
                  <FiTrash2 className="text-3xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
