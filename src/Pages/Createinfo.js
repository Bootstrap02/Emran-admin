import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiLoader, FiXCircle, FiCheckCircle } from 'react-icons/fi';

const API_URL = "https://campusbuy-backend-nkmx.onrender.com/mobilcreatecandidates";
// Get all candidates
const getCandidates = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
// Get results
const getResults = async () => {
  const res = await axios.get(`${API_URL}/results`);
  return res.data;
};

// Admin create candidate
const createCandidate = async (data) => {
  const res = await axios.post(`${API_URL}/admin/create`, data);
  return res.data;
};

// Admin delete candidate
const deleteCandidate = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/${id}`);
  return res.data;
};

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


export  const AdminCreateCandidate = () => {
  const [form, setForm] = useState({
    office: "",
    fullName: "",
    photo: "",
    manifesto: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCandidate(form);
    alert("Candidate Created");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Candidate</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="office"
          placeholder="Office (e.g President)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="fullName"
          placeholder="Full Name"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="photo"
          placeholder="Photo URL"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <textarea
          name="manifesto"
          placeholder="Manifesto"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <button className="w-full bg-green-600 text-white py-3 rounded">
          Create
        </button>
      </form>
    </div>
  );
};


export const ResultsPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const data = await getResults();
    setResults(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Election Results</h1>

      {results.map((r, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg mb-4 shadow"
        >
          <h2 className="font-semibold">{r.office}</h2>
          <p>{r.candidate}</p>
          <p className="text-blue-600 font-bold">
            {r.totalVotes} votes
          </p>
        </div>
      ))}
    </div>
  );
};



export const AdminManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const data = await getCandidates();
    setCandidates(data);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this candidate?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCandidate(id);
      alert("Candidate deleted successfully");
      fetchCandidates(); // refresh list
    } catch (error) {
      alert("Delete failed");
    }
  };

  // Group by office
  const grouped = candidates.reduce((acc, candidate) => {
    acc[candidate.office] = acc[candidate.office] || [];
    acc[candidate.office].push(candidate);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Manage Candidates
      </h1>

      {Object.keys(grouped).map((office) => (
        <div key={office} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {office}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {grouped[office].map((candidate) => (
              <div
                key={candidate._id}
                className="border rounded-xl p-4 shadow"
              >
                {candidate.photo && (
                  <img
                    src={candidate.photo}
                    alt={candidate.fullName}
                    className="h-24 w-24 rounded-full object-cover mb-4"
                  />
                )}

                <h3 className="font-bold">
                  {candidate.fullName}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  {candidate.manifesto}
                </p>

                <button
                  onClick={() =>
                    handleDelete(candidate._id)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
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

