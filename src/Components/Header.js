// components/AdminHeader.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiX, FiBell, FiLogOut,
  FiAlertCircle, FiMessageSquare, FiCheckCircle, 
  FiPlusCircle, FiList, FiRefreshCw
} from 'react-icons/fi';
import axios from 'axios';
import exxonLogo from '../assets/exxonmobil-logo-white.jpg';

const AdminHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Centralized Refresh Sync Engine
  const handleManualRefresh = async () => {
    const SUPER_ADMIN_ID = '6a3a408087e7a7380d79d4db';
    setIsRefreshing(true);
    try {
      const notifRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatenotifications');
      localStorage.setItem('notifications', JSON.stringify(notifRes.data.notifications || []));
      
      const eventsRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatenewsevents');
      localStorage.setItem('newsevents', JSON.stringify(eventsRes.data.newsEvent || []));
      
      const alertRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreatealert');
      localStorage.setItem('alerts', JSON.stringify(alertRes.data.alerts || []));
      
      const adminRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/admin');
      localStorage.setItem('admin', JSON.stringify(adminRes.data.admin || {}));
      
      const usersRes = await axios.get('https://campusbuy-backend-nkmx.onrender.com/mobilcreateuser/getusers');
      localStorage.setItem('users', JSON.stringify(usersRes.data.users || []));
      
      const messageRes = await axios.get(`https://campusbuy-backend-nkmx.onrender.com/mobilcreatemessages/${SUPER_ADMIN_ID}`);
      localStorage.setItem('messages', JSON.stringify(messageRes.data.messages || []));
      
      console.log('✅ Local cache synchronized successfully.');
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Run once on mounting sequence
  useEffect(() => {
    handleManualRefresh();
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
      ]
    },
    {
      title: 'Dues Payment',
      icon: <FiAlertCircle className="text-xl" />,
      items: [
        { label: 'Confirm Payment', path: '/confirmpayment', icon: <FiPlusCircle /> },
      ]
    },
    {
      title: 'Messages',
      icon: <FiMessageSquare className="text-xl" />,
      items: [
        { label: 'Send/Reply Messages', path: '/support', icon: <FiMessageSquare /> },
      ]
    },
    {
      title: 'Information MGt',
      icon: <FiBell className="text-xl" />,
      items: [
        { label: 'Create Notification', path: `/notifications/${admin?._id}`, icon: <FiPlusCircle /> },
        { label: 'View Notifications', path: '/allnotifications', icon: <FiList /> },
        { label: 'Create Alert', path: `/alerts/${admin?._id}`, icon: <FiPlusCircle /> },
        { label: 'View Alerts', path: '/allalerts', icon: <FiList /> },
        { label: 'Create Newsevent', path: `/newsevents/${admin?._id}`, icon: <FiPlusCircle /> },
        { label: 'View Newsevents', path: '/allnewsevents', icon: <FiList /> },
      ]
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
          <NavLink to="/admin" className="flex items-center gap-4 group border-radius-[50%]">
            <img src={exxonLogo} alt="EMRAN" className="h-14 transition-transform group-hover:scale-110" />
            <div>
              <h1 className={`font-extrabold text-2xl ${scrolled ? 'text-[#001F5B]' : 'text-white'}`}>
                EMRAN Admin
              </h1>
              <p className={`text-sm ${scrolled ? 'text-[#E30613]' : 'text-gray-200'}`}>Control Center</p>
            </div>
          </NavLink>

          {/* Navigation Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navSections.map((section, idx) => (
              <div key={idx} className="relative group">
                <button 
                  className={`font-medium text-lg flex items-center gap-2 transition-colors ${
                    scrolled ? 'text-[#001F5B]' : 'text-white'
                  } hover:text-[#E30613]`}
                >
                  {section.icon} {section.title}
                </button>

                <div className="absolute top-full left-0 mt-0 hidden group-hover:block bg-white shadow-2xl rounded-xl min-w-[240px] py-4 border-t-4 border-[#E30613] pointer-events-auto">
                  {section.items.map((item, i) => (
                    <NavLink
                      key={i}
                      to={item.path}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors text-gray-800"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Desktop Controls (Right Aligned) */}
          <div className="flex items-center gap-6">
            {/* Desktop Gold Refresh Action */}
            <button 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-amber-500 hover:text-amber-400 transition-colors duration-200 disabled:opacity-50"
              title="Refresh Global Data"
            >
              <FiRefreshCw className={`text-2xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button onClick={handleLogout} className="text-orange-700 hover:text-[#E30613] transition-colors">
              <FiLogOut className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#001F5B] z-50 lg:hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <NavLink to="/admin">
            <img src={exxonLogo} alt="EMRAN" className="h-12" />
          </NavLink>
          
          <div className="flex items-center gap-5">
            {/* Mobile Gold Refresh Action (Opposite Menu Switch) */}
            <button 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-amber-500 hover:text-amber-400 p-1 disabled:opacity-50"
            >
              <FiRefreshCw className={`text-2xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button onClick={() => setMobileMenuOpen(true)} className="text-white text-3xl">
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#001F5B] z-50 pt-20 px-6 overflow-y-auto">
          {/* Header Actions inside Drawer Modal */}
          <div className="absolute top-4 left-6 right-5 flex items-center justify-between">
            {/* Gold Refresh nested cleanly opposite modal exit */}
            <button 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-amber-500 hover:text-amber-400 disabled:opacity-50"
            >
              <FiRefreshCw className={`text-2xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-3xl"
            >
              <FiX />
            </button>
          </div>

          <nav className="space-y-4 mt-6">
            {navSections.map((section, idx) => (
              <div key={idx}>
                <button 
                  onClick={() => toggleMobileDropdown(section.title)}
                  className="w-full text-left text-white py-4 flex items-center justify-between border-b border-gray-700"
                >
                  <span className="flex items-center gap-3 text-xl">
                    {section.icon} {section.title}
                  </span>
                  <span>{activeMobileDropdown === section.title ? '▲' : '▼'}</span>
                </button>

                {activeMobileDropdown === section.title && (
                  <div className="pl-8 space-y-4 py-4">
                    {section.items.map((item, i) => (
                      <NavLink 
                        key={i}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-white hover:text-[#E30613] text-lg"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Navigation Drawer Bottom Control Strip */}
            <button 
              onClick={handleHome}
              className="w-full bg-white/10 text-white py-5 rounded-xl font-bold mt-8 text-xl border border-white/20"
            >
              Back
            </button>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-5 rounded-xl font-bold mt-4 text-xl hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Spacer layout buffer */}
      <div className="h-24 lg:h-28"></div>
    </>
  );
};

export default AdminHeader;
