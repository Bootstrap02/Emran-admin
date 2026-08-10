// src/pages/CreateContent.jsx
// Contains: CreateNotification, CreateNewsevent (with templates + multi-image),
//           CreateAlert, CreateElection (with positions + candidates inline),
//           ResultsPage, AdminManageCandidates

import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiLoader, FiXCircle, FiCheckCircle, FiBell, FiPlus, FiTrash2, FiUser } from 'react-icons/fi';

const API_BASE  = 'https://campusbuy-backend-nkmx.onrender.com';
const ELECT_API = `${API_BASE}/mobilcreateelections`;

// ── Push broadcast ───────────────────────────────────────────────────────────
const broadcastPush = async (title, body, url = '/dashboard') => {
  try {
    await axios.post(`${API_BASE}/mobilcreatenotifications/push/send-all`, { title, body, url });
  } catch (err) {
    console.error('Push failed:', err.message);
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
    if (!title.trim() || !content.trim()) { showFeedback('error', 'Title and content are required'); return; }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/mobilcreatenotifications/${id}`, { title, content });
      await broadcastPush(title, content, '/dashboard');
      showFeedback('success', response.data.message || 'Notification created and push sent!');
      setTitle(''); setContent('');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to create notification');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-3 text-center">Create New Notification</h1>
        <p className="text-center text-gray-500 text-sm mb-8 flex items-center justify-center gap-2">
          <FiBell className="text-[#E30613]" /> Saving will send a browser push to all subscribed members.
        </p>
        {feedback && (
          <div className={`mb-6 p-5 rounded-xl font-medium text-center flex items-center justify-center gap-2 ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {feedback.type === 'success' ? <FiCheckCircle /> : <FiXCircle />} {feedback.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Notification Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Dues Reminder"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition" required />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Message Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write the notification message here..." rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none" required />
          </div>
          <button type="submit" disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'}`}>
            {loading ? <><FiLoader className="animate-spin text-2xl" /> Creating...</> : 'Create & Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  CREATE NEWS/EVENT — Template-based with up to 4 images
// ════════════════════════════════════════════════════════════════════════════

// Template definitions
const TEMPLATES = [
  {
    id: 'birthday', label: 'Birthday', emoji: '🎂',
    color: '#F59E0B', bg: '#FEF3C7',
    desc: "Celebrate a member's milestone birthday",
    fields: [
      { name: 'celebrantName', label: "Celebrant's Full Name", required: true, placeholder: 'e.g. Chief John Okafor' },
      { name: 'age', label: 'Age (optional)', type: 'number', placeholder: 'e.g. 70' },
      { name: 'date', label: 'Date of Celebration', type: 'date', required: true },
      { name: 'venue', label: 'Venue (optional)', placeholder: 'e.g. No. 5 Marina Road, Lagos' },
      { name: 'extraNote', label: 'Additional Message (optional)', type: 'textarea', placeholder: 'Add a personal note...' },
    ],
    genTitle: (f) => `Happy Birthday${f.age ? ` @ ${f.age}` : ''} - ${f.celebrantName}`,
    genBody:  (f) =>
      `EMRAN warmly celebrates ${f.celebrantName}${f.age ? `, who is clocking ${f.age} years` : ''}, on this joyous occasion.\n\nOn behalf of the entire EMRAN family, we wish you many more years of good health, happiness, and God's blessings.\n\n${f.venue ? `The celebration holds at ${f.venue}.` : ''}\n\n${f.extraNote || ''}`.trim(),
  },
  {
    id: 'wedding', label: 'Wedding', emoji: '💍',
    color: '#EC4899', bg: '#FDF2F8',
    desc: 'Announce a wedding celebration',
    fields: [
      { name: 'memberName', label: "Member's Full Name", required: true, placeholder: 'e.g. Dr. Ade Bello' },
      { name: 'relation', label: 'Relationship to Member', placeholder: 'e.g. Son, Daughter' },
      { name: 'celebrantNames', label: 'Names of Couple', required: true, placeholder: 'e.g. Emeka & Ngozi' },
      { name: 'date', label: 'Wedding Date', type: 'date', required: true },
      { name: 'venue', label: 'Venue', placeholder: 'e.g. Church of God, Victoria Island' },
      { name: 'extraNote', label: 'Additional Message (optional)', type: 'textarea', placeholder: 'Reception details, dress code, etc.' },
    ],
    genTitle: (f) => `Wedding Celebration - ${f.celebrantNames}`,
    genBody:  (f) =>
      `EMRAN is delighted to celebrate with ${f.memberName} on the wedding of ${f.relation ? `their ${f.relation}` : 'their child'}, ${f.celebrantNames}.\n\nWe join our esteemed member in rejoicing and pray for a marriage full of love, joy, and God's blessing.\n\n${f.venue ? `The ceremony holds at ${f.venue}.` : ''}\n\n${f.extraNote || ''}`.trim(),
  },
  {
    id: 'funeral', label: 'Funeral / Burial', emoji: '🕊️',
    color: '#6B7280', bg: '#F9FAFB',
    desc: 'Announce burial arrangements',
    fields: [
      { name: 'deceasedName', label: 'Name of the Deceased', required: true, placeholder: 'e.g. Late Chief Samuel Adeyemi' },
      { name: 'relation', label: 'Relation to EMRAN Member', placeholder: 'e.g. Member, Wife of Member' },
      { name: 'memberName', label: "EMRAN Member's Name (if applicable)", placeholder: 'e.g. Mr. Tunde Adeyemi' },
      { name: 'burialDate', label: 'Burial Date', type: 'date', required: true },
      { name: 'venue', label: 'Burial Venue', placeholder: "e.g. St. Peter's Anglican Church, Ibadan" },
      { name: 'extraNote', label: 'Additional Details (optional)', type: 'textarea', placeholder: 'Lying in state, reception details, etc.' },
    ],
    genTitle: (f) => `Burial Announcement - ${f.deceasedName}`,
    genBody:  (f) =>
      `It is with deep sorrow that EMRAN announces the passing of ${f.deceasedName}${f.relation ? ` (${f.relation})` : ''}${f.memberName ? `, beloved of our member ${f.memberName}` : ''}.\n\nWe extend our deepest condolences to the family and pray for the repose of the soul of the deceased.\n\n${f.venue ? `The burial holds at ${f.venue}.` : ''}\n\n${f.extraNote || ''}`.trim(),
  },
  {
    id: 'obituary', label: 'Obituary', emoji: '🕯️',
    color: '#374151', bg: '#F3F4F6',
    desc: 'Post a formal obituary',
    fields: [
      { name: 'deceasedName', label: 'Name of the Deceased', required: true, placeholder: 'e.g. Late Mrs. Grace Nwosu' },
      { name: 'memberName', label: 'EMRAN Member (if family)', placeholder: 'e.g. Mr. Emeka Nwosu' },
      { name: 'obituaryText', label: 'Obituary Message', type: 'textarea', required: true, rows: 8, placeholder: 'Write the full obituary notice here...' },
    ],
    genTitle: (f) => `Obituary: ${f.deceasedName}`,
    genBody:  (f) =>
      `OBITUARY\n\n${f.deceasedName}\n\n${f.obituaryText}\n\n${f.memberName ? `The EMRAN family commiserates with our member, ${f.memberName}, and the entire family.` : ''}`.trim(),
  },
  {
    id: 'event', label: 'General Event', emoji: '📅',
    color: '#3B82F6', bg: '#EFF6FF',
    desc: 'AGM, welfare meeting, social gathering, seminar',
    fields: [
      { name: 'eventName', label: 'Event Name', required: true, placeholder: 'e.g. EMRAN Annual General Meeting 2026' },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time' },
      { name: 'venue', label: 'Venue', placeholder: 'e.g. EMRAN Secretariat, Ikoyi' },
      { name: 'description', label: 'Event Description', type: 'textarea', required: true, placeholder: 'Describe the event, agenda, who should attend...' },
    ],
    genTitle: (f) => f.eventName,
    genBody:  (f) =>
      `${f.eventName}\n\n${f.description}\n\nDate: ${f.date ? new Date(f.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}\n${f.time ? `Time: ${f.time}\n` : ''}${f.venue ? `Venue: ${f.venue}` : ''}`.trim(),
  },
  {
    id: 'custom', label: 'Other / Custom', emoji: '✏️',
    color: '#001F5B', bg: '#EEF2FA',
    desc: 'Any other announcement or news item',
    fields: [
      { name: 'title', label: 'Title / Headline', required: true, placeholder: 'e.g. Important Notice to All Members' },
      { name: 'body', label: 'Full Content', type: 'textarea', required: true, rows: 10, placeholder: 'Write the full content of your announcement here...' },
    ],
    genTitle: (f) => f.title,
    genBody:  (f) => f.body,
  },
];

// Multi-image uploader (max 4)
const ImageUploader = ({ images, onChange }) => {
  const ref = useRef(null);
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 4 - images.length;
    onChange([...images, ...files.slice(0, remaining)]);
    e.target.value = '';
  };
  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));
  return (
    <div>
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Photos <span className="text-sm text-gray-400 font-normal">(up to 4 — JPG, PNG, SVG)</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => remove(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700">
              x
            </button>
          </div>
        ))}
        {images.length < 4 && (
          <button type="button" onClick={() => ref.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#E30613] hover:text-[#E30613] transition bg-gray-50">
            <span className="text-2xl mb-1">+</span>
            <span className="text-xs">Add Photo</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" multiple accept="image/jpeg,image/jpg,image/png,image/svg+xml"
        onChange={handleFiles} className="hidden" />
      {images.length > 0 && (
        <p className="text-xs text-gray-400">{images.length}/4 image{images.length !== 1 ? 's' : ''} selected</p>
      )}
    </div>
  );
};

// Template modal
const TemplateModal = ({ template, adminId, onClose, onSuccess }) => {
  const [fields, setFields] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const set = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

  const handleImageChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg'];
    const validFiles = [];
    let hasError = false;

    files.forEach((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {
        validFiles.push(file);
      } else {
        hasError = true;
        setErrorMessage('Unsupported file format. Only jpg, jpeg, png, and svg are allowed.');
      }
    });

    if (!hasError) {
      setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
      if (setFieldValue) {
        setFieldValue("images", validFiles);
      }
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorMessage('');
    
    // Validate required fields
    for (const f of template.fields) {
      if (f.required && !String(fields[f.name] || '').trim()) {
        setError(`${f.label} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const title = template.genTitle(fields);
      const body = template.genBody(fields);
      const category = template.id;

      // Create the news event
      const res = await axios.post(`${API_BASE}/mobilcreatenewsevents/${adminId}`, {
        title, body, category,
        eventDate: fields.date || fields.burialDate || null,
      });
      
      const newsEventId = res.data.newsEvent?._id || res.data._id;

      // Upload images one by one preserving order (like Productimages)
      if (selectedImages && selectedImages.length > 0) {
        for (const img of selectedImages) {
          const formData = new FormData();
          formData.append('images', img);
          
          // Log the upload for debugging
          console.log('Uploading image:', img.name);
          
          await axios.put(`${API_BASE}/mobilcreatenewseventsimage/${newsEventId}`, formData);
        }
      }

      // Send push notification
      await broadcastPush(
        `📢 ${title}`,
        body.substring(0, 100) + (body.length > 100 ? '...' : ''),
        '/newsevents'
      );
      
      onSuccess(`"${title}" published successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#E30613] focus:outline-none transition";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Publish: {template.label}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {errorMessage}
            </div>
          )}

          {template.fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {f.label}
                {f.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {f.type === 'textarea' ? (
                <textarea
                  value={fields[f.name] || ''}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className={inputCls}
                  rows={f.rows || 4}
                />
              ) : f.type === 'date' ? (
                <input
                  type="date"
                  value={fields[f.name] || ''}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={inputCls}
                />
              ) : f.type === 'file' ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#E30613] focus:outline-none transition"
                  />
                  {selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedImages.map((img, index) => (
                        <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                          📷 {img.name.substring(0, 20)}{img.name.length > 20 ? '...' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected. 
                    Supported formats: JPG, JPEG, PNG, SVG
                  </p>
                </div>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={fields[f.name] || ''}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className={inputCls}
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#E30613] text-white rounded-xl font-medium hover:bg-[#c00510] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : (
                `Publish ${template.label}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

              


export const CreateNewsevent = () => {
  const { id } = useParams();
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [successMsg,     setSuccessMsg]     = useState('');

  const handleSuccess = (msg) => {
    setActiveTemplate(null);
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#001F5B] mb-2">Create News & Event</h1>
          <p className="text-gray-500 text-lg">Choose a template to get started. Each template auto-generates the message.</p>
        </div>
        {successMsg && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-6 py-4 flex items-center gap-3 font-medium">
            <FiCheckCircle className="text-xl" /> {successMsg}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATES.map(tmpl => (
            <button key={tmpl.id} onClick={() => setActiveTemplate(tmpl)}
              className="group text-left rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 bg-white"
              style={{ borderColor: tmpl.color + '40' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
                style={{ background: tmpl.bg }}>
                {tmpl.emoji}
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: tmpl.color }}>{tmpl.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{tmpl.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: tmpl.color }}>
                Select <span className="text-base">arrow</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          All published events are visible on the News & Events page and trigger a push notification to subscribed members.
        </p>
      </div>
      {activeTemplate && (
        <TemplateModal
          template={activeTemplate}
          adminId={id}
          onClose={() => setActiveTemplate(null)}
          onSuccess={handleSuccess}
        />
      )}
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
      await axios.post(`${API_BASE}/mobilcreatealert/${id}`, { title, content });
      await broadcastPush(`EMRAN Alert: ${title}`, content, '/');
      setFeedback({ type: 'success', text: 'Alert created and push notification sent!' });
      setTitle(''); setContent('');
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to create alert' });
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
            feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
          }`}>{feedback.text}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Alert Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Urgent: Dues Deadline"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition" required />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Message Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write the alert message here..." rows="6"
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none" required />
          </div>
          <button type="submit" disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#E30613] hover:bg-[#c20511]'}`}>
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  CREATE ELECTION (with positions + candidates inline, linked to real users)
// ════════════════════════════════════════════════════════════════════════════
const emptyCandidate = () => ({ fullName: '', userId: '', photo: '', manifesto: '' });
const emptyPosition  = () => ({ title: '', candidates: [emptyCandidate()] });

export const CreateElection = () => {
  const { id: adminId } = useParams();
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [startDate,   setStartDate]   = useState('');
  const [positions,   setPositions]   = useState([emptyPosition()]);
  const [loading,     setLoading]     = useState(false);
  const [feedback,    setFeedback]    = useState(null);
  // For user search
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState({});

  useEffect(() => {
    // Load cached users for candidate lookup
    const cached = JSON.parse(localStorage.getItem('allusers') || '[]');
    setAllUsers(cached);
  }, []);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Position helpers
  const addPosition    = () => setPositions(p => [...p, emptyPosition()]);
  const removePosition = (pi) => setPositions(p => p.filter((_, i) => i !== pi));
  const setPosTitle    = (pi, val) =>
    setPositions(p => p.map((pos, i) => i === pi ? { ...pos, title: val } : pos));

  // Candidate helpers
  const addCandidate    = (pi) =>
    setPositions(p => p.map((pos, i) => i === pi
      ? { ...pos, candidates: [...pos.candidates, emptyCandidate()] } : pos));
  const removeCandidate = (pi, ci) =>
    setPositions(p => p.map((pos, i) => i === pi
      ? { ...pos, candidates: pos.candidates.filter((_, j) => j !== ci) } : pos));
  const setCandField    = (pi, ci, field, val) =>
    setPositions(p => p.map((pos, i) => i === pi
      ? { ...pos, candidates: pos.candidates.map((c, j) => j === ci ? { ...c, [field]: val } : c) } : pos));

  // When admin types in user search box for a candidate slot
  const handleUserSearch = (pi, ci, query) => {
    const key = `${pi}_${ci}`;
    setUserSearch(prev => ({ ...prev, [key]: query }));
    // If matches a user, auto-fill
    const match = allUsers.find(u =>
      u.fullname?.toLowerCase().includes(query.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      setCandField(pi, ci, 'fullName', match.fullname);
      setCandField(pi, ci, 'userId',   match._id);
    } else {
      setCandField(pi, ci, 'fullName', query);
      setCandField(pi, ci, 'userId',   '');
    }
  };

  const getFilteredUsers = (query) => {
    if (!query || query.length < 2) return [];
    return allUsers
      .filter(u =>
        u.fullname?.toLowerCase().includes(query.toLowerCase()) ||
        u.email?.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startDate) { showFeedback('error', 'Title and start date are required'); return; }
    for (const pos of positions) {
      if (!pos.title.trim()) { showFeedback('error', 'All positions must have a title'); return; }
      for (const c of pos.candidates) {
        if (!c.fullName.trim()) { showFeedback('error', 'All candidates must have a name'); return; }
      }
    }
    setLoading(true);
    try {
      await axios.post(`${ELECT_API}/create`, {
        title, description, startDate,
        positions,
        adminId,
      });
      showFeedback('success', `Election "${title}" created successfully!`);
      setTitle(''); setDescription(''); setStartDate('');
      setPositions([emptyPosition()]);
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to create election');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-[#001F5B] mb-2 text-center">Create Election</h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Define the election, add positions, and assign candidates from existing EMRAN members.
        </p>

        {feedback && (
          <div className={`mb-6 p-5 rounded-xl font-medium text-center flex items-center justify-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {feedback.type === 'success' ? <FiCheckCircle /> : <FiXCircle />} {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Election basics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Election Title <span className="text-red-500">*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. EMRAN Executive Elections 2026"
                className={inputCls} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date & Time <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)}
                className={inputCls} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of this election..."
              rows={2} className={inputCls + ' resize-none'} />
          </div>

          {/* Positions + Candidates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#001F5B]">Positions & Candidates</h3>
              <button type="button" onClick={addPosition}
                className="flex items-center gap-2 text-sm font-semibold text-[#001F5B] border-2 border-[#001F5B] px-4 py-2 rounded-xl hover:bg-[#001F5B] hover:text-white transition">
                <FiPlus /> Add Position
              </button>
            </div>

            <div className="space-y-6">
              {positions.map((pos, pi) => (
                <div key={pi} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  {/* Position title row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full bg-[#001F5B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {pi + 1}
                    </div>
                    <input value={pos.title} onChange={e => setPosTitle(pi, e.target.value)}
                      placeholder="Position title e.g. President"
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:border-[#E30613] focus:outline-none" />
                    {positions.length > 1 && (
                      <button type="button" onClick={() => removePosition(pi)}
                        className="text-red-500 hover:text-red-700 p-1 flex-shrink-0">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>

                  {/* Candidates */}
                  <div className="space-y-3 ml-10">
                    {pos.candidates.map((c, ci) => {
                      const searchKey = `${pi}_${ci}`;
                      const query     = userSearch[searchKey] || c.fullName || '';
                      const suggestions = getFilteredUsers(query);
                      return (
                        <div key={ci} className="bg-white rounded-xl p-4 border border-gray-200 relative">
                          <div className="flex items-center gap-2 mb-3">
                            <FiUser className="text-gray-400 flex-shrink-0" />
                            {/* Candidate search — linked to EMRAN users */}
                            <div className="flex-1 relative">
                              <input
                                value={query}
                                onChange={e => handleUserSearch(pi, ci, e.target.value)}
                                placeholder="Search member name or email... *"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E30613] focus:outline-none" />
                              {/* Dropdown suggestions */}
                              {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                                  {suggestions.map(u => (
                                    <button key={u._id} type="button"
                                      onClick={() => {
                                        setCandField(pi, ci, 'fullName', u.fullname);
                                        setCandField(pi, ci, 'userId',   u._id);
                                        setUserSearch(prev => ({ ...prev, [searchKey]: u.fullname }));
                                      }}
                                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm border-b border-gray-50 last:border-0">
                                      <div className="w-7 h-7 rounded-full bg-[#001F5B]/10 flex items-center justify-center text-xs font-bold text-[#001F5B] flex-shrink-0">
                                        {u.fullname?.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-gray-800">{u.fullname}</p>
                                        <p className="text-gray-400 text-xs">{u.email}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {pos.candidates.length > 1 && (
                              <button type="button" onClick={() => removeCandidate(pi, ci)}
                                className="text-red-400 hover:text-red-600 p-1 flex-shrink-0">
                                <FiTrash2 className="text-sm" />
                              </button>
                            )}
                          </div>
                          {c.userId && (
                            <p className="text-xs text-green-600 font-medium ml-6 mb-2">
                              Linked to EMRAN member
                            </p>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                            <input value={c.photo}
                              onChange={e => setCandField(pi, ci, 'photo', e.target.value)}
                              placeholder="Photo URL (optional)"
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E30613] focus:outline-none" />
                            <input value={c.manifesto}
                              onChange={e => setCandField(pi, ci, 'manifesto', e.target.value)}
                              placeholder="Brief manifesto (optional)"
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#E30613] focus:outline-none" />
                          </div>
                        </div>
                      );
                    })}
                    <button type="button" onClick={() => addCandidate(pi)}
                      className="text-sm text-[#E30613] font-semibold flex items-center gap-1 hover:underline">
                      <FiPlus className="text-xs" /> Add Candidate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl transition flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#001F5B] hover:bg-[#0A3D6B]'}`}>
            {loading ? <><FiLoader className="animate-spin" /> Creating Election...</> : 'Create Election'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  RESULTS PAGE
// ════════════════════════════════════════════════════════════════════════════
export const ResultsPage = () => {
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    axios.get(`${ELECT_API}/all`)
      .then(res => setElections(res.data.elections || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-[#001F5B] animate-pulse">Loading results...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#001F5B] mb-8">Election Results</h1>
      {elections.length === 0 && <p className="text-gray-500">No elections found.</p>}
      {elections.map(el => (
        <div key={el._id} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-bold text-[#001F5B]">{el.title}</h2>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              el.status === 'active'            ? 'bg-green-100 text-green-700' :
              el.status === 'results_declared'  ? 'bg-purple-100 text-purple-700' :
              el.status === 'ended'             ? 'bg-gray-100 text-gray-600' :
                                                  'bg-blue-100 text-blue-700'
            }`}>{el.status.replace('_', ' ').toUpperCase()}</span>
          </div>
          {el.winner && (
            <div className="mb-4 bg-purple-50 border border-purple-200 text-purple-800 rounded-xl px-4 py-3 text-sm font-medium">
              Winners: {el.winner}
            </div>
          )}
          {el.positions.map((pos, pi) => (
            <div key={pi} className="mb-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">{pos.title}</h3>
              {[...pos.candidates]
                .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
                .map((c, ci) => (
                  <div key={ci} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      {ci === 0 && el.status === 'results_declared' && (
                        <span className="text-xs bg-[#E30613] text-white px-2 py-0.5 rounded-full font-bold">WINNER</span>
                      )}
                      <span className="text-sm font-semibold text-gray-800">{c.fullName}</span>
                    </div>
                    <span className="text-sm text-gray-500">{c.voteCount || 0} votes</span>
                  </div>
                ))
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN MANAGE ELECTIONS (replaces AdminManageCandidates)
// ════════════════════════════════════════════════════════════════════════════
export const AdminManageCandidates = () => {
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState({});

  const load = () => {
    setLoading(true);
    axios.get(`${ELECT_API}/all`)
      .then(res => setElections(res.data.elections || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (id, type, text) => {
    setMsg(prev => ({ ...prev, [id]: { type, text } }));
    setTimeout(() => setMsg(prev => { const n = {...prev}; delete n[id]; return n; }), 4000);
  };

  const doAction = async (label, id, fn) => {
    if (!window.confirm(`${label}?`)) return;
    try {
      await fn();
      showMsg(id, 'success', `${label} successful`);
      load();
    } catch (err) {
      showMsg(id, 'error', err.response?.data?.message || `${label} failed`);
    }
  };

  if (loading) return <div className="text-center py-12 text-[#001F5B] animate-pulse">Loading elections...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#001F5B] mb-8">Manage Elections</h1>
      {elections.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <div className="text-5xl mb-3">🗳️</div>
          <p className="text-gray-500 text-lg">No elections yet. Go to Create Info to create an election.</p>
        </div>
      )}
      {elections.map(el => (
        <div key={el._id} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {msg[el._id] && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
              msg[el._id].type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {msg[el._id].type === 'success' ? <FiCheckCircle /> : <FiXCircle />} {msg[el._id].text}
            </div>
          )}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#001F5B]">{el.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                Start: {new Date(el.startDate).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                &nbsp;· {el.voters?.length || 0} voters · {el.positions.length} position{el.positions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${
              el.status === 'active'           ? 'bg-green-100 text-green-700' :
              el.status === 'results_declared' ? 'bg-purple-100 text-purple-700' :
              el.status === 'ended'            ? 'bg-gray-100 text-gray-600'  :
                                                 'bg-blue-100 text-blue-700'
            }`}>{el.status.replace('_', ' ').toUpperCase()}</span>
          </div>

          {/* Live vote counts per position */}
          {el.positions.map((pos, pi) => (
            <div key={pi} className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{pos.title}</p>
              <div className="space-y-1">
                {[...pos.candidates]
                  .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
                  .map((c, ci) => {
                    const total = pos.candidates.reduce((s, x) => s + (x.voteCount || 0), 0);
                    const pct   = total > 0 ? Math.round((c.voteCount / total) * 100) : 0;
                    return (
                      <div key={ci} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 w-40 truncate">{c.fullName}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ci === 0 ? '#E30613' : '#001F5B' }} />
                        </div>
                        <span className="text-xs text-gray-500 w-20 text-right">{c.voteCount || 0} votes ({pct}%)</span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100">
            {el.status === 'active' && (
              <button
                onClick={() => doAction('End Election', el._id, () => axios.put(`${ELECT_API}/${el._id}/end`))}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
                End Election
              </button>
            )}
            {el.status === 'ended' && (
              <button
                onClick={() => doAction('Declare Results', el._id, () => axios.put(`${ELECT_API}/${el._id}/declare-results`))}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#E30613] text-white rounded-xl text-sm font-semibold hover:bg-[#c20511] transition">
                Declare Results
              </button>
            )}
            {el.status === 'results_declared' && el.winner && (
              <div className="bg-purple-50 border border-purple-200 text-purple-800 rounded-xl px-4 py-2.5 text-sm font-medium">
                {el.winner}
              </div>
            )}
            <button
              onClick={() => doAction('Delete this election permanently', el._id,
                () => axios.delete(`${ELECT_API}/${el._id}`).then(() => load()))}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

