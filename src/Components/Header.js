// src/components/Header.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUserCheck, FiBell, FiEdit3, FiHelpCircle } from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <header className="bg-[#001F5B] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiUserCheck className="text-[#E30613]" /> EMRAN Admin Portal
        </h1>
        {isAuthenticated && (
          <nav className="flex gap-8 items-center">
            <NavLink to="/dashboard" className={({ isActive }) => `hover:text-[#E30613] transition ${isActive ? 'text-[#E30613] font-bold' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/news-events" className={({ isActive }) => `hover:text-[#E30613] transition ${isActive ? 'text-[#E30613] font-bold' : ''}`}>
              News & Events
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `hover:text-[#E30613] transition ${isActive ? 'text-[#E30613] font-bold' : ''}`}>
              Notifications
            </NavLink>
            <NavLink to="/support" className={({ isActive }) => `hover:text-[#E30613] transition ${isActive ? 'text-[#E30613] font-bold' : ''}`}>
              Support
            </NavLink>
            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-[#E30613] transition">
              <FiLogOut /> Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;