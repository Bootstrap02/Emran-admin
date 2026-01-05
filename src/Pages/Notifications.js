// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', id: null });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get('/api/admin/notifications');
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await axios.put(`/api/admin/notifications/${form.id}`, form);
    } else {
      await axios.post('/api/admin/notifications', form);
    }
    fetchItems();
    setForm({ title: '', message: '', id: null });
  };

  const handleEdit = (item) => {
    setForm(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete notification?')) {
      await axios.delete(`/api/admin/notifications/${id}`);
      fetchItems();
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#001F5B] mb-8">Manage Notifications</h1>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-[#001F5B] mb-6">Add/Edit Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613]"
            required
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
            className="w-full p-6 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] h-32"
            required
          />
          <button className="flex items-center gap-2 bg-[#E30613] hover:bg-[#c20511] text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105">
            <FiPlus /> {form.id ? 'Update' : 'Send'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="grid gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-3xl shadow-xl p-8 flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-[#001F5B] mb-4">{item.title}</h3>
              <p className="text-lg text-gray-700">{item.message}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                <FiEdit className="text-3xl" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                <FiTrash2 className="text-3xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;