
// src/pages/CreateContent.jsx
// Contains: CreateNotification, CreateNewsevent, CreateAlert,
//           AdminCreateCandidate, ResultsPage, AdminManageCandidates
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiLoader, FiXCircle, FiCheckCircle, FiBell } from 'react-icons/fi';

const API_URL  = "https://campusbuy-backend-nkmx.onrender.com/mobilcreatecandidates";
const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com';

// ── Candidate API helpers ──────────────────────────────────────────────────
const getCandidates   = async () => (await axios.get(API_URL)).data;
const getResults      = async () => (await axios.get(`${API_URL}/results`)).data;
const createCandidate = async (data) => (await axios.post(`${API_URL}/admin/create`, data)).data;
const deleteCandidate = async (id)  => (await axios.delete(`${API_URL}/admin/${id}`)).data;

// ── Push broadcast helper ──────────────────────────────────────────────────
// Route: POST /mobilcreatenotifications/push/send-all
// NOTE: This route now works because push routes are registered BEFORE /:id
// in notificationRoutes.js — previously "push" was being caught as an :id param.
const broadcastPush = async (title, body, url = '/dashboard') => {
  try {
    await axios.post(`${API_BASE}/mobilcreatenotifications/push/send-all`, {
      title,
      body,
      url,
    });
    console.log('✅ Push broadcast sent');
  } catch (err) {
    // Non-blocking — push failure never stops the main save
    console.error('Push broadcast failed:', err.response?.data || err.message);
  }
};

