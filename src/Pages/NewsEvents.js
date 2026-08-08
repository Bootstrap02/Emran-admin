// pages/admin/CreateNewsevent.jsx
// Template-based news & events creator
// Templates: Birthday, Wedding, Funeral, Obituary, General Event, Custom (Other)
// Each template pops a modal with relevant fields + up to 4 image uploads
// Generates auto-filled body text for structured templates

import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com';

const broadcastPush = async (title, body) => {
  try {
    await axios.post(`${API_BASE}/mobilcreatenotifications/push/send-all`, {
      title, body, url: '/newsevents',
    });
  } catch (err) {
    console.error('Push failed:', err.message);
  }
};

// ── Template definitions ────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'birthday',
    label: 'Birthday',
    emoji: '🎂',
    color: '#F59E0B',
    bg: '#FEF3C7',
    border: '#F59E0B',
    description: 'Celebrate a member\'s milestone birthday',
    fields: [
      { name: 'celebrantName', label: 'Celebrant\'s Full Name', type: 'text', required: true, placeholder: 'e.g. Chief John Okafor' },
      { name: 'age', label: 'Age (optional)', type: 'number', placeholder: 'e.g. 70' },
      { name: 'date', label: 'Date of Celebration', type: 'date', required: true },
      { name: 'venue', label: 'Venue (optional)', placeholder: 'e.g. No. 5 Marina Road, Lagos' },
      { name: 'extraNote', label: 'Additional Message (optional)', type: 'textarea', placeholder: 'Add a personal note...' },
    ],
    generateBody: (f) =>
      `EMRAN warmly celebrates ${f.celebrantName}${f.age ? `, who is clocking ${f.age} years` : ''}, on this joyous occasion.\n\n` +
      `On behalf of the entire EMRAN family, we wish you many more years of good health, happiness, and God\'s blessings.\n\n` +
      `${f.venue ? `The celebration holds at ${f.venue}.` : ''}\n\n` +
      `${f.extraNote || ''}`.trim(),
    generateTitle: (f) =>
      `Happy Birthday${f.age ? ` @ ${f.age}` : ''} - ${f.celebrantName}`,
  },
  {
    id: 'wedding',
    label: 'Wedding',
    emoji: '💍',
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#EC4899',
    description: 'Announce a wedding celebration',
    fields: [
      { name: 'memberName', label: 'Member\'s Full Name', type: 'text', required: true, placeholder: 'e.g. Dr. Ade Bello' },
      { name: 'relation', label: 'Relationship to Member', type: 'text', placeholder: 'e.g. Son, Daughter' },
      { name: 'celebrantNames', label: 'Names of Couple', type: 'text', required: true, placeholder: 'e.g. Emeka & Ngozi' },
      { name: 'date', label: 'Wedding Date', type: 'date', required: true },
      { name: 'venue', label: 'Venue', placeholder: 'e.g. Church of God, Victoria Island' },
      { name: 'extraNote', label: 'Additional Message (optional)', type: 'textarea', placeholder: 'Reception details, dress code, etc.' },
    ],
    generateBody: (f) =>
      `EMRAN is delighted to celebrate with ${f.memberName} on the wedding of ${f.relation ? `their ${f.relation}` : 'their child'}, ${f.celebrantNames}.\n\n` +
      `We join our esteemed member in rejoicing on this beautiful occasion and pray for a marriage full of love, joy, and God\'s blessing.\n\n` +
      `${f.venue ? `The ceremony holds at ${f.venue}.` : ''}\n\n` +
      `${f.extraNote || ''}`.trim(),
    generateTitle: (f) => `Wedding Celebration - ${f.celebrantNames}`,
  },
  {
    id: 'funeral',
    label: 'Funeral / Burial',
    emoji: '🕊️',
    color: '#6B7280',
    bg: '#F9FAFB',
    border: '#9CA3AF',
    description: 'Announce burial arrangements for a member or family',
    fields: [
      { name: 'deceasedName', label: 'Name of the Deceased', type: 'text', required: true, placeholder: 'e.g. Late Chief Samuel Adeyemi' },
      { name: 'relation', label: 'Relation to EMRAN Member', type: 'text', placeholder: 'e.g. Member, Wife of Member, etc.' },
      { name: 'memberName', label: 'EMRAN Member\'s Name (if applicable)', type: 'text', placeholder: 'e.g. Mr. Tunde Adeyemi' },
      { name: 'datePassing', label: 'Date of Passing', type: 'date' },
      { name: 'burialDate', label: 'Burial Date', type: 'date', required: true },
      { name: 'venue', label: 'Burial Venue', placeholder: 'e.g. St. Peter\'s Anglican Church, Ibadan' },
      { name: 'extraNote', label: 'Additional Details (optional)', type: 'textarea', placeholder: 'Lying in state, reception details, etc.' },
    ],
    generateBody: (f) =>
      `It is with deep sorrow that EMRAN announces the passing of ${f.deceasedName}${f.relation ? ` (${f.relation})` : ''}` +
      `${f.memberName ? `, beloved of our member ${f.memberName}` : ''}.\n\n` +
      `We extend our deepest condolences to the family and pray for the repose of the soul of the deceased and for strength and comfort for all who mourn.\n\n` +
      `${f.venue ? `The burial holds at ${f.venue}.` : ''}\n\n` +
      `${f.extraNote || ''}`.trim(),
    generateTitle: (f) => `Burial Announcement - ${f.deceasedName}`,
  },
  {
    id: 'obituary',
    label: 'Obituary',
    emoji: '🕯️',
    color: '#374151',
    bg: '#F3F4F6',
    border: '#6B7280',
    description: 'Post a formal obituary for a member or family',
    fields: [
      { name: 'deceasedName', label: 'Name of the Deceased', type: 'text', required: true, placeholder: 'e.g. Late Mrs. Grace Nwosu' },
      { name: 'memberName', label: 'EMRAN Member (if family)', type: 'text', placeholder: 'e.g. Mr. Emeka Nwosu' },
      { name: 'obituaryText', label: 'Obituary Message', type: 'textarea', required: true, rows: 8,
        placeholder: 'Write the full obituary notice here...' },
    ],
    generateBody: (f) =>
      `OBITUARY\n\n${f.deceasedName}\n\n${f.obituaryText}\n\n` +
      `${f.memberName ? `The EMRAN family commiserates with our member, ${f.memberName}, and the entire family.` : ''}`.trim(),
    generateTitle: (f) => `Obituary: ${f.deceasedName}`,
  },
  {
    id: 'event',
    label: 'General Event',
    emoji: '📅',
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#3B82F6',
    description: 'AGM, welfare meeting, social gathering, seminar',
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', required: true, placeholder: 'e.g. EMRAN Annual General Meeting 2026' },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time' },
      { name: 'venue', label: 'Venue', placeholder: 'e.g. EMRAN Secretariat, Ikoyi' },
      { name: 'description', label: 'Event Description', type: 'textarea', required: true,
        placeholder: 'Describe the event, agenda, who should attend...' },
    ],
    generateBody: (f) =>
      `${f.eventName}\n\n${f.description}\n\n` +
      `Date: ${f.date ? new Date(f.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}\n` +
      `${f.time ? `Time: ${f.time}\n` : ''}` +
      `${f.venue ? `Venue: ${f.venue}` : ''}`.trim(),
    generateTitle: (f) => f.eventName,
  },
  {
    id: 'custom',
    label: 'Other / Custom',
    emoji: '✏️',
    color: '#001F5B',
    bg: '#EEF2FA',
    border: '#001F5B',
    description: 'Any other announcement or news item',
    fields: [
      { name: 'title', label: 'Title / Headline', type: 'text', required: true, placeholder: 'e.g. Important Notice to All Members' },
      { name: 'body', label: 'Full Content', type: 'textarea', required: true, rows: 10,
        placeholder: 'Write the full content of your announcement here...' },
    ],
    generateBody: (f) => f.body,
    generateTitle: (f) => f.title,
  },
];

