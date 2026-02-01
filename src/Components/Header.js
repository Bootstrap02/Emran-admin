// src/components/AdminHeader.jsx — FIXED HOVER DROPDOWN + MOBILE CLICK
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSearch, FiUsers, 
  FiAlertCircle, FiMessageSquare, FiCalendar, FiHeart, FiCheckCircle, 
  FiEdit, FiTrash2, FiPlusCircle, FiList, FiDollarSign
} from 'react-icons/fi';
import exxonLogo from '../assets/exxonmobil-logo-white.jpg';

const AdminHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Dummy unread count (replace with real API)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  

  // Mobile dropdown toggle
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
        { label: 'View All', path: '/messages', icon: <FiList /> },
      ]
    },
     {
      title: 'Information MGt',
      icon: <FiBell className="text-xl" />,
      items: [
        { label: 'Create Notification', path: '/notifications', icon: <FiPlusCircle /> },
        { label: 'View Notifications', path: '/allnotifications', icon: <FiList /> },
        { label: 'Create Alert', path: '/alerts', icon: <FiPlusCircle /> },
        { label: 'View Alerts', path: '/allalerts', icon: <FiList /> },
        { label: 'Create Newsevent', path: '/newsevents', icon: <FiPlusCircle /> },
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
          <NavLink to="/admin" className="flex items-center gap-4 group">
            <img src={exxonLogo} alt="EMRAN" className="h-14 transition-transform group-hover:scale-110" />
            <div>
              <h1 className={`font-extrabold text-2xl ${scrolled ? 'text-[#001F5B]' : 'text-white'}`}>
                EMRAN Admin
              </h1>
              <p className={`text-sm ${scrolled ? 'text-[#E30613]' : 'text-gray-200'}`}>Control Center</p>
            </div>
          </NavLink>

          {/* Navigation with Hover Dropdowns */}
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

                {/* Dropdown – no gap, stays open on hover */}
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

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* Admin Profile */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin/profile')}
                className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-3 rounded-full font-bold hover:bg-[#c20511] transition shadow-lg"
              >
                <FiUser /> Admin
              </button>
              <button onClick={handleLogout} className="text-gray-700 hover:text-[#E30613]">
                <FiLogOut className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#001F5B] z-50 lg:hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <NavLink to="/admin">
            <img src={exxonLogo} alt="EMRAN" className="h-12" />
          </NavLink>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white text-3xl">
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#001F5B] z-50 pt-20 px-6 overflow-y-auto">
            <nav className="space-y-4">
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

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-5 rounded-xl font-bold mt-8 text-xl"
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-24"></div>
    </>
  );
};

export default AdminHeader;