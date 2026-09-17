
// components/Header.js (Admin Header)
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiX, FiBell, FiLogOut,
  FiAlertCircle, FiCheckCircle,
  FiPlusCircle, FiList, FiRefreshCw,
  FiDollarSign, FiGift,
} from 'react-icons/fi';
import axios from 'axios';
import exxonLogo from '../assets/exxonmobil-logo-white.jpg';

const AdminHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();

  // FIX: use 'adminData' key — same key used by Login, RequestFunds, and all other pages
  const admin = JSON.parse(localStorage.getItem('adminData') || '{}');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const notifRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatenotifications');
      localStorage.setItem('notifications', JSON.stringify(notifRes.data.notifications || []));

      const eventsRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents');
      localStorage.setItem('newsevents', JSON.stringify(eventsRes.data.newsEvents || []));

      const alertRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatealert');
      localStorage.setItem('alerts', JSON.stringify(alertRes.data.alerts || []));

      const adminRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/admin');
      // FIX: store under 'adminData' so all pages read consistently
      localStorage.setItem('adminData', JSON.stringify(adminRes.data.admin || {}));

      const usersRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreateuser/getusers');
      localStorage.setItem('users', JSON.stringify(usersRes.data.users || []));

      console.log('Local cache synchronized successfully.');
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    handleManualRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleHome = () => {
    navigate('/firstpage');
  };

  const toggleMobileDropdown = (title) => {
    setActiveMobileDropdown(activeMobileDropdown === title ? null : title);
  };

  const navSections = [
    {
      title: 'Approvals',
      icon: <FiCheckCircle className="text-xl" />,
      items: [
        { label: 'Pending Signups', path: '/pending', icon: <FiList /> },
      ],
    },
    {
      title: 'Dues Payment',
      icon: <FiAlertCircle className="text-xl" />,
      items: [
        { label: 'Confirm Payment', path: '/confirmpayment', icon: <FiPlusCircle /> },
      ],
    },
    {
      title: 'Finances',
      icon: <FiDollarSign className="text-xl" />,
      items: [
        { label: 'Request Funds', path: '/requestfunds', icon: <FiPlusCircle /> },
        { label: 'Milestone Birthdays', path: '/milestonesbirthdays', icon: <FiGift /> },
        { label: 'Payment Log', path: '/paymentlog', icon: <FiList /> },
      ],
    },
    {
      title: 'Information Mgt',
      icon: <FiBell className="text-xl" />,
      items: [
        { label: 'Create Notification', path: `/notifications/${admin?._id}`, icon: <FiPlusCircle /> },
        { label: 'View Notifications', path: '/allnotifications', icon: <FiList /> },
        { label: 'Create Alert', path: `/alerts/${admin?._id}`, icon: <FiPlusCircle /> },
        { label: 'View Alerts', path: '/allalerts', icon: <FiList /> },
        { label: 'Create News/Event', path: `/newsevents/${admin?._id}`, icon: <FiPlusCircle /> },
        { label: 'View News/Events', path: '/allnewsevents', icon: <FiList /> },
        { label: 'Create Election', path: `/elections/create/${admin?._id}`, icon: <FiPlusCircle /> },
        { label: 'Manage Elections', path: '/elections/manage', icon: <FiList /> },
      ],
    },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white shadow-2xl py-3' : 'bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/firstpage" className="flex items-center gap-4 group">
            <img src={exxonLogo} alt="EMRAN" className="h-14 rounded-full transition-transform group-hover:scale-110" />
            <div>
              <h1 className={`font-extrabold text-2xl ${scrolled ? 'text-[#001F5B]' : 'text-white'}`}>
                EMRAN Admin
              </h1>
              <p className={`text-sm ${scrolled ? 'text-[#E30613]' : 'text-gray-200'}`}>Control Center</p>
            </div>
          </NavLink>

          {/* Nav Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navSections.map((section, idx) => (
              <div key={idx} className="relative group">
                <button className={`font-medium text-base flex items-center gap-2 transition-colors ${
                  scrolled ? 'text-[#001F5B]' : 'text-white'
                } hover:text-[#E30613]`}>
                  {section.icon} {section.title}
                </button>
                <div className="absolute top-full left-0 mt-0 hidden group-hover:block bg-white shadow-2xl rounded-xl min-w-[240px] py-4 border-t-4 border-[#E30613] z-50">
                  {section.items.map((item, i) => (
                    <NavLink key={i} to={item.path}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors text-gray-800 text-sm">
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-5">
            <button onClick={handleManualRefresh} disabled={isRefreshing}
              className="text-amber-500 hover:text-amber-400 transition-colors disabled:opacity-50"
              title="Refresh Data">
              <FiRefreshCw className={`text-2xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <a href="https://wa.me/2349069412463?text=Hello%2C%20I%20need%20support%20from%20EMRAN%20Admin"
              target="_blank" rel="noopener noreferrer"
              className={`transition-colors ${scrolled ? 'text-[#001F5B]' : 'text-white'} hover:text-[#25D366]`}
              title="Chat with EMRAN on WhatsApp">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm0 18.13h-.01c-1.48 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 01-1.26-4.36c0-4.54 3.7-8.24 8.27-8.24 2.21 0 4.28.86 5.84 2.42a8.17 8.17 0 012.42 5.83c0 4.55-3.7 8.25-8.26 8.25zm4.53-6.18c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.24-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z"/>
              </svg>
            </a>
            <button onClick={handleLogout} className="text-orange-700 hover:text-[#E30613] transition-colors">
              <FiLogOut className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#001F5B] z-50 lg:hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <NavLink to="/firstpage">
            <img src={exxonLogo} alt="EMRAN" className="h-12 rounded-full" />
          </NavLink>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/2349069412463?text=Hello%2C%20I%20need%20support%20from%20EMRAN%20Admin"
              target="_blank" rel="noopener noreferrer"
              className="text-white hover:text-[#25D366] transition-colors"
              title="WhatsApp EMRAN Support">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm0 18.13h-.01c-1.48 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 01-1.26-4.36c0-4.54 3.7-8.24 8.27-8.24 2.21 0 4.28.86 5.84 2.42a8.17 8.17 0 012.42 5.83c0 4.55-3.7 8.25-8.26 8.25zm4.53-6.18c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.24-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z"/>
              </svg>
            </a>
            <button onClick={handleManualRefresh} disabled={isRefreshing}
              className="text-amber-500 hover:text-amber-400 disabled:opacity-50">
              <FiRefreshCw className={`text-2xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="text-white text-3xl">
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#001F5B] z-50 pt-20 px-6 overflow-y-auto">
          <div className="absolute top-4 left-6 right-5 flex items-center justify-between">
            <button onClick={handleManualRefresh} disabled={isRefreshing}
              className="text-amber-500 hover:text-amber-400 disabled:opacity-50">
              <FiRefreshCw className={`text-2xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white text-3xl">
              <FiX />
            </button>
          </div>

          <nav className="space-y-4 mt-6">
            {navSections.map((section, idx) => (
              <div key={idx}>
                <button onClick={() => toggleMobileDropdown(section.title)}
                  className="w-full text-left text-white py-4 flex items-center justify-between border-b border-gray-700">
                  <span className="flex items-center gap-3 text-xl">
                    {section.icon} {section.title}
                  </span>
                  <span>{activeMobileDropdown === section.title ? '▲' : '▼'}</span>
                </button>
                {activeMobileDropdown === section.title && (
                  <div className="pl-8 space-y-4 py-4">
                    {section.items.map((item, i) => (
                      <NavLink key={i} to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-white hover:text-[#E30613] text-lg">
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <a href="https://wa.me/2349069412463?text=Hello%2C%20I%20need%20support%20from%20EMRAN%20Admin"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-white text-xl py-4 border-b border-gray-700 hover:text-[#25D366] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm0 18.13h-.01c-1.48 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 01-1.26-4.36c0-4.54 3.7-8.24 8.27-8.24 2.21 0 4.28.86 5.84 2.42a8.17 8.17 0 012.42 5.83c0 4.55-3.7 8.25-8.26 8.25zm4.53-6.18c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.24-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z"/>
              </svg>
              WhatsApp Support
            </a>

            <button onClick={handleHome}
              className="w-full bg-white/10 text-white py-5 rounded-xl font-bold mt-8 text-xl border border-white/20">
              Back to Home
            </button>
            <button onClick={handleLogout}
              className="w-full bg-red-600 text-white py-5 rounded-xl font-bold mt-4 text-xl hover:bg-red-700 transition">
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-24 lg:h-28" />
    </>
  );
};

export default AdminHeader;