// ── Image uploader (up to 4 images) ────────────────────────────────────────
const ImageUploader = ({ images, onChange }) => {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 4 - images.length;
    const accepted = files.slice(0, remaining);
    onChange([...images, ...accepted]);
    e.target.value = '';
  };

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Photos <span className="text-gray-400 font-normal">(up to 4 images — JPG, PNG, SVG)</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700">
              ×
            </button>
          </div>
        ))}
        {images.length < 4 && (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#E30613] hover:text-[#E30613] transition bg-gray-50">
            <span className="text-2xl mb-1">+</span>
            <span className="text-xs">Add Photo</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" multiple accept="image/jpeg,image/jpg,image/png,image/svg+xml"
        onChange={handleFiles} className="hidden" />
      {images.length > 0 && (
        <p className="text-xs text-gray-400">{images.length}/4 image{images.length > 1 ? 's' : ''} selected</p>
      )}
    </div>
  );
};

// ── Modal ───────────────────────────────────────────────────────────────────
const TemplateModal = ({ template, adminId, onClose, onSuccess }) => {
  const [fields, setFields] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setField = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    for (const f of template.fields) {
      if (f.required && !fields[f.name]?.trim()) {
        setError(`${f.label} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const title = template.generateTitle(fields);
      const body  = template.generateBody(fields);
      const category = template.id;

      // Step 1: Create the news/event
      const res = await axios.post(`${API_BASE}/mobilcreatenewsevents/${adminId}`, {
        title, body, category,
        eventDate: fields.date || fields.burialDate || null,
      });
      const newsEventId = res.data.newsEvent?._id || res.data._id;

      // Step 2: Upload all images (sequential to preserve order)
      if (images.length > 0 && newsEventId) {
        for (const img of images) {
          const fd = new FormData();
          fd.append('images', img);
          await axios.put(`${API_BASE}/mobilcreatenewsevents/image/${newsEventId}`, fd);
        }
      }

      // Step 3: Push notification
      await broadcastPush(`📢 ${title}`, body.substring(0, 100) + (body.length > 100 ? '...' : ''));

      onSuccess(`"${title}" published and push notification sent!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto"
        style={{ borderTop: `6px solid ${template.color}` }}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{template.emoji}</span>
            <div>
              <h2 className="text-2xl font-extrabold text-[#001F5B]">{template.label}</h2>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-xl font-bold transition">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Template-specific fields */}
          {template.fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={fields[f.name] || ''}
                  onChange={e => setField(f.name, e.target.value)}
                  placeholder={f.placeholder || ''}
                  rows={f.rows || 4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#E30613] focus:outline-none resize-none transition"
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={fields[f.name] || ''}
                  onChange={e => setField(f.name, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#E30613] focus:outline-none transition"
                />
              )}
            </div>
          ))}

          {/* Image uploader */}
          <ImageUploader images={images} onChange={setImages} />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2"
              style={{ background: loading ? '#9CA3AF' : template.color }}>
              {loading ? (
                <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Publishing...</>
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

// ── Main Component ──────────────────────────────────────────────────────────
const NewsEvents = () => {
  const { id: adminId } = useParams();
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSuccess = (msg) => {
    setActiveTemplate(null);
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#001F5B] mb-2">Create News & Event</h1>
          <p className="text-gray-500 text-lg">Choose a template to get started. Each template auto-generates the right message format.</p>
        </div>

        {/* Success banner */}
        {successMsg && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-6 py-4 flex items-center gap-3 font-medium">
            <span className="text-xl">✅</span> {successMsg}
          </div>
        )}

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATES.map(tmpl => (
            <button key={tmpl.id} onClick={() => setActiveTemplate(tmpl)}
              className="group text-left rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 bg-white"
              style={{ borderColor: tmpl.border + '40' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
                style={{ background: tmpl.bg }}>
                {tmpl.emoji}
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: tmpl.color }}>{tmpl.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{tmpl.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: tmpl.color }}>
                Select <span className="text-base">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          All published events are visible to members on the News & Events page and trigger a push notification.
        </p>
      </div>

      {/* Modal */}
      {activeTemplate && (
        <TemplateModal
          template={activeTemplate}
          adminId={adminId}
          onClose={() => setActiveTemplate(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default NewsEvents;

