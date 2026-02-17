// pages/AdminHome.jsx — COMPLEX ADMIN HOMEPAGE
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { NavLink } from 'react-router-dom';
import {  FiUsers, } from 'react-icons/fi';


const AdminHome = () => {
const navigate = useNavigate();

  useEffect(() => {
    const admin= JSON.parse(localStorage.getItem("adminData"))
    const adminToken= JSON.parse(localStorage.getItem("adminToken"))
    if (!admin && !adminToken) {
      navigate('/');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero / Welcome */}
      <section className="bg-gradient-to-br from-[#001F5B] to-[#0A3D6B] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            EMRAN Admin Dashboard
          </h1>
          <p className="text-2xl opacity-90 max-w-3xl mx-auto">
            Manage users, approvals, notifications, messages, alerts, news, events, pension, and health coverage.
          </p>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Users Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition transform hover:-translate-y-2 border-t-8 border-[#E30613]">
            <FiUsers className="text-6xl text-[#E30613] mb-6" />
            <h2 className="text-3xl font-bold text-[#001F5B] mb-4">User Management</h2>
            <p className="text-gray-600 mb-6">Approve signups, search users, manage dues, edit profiles, delete accounts.</p>
            <div className="space-y-3">
              <NavLink to="/users" className="block text-[#E30613] font-bold hover:underline">All Users</NavLink>
              <NavLink to="/finduser" className="block text-[#E30613] font-bold hover:underline">Find a User</NavLink>
              <NavLink to="/sortdues" className="block text-[#E30613] font-bold hover:underline">Dues Status</NavLink>
            </div>
          </div>

          {/* Notifications & Messages */}
          {/* <div className="bg-white rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition transform hover:-translate-y-2 border-t-8 border-[#E30613]">
            <FiBell className="text-6xl text-[#E30613] mb-6" />
            <h2 className="text-3xl font-bold text-[#001F5B] mb-4">Communications</h2>
            <p className="text-gray-600 mb-6">Send notifications, manage messages, create urgent alerts.</p>
            <div className="space-y-3">
              <NavLink to="/admin/notifications" className="block text-[#E30613] font-bold hover:underline">Notifications</NavLink>
              <NavLink to="/admin/messages" className="block text-[#E30613] font-bold hover:underline">Messages</NavLink>
              <NavLink to="/admin/alerts" className="block text-[#E30613] font-bold hover:underline">Alerts</NavLink>
            </div>
          </div> */}

          {/* News, Events, Pension, Health */}
          {/* <div className="bg-white rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition transform hover:-translate-y-2 border-t-8 border-[#E30613]">
            <FiCalendar className="text-6xl text-[#E30613] mb-6" />
            <h2 className="text-3xl font-bold text-[#001F5B] mb-4">Content & Benefits</h2>
            <p className="text-gray-600 mb-6">Manage news, events, pension overview, health coverage.</p>
            <div className="space-y-3">
              <NavLink to="/admin/news-events" className="block text-[#E30613] font-bold hover:underline">News & Events</NavLink>
              <NavLink to="/admin/pension-overview" className="block text-[#E30613] font-bold hover:underline">Pension Overview</NavLink>
              <NavLink to="/admin/health-overview" className="block text-[#E30613] font-bold hover:underline">Health Coverage</NavLink>
            </div>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminHome;