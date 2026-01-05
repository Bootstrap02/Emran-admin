// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exxonLogo from '../assets/exxonmobil-logo-white.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded admin (change later with real API)
    if (email === 'admin@emran.org' && password === 'emran2026') {
      localStorage.setItem('adminToken', 'fake-jwt-token');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F5B] to-[#0A3D6B] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo + Title */}
        <div className="text-center mb-12">
          <img src={exxonLogo} alt="EMRAN" className="h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-xl text-gray-200">ExxonMobil Retirees Association of Nigeria</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Sign In</h2>
          
          {error && (
            <p className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-xl text-center mb-6">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-[#E30613] transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-[#E30613] transition"
              required
            />
            <button className="w-full py-5 bg-[#E30613] hover:bg-[#c20511] text-white text-xl font-bold rounded-2xl shadow-lg transition transform hover:scale-105">
              Enter Admin Portal
            </button>
          </form>

          <p className="text-center text-gray-300 text-sm mt-8">
            Secure Access • EMRAN Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;