// // pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiHome, FiCamera, FiSave } from 'react-icons/fi';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { BigLoader } from '../Modals/Loaders';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      navigate('/signin');
      return;
    }
    setUser(userData.user);
    setLoading(false);
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      localStorage.setItem('userData', JSON.stringify({ ...JSON.parse(localStorage.getItem('userData')), user }));
      setSaving(false);
      alert('Profile updated successfully!');
    }, 1500);
  };

  if (loading) return <BigLoader message="Loading your profile..." />;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#001F5B] mb-8">My Profile</h1>

          <div className="bg-white rounded-3xl shadow-2xl p-10">
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative">
                <div className="w-32 h-32 bg-[#E30613] rounded-full flex items-center justify-center text-5xl text-white font-bold shadow-xl">
                  {user.fullname.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg border-4 border-white">
                  <FiCamera className="text-[#E30613] text-xl" />
                </button>
              </div>
              <h2 className="text-3xl font-bold text-[#001F5B] mt-6">{user.fullname}</h2>
              <p className="text-gray-600">Staff ID: {user.staffId || 'EMB-1978-045'}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2" /> Full Name
                </label>
                <input
                  type="text"
                  value={user.fullname}
                  onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline mr-2" /> Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="inline mr-2" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiHome className="inline mr-2" /> Residential Address
                </label>
                <input
                  type="text"
                  placeholder="123 Retirement Avenue, Lagos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-4">
              <NavLink
                to="/dashboard"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </NavLink>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-10 py-4 bg-[#E30613] hover:bg-[#c20511] text-white font-bold rounded-xl flex items-center gap-3 shadow-lg disabled:opacity-70"
              >
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;