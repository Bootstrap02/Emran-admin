
// Pages/Birthdays.jsx
// Tabbed page — toggle between:
//   Tab 1: Today's Birthdays (existing checkBirthdays)
//   Tab 2: 4-Day Milestone Reminder (new checkMilestoneUpcoming)

import React, { useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiLoader, FiGift, FiCalendar } from 'react-icons/fi';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';

const Birthdays = () => {
  const [tab,      setTab]      = useState('today');
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const endpoint = tab === 'today'
        ? `${API}/check-birthdays`
        : `${API}/check-milestone-upcoming`;
      const res = await axios.post(endpoint);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed. Please try again.');
    } finally { setLoading(false); }
  };

  const isToday = tab === 'today';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#001F5B] mb-1">Birthday Management</h1>
        <p className="text-gray-500 text-sm">
          Trigger birthday checks manually or let cron jobs run them automatically at midnight daily.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setTab('today'); setResult(null); setError(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            isToday ? 'bg-[#001F5B] text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#001F5B]/30'
          }`}>
          <FiCalendar /> Today's Birthdays
        </button>
        <button
          onClick={() => { setTab('milestone'); setResult(null); setError(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            !isToday ? 'bg-[#001F5B] text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#001F5B]/30'
          }`}>
          <FiGift /> 4-Day Milestone Alert
        </button>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {isToday ? (
          <>
            <h2 className="text-xl font-bold text-[#001F5B] mb-2">Today's Birthday Check</h2>
            <p className="text-sm text-gray-500 mb-6">
              Scans all members and:
              <br />• Sends a Happy Birthday email to every member whose birthday is <strong>today</strong>
              (milestone ages 70, 80, 90, 100 also CC emranannuitants@gmail.com)
              <br />• Sends a tomorrow's birthday digest to the admin email
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-[#001F5B] mb-2">4-Day Milestone Birthday Reminder</h2>
            <p className="text-sm text-gray-500 mb-2">
              Scans all members for milestone birthdays (60, 70, 80, 90, 100) occurring
              exactly <strong>4 days from today</strong> and sends an advance notice to Mrs. Beatrice Atekha,
              CC'd to emranannuitants@gmail.com and fxudegbu@gmail.com.
            </p>
            <div className="bg-[#001F5B]/5 border border-[#001F5B]/20 rounded-xl px-4 py-3 text-xs text-[#001F5B] mb-6">
              This runs automatically at 8 AM every day via cron. Use this button to trigger it manually.
            </div>
          </>
        )}

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <FiXCircle className="flex-shrink-0" /> {error}
          </div>
        )}

        {result && (
          <div className="mb-5 px-4 py-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">
            <div className="flex items-center gap-2 font-bold mb-1">
              <FiCheckCircle /> {result.message}
            </div>
            {result.members && result.members.length > 0 && (
              <ul className="mt-2 space-y-1 pl-6 list-disc text-xs">
                {result.members.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
            )}
            {result.count === 0 && (
              <p className="text-xs mt-1 text-green-700">No members matched for this check.</p>
            )}
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base transition flex items-center justify-center gap-3"
          style={{ background: loading ? '#9CA3AF' : isToday ? '#001F5B' : '#E30613' }}>
          {loading
            ? <><FiLoader className="animate-spin" /> Running Check...</>
            : isToday
              ? <><FiCalendar /> Run Today's Birthday Check</>
              : <><FiGift /> Send 4-Day Milestone Alert Now</>}
        </button>
      </div>

      {/* Cron info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Today's Check Cron</p>
          <p className="text-sm font-semibold text-[#001F5B]">Every day at 12:00 AM</p>
          <p className="text-xs text-gray-400 mt-0.5">Africa/Lagos timezone</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Milestone Reminder Cron</p>
          <p className="text-sm font-semibold text-[#001F5B]">Every day at 8:00 AM</p>
          <p className="text-xs text-gray-400 mt-0.5">Africa/Lagos timezone — 4-day look-ahead</p>
        </div>
      </div>
    </div>
  );
};

export default Birthdays;
