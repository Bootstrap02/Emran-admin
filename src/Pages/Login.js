// src/pages/Login.jsx — SIMPLE ADMIN SIGN IN (REAL API)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import exxonLogo from '../assets/exxonmobil-logo-white.jpg';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatenotifications');
        localStorage.setItem('notifications', JSON.stringify(notifRes.data.notifications));

        const eventsRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents');
        localStorage.setItem('newsevents', JSON.stringify(eventsRes.data.newsEvent));
        const alertRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatealert');
        localStorage.setItem('alerts', JSON.stringify(alertRes.data.alerts));
        const adminRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/admin');
        localStorage.setItem('admin', JSON.stringify(adminRes.data.admin));
        const usersRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreateuser/getusers');
        localStorage.setItem('users', JSON.stringify(usersRes.data.users));
        const messageRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatemessages');
        localStorage.setItem('messages', JSON.stringify(messageRes.data));
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Use toast instead of alert in production
      }
    };fetchData(); // Runs once
  }, []); // Empty array = once on moun

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/login',
        formData
      );

      // Store token & admin data
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminData', JSON.stringify(res.data.admin));

      // Redirect to admin dashboard
      navigate('/firstpage'); // ← Change this to your actual admin dashboard route
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(errMsg);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F5B] via-[#001845] to-[#0A3D6B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <img 
            src={exxonLogo} 
            alt="EMRAN Admin" 
            className="h-24 mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-lg text-gray-200 opacity-90">
            ExxonMobil Retirees Association of Nigeria
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Sign In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
              >
                {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition-all transform ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-[#E30613] hover:bg-[#c20511] hover:scale-105 shadow-lg'
              } text-white flex items-center justify-center gap-3`}
            >
              {loading ? (
                <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <FiLogIn size={24} />
                  Enter Admin Portal
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <p className="text-center text-gray-300 text-sm mt-8 opacity-80">
            Secure Access • EMRAN Admin System • Expires every 3 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;