// ════════════════════════════════════════════════════════════════════════════
//  CREATE NOTIFICATION
// ════════════════════════════════════════════════════════════════════════════
export const CreateNotification = () => {
  const { id } = useParams();
  const [title,    setTitle]    = useState('');
  const [content,  setContent]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showFeedback('error', 'Title and content are required');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/mobilcreatenotifications/${id}`,
        { title, content },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // ── Broadcast push AFTER successful save ──
      await broadcastPush(title, content, '/dashboard');

      showFeedback('success', response.data.message || 'Notification created and push sent to all subscribers!');
      setTitle('');
      setContent('');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to create notification');
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-3 text-center">
          Create New Notification
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8 flex items-center justify-center gap-2">
          <FiBell className="text-[#E30613]" />
          Saving will instantly send a browser push notification to all subscribed members.
        </p>

        {feedback && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4`}>
            <div className={`flex items-center gap-3 p-5 rounded-xl shadow-lg border font-medium ${
              feedback.type === 'success'
                ? 'text-green-700 bg-green-100 border-green-300'
                : 'text-red-700 bg-red-100 border-red-300'
            }`}>
              {feedback.type === 'success'
                ? <FiCheckCircle className="text-2xl flex-shrink-0" />
                : <FiXCircle className="text-2xl flex-shrink-0" />}
              <p>{feedback.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Notification Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Dues Reminder"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Message Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write the notification message here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
              required />
          </div>
          <button type="submit" disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}>
            {loading
              ? <><FiLoader className="animate-spin text-2xl" /> Creating...</>
              : 'Create & Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  CREATE NEWS/EVENT
// ════════════════════════════════════════════════════════════════════════════
export const CreateNewsevent = () => {
  const { id } = useParams();
  const [title,   setTitle]   = useState('');
  const [body,    setBody]    = useState('');
  const [image,   setImage]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleImageChange = (e) => { if (e.target.files[0]) setImage(e.target.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) { setMessage({ type: 'error', text: 'Title and body are required' }); return; }
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Step 1: Create the news/event record
      const createResponse = await axios.post(
        `${API_BASE}/mobilcreatenewsevents/${id}`,
        { title, body },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const newsEventId = createResponse.data.newsEvent._id;

      // Step 2: Upload image if selected
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('images', image);
        await axios.put(`${API_BASE}/mobilcreatenewsevents/image/${newsEventId}`, imageFormData);
      }

      // Step 3: Broadcast push to all subscribed members
      await broadcastPush(
        `📅 New Event: ${title}`,
        body.substring(0, 100) + (body.length > 100 ? '...' : ''),
        '/newsevents'
      );

      setMessage({ type: 'success', text: 'News/Event created and push notification sent to all subscribers!' });
      setTitle('');
      setBody('');
      setImage(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create news/event' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">Create New News/Event</h1>

        {message.text && (
          <div className={`mb-8 p-5 rounded-xl text-center text-lg font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">News/Event Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., EMRAN AGM 2025"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Message Body</label>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              placeholder="Write the full content here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
              required />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Upload Image (optional)</label>
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/svg+xml"
              onChange={handleImageChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-[#E30613]/10 file:text-[#E30613] file:font-medium hover:file:bg-[#E30613]/20 transition" />
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img src={URL.createObjectURL(image)} alt="Preview"
                  className="w-64 h-64 object-cover rounded-xl border border-gray-200 shadow" />
              </div>
            )}
          </div>
          <button type="submit" disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}>
            {loading
              ? <><div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></div> Creating...</>
              : 'Create News/Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  CREATE ALERT
// ════════════════════════════════════════════════════════════════════════════
export const CreateAlert = () => {
  const { id } = useParams();
  const [title,    setTitle]   = useState('');
  const [content,  setContent] = useState('');
  const [loading,  setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/mobilcreatealert/${id}`,
        { title, content },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Broadcast push for alerts too
      await broadcastPush(`🚨 EMRAN Alert: ${title}`, content, '/');

      setFeedback({ type: 'success', text: 'Alert created and push notification sent!' });
      setTitle('');
      setContent('');
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to create alert' });
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-8 text-center">Create New Alert</h1>

        {feedback && (
          <div className={`mb-6 p-5 rounded-xl font-medium text-center ${
            feedback.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Alert Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Urgent: Dues Deadline"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Message Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write the alert message here..."
              rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
              required />
          </div>
          <button type="submit" disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'
            }`}>
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN CREATE CANDIDATE
// ════════════════════════════════════════════════════════════════════════════
export const AdminCreateCandidate = () => {
  const [form, setForm] = useState({ office: '', fullName: '', photo: '', manifesto: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCandidate(form);
    alert('Candidate Created');
    setForm({ office: '', fullName: '', photo: '', manifesto: '' });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Candidate</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="office" placeholder="Office (e.g President)" value={form.office}
          className="w-full border p-3 rounded" onChange={handleChange} />
        <input name="fullName" placeholder="Full Name" value={form.fullName}
          className="w-full border p-3 rounded" onChange={handleChange} />
        <input name="photo" placeholder="Photo URL" value={form.photo}
          className="w-full border p-3 rounded" onChange={handleChange} />
        <textarea name="manifesto" placeholder="Manifesto" value={form.manifesto}
          className="w-full border p-3 rounded" onChange={handleChange} />
        <button className="w-full bg-green-600 text-white py-3 rounded">Create</button>
      </form>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  RESULTS PAGE
// ════════════════════════════════════════════════════════════════════════════
export const ResultsPage = () => {
  const [results, setResults] = useState([]);
  useEffect(() => { getResults().then(setResults); }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Election Results</h1>
      {results.map((r, i) => (
        <div key={i} className="border p-4 rounded-lg mb-4 shadow">
          <h2 className="font-semibold">{r.office}</h2>
          <p>{r.candidate}</p>
          <p className="text-blue-600 font-bold">{r.totalVotes} votes</p>
        </div>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN MANAGE CANDIDATES
// ════════════════════════════════════════════════════════════════════════════
export const AdminManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  useEffect(() => { getCandidates().then(setCandidates); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await deleteCandidate(id);
      alert('Candidate deleted successfully');
      getCandidates().then(setCandidates);
    } catch { alert('Delete failed'); }
  };

  const grouped = candidates.reduce((acc, c) => {
    acc[c.office] = acc[c.office] || [];
    acc[c.office].push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Candidates</h1>
      {Object.keys(grouped).map(office => (
        <div key={office} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{office}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {grouped[office].map(c => (
              <div key={c._id} className="border rounded-xl p-4 shadow">
                {c.photo && <img src={c.photo} alt={c.fullName} className="h-24 w-24 rounded-full object-cover mb-4" />}
                <h3 className="font-bold">{c.fullName}</h3>
                <p className="text-sm text-gray-600 mb-4">{c.manifesto}</p>
                <button onClick={() => handleDelete(c._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Delete Candidate
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
