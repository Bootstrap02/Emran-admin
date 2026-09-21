
// Pages/Birthdays.js
// RESTORED original UI + milestone birthday toggle tab added
// Original: lists all members sorted by next birthday, shows today's celebrants,
//           has a "Check & Send Birthday Emails" button
// Added:    a second tab for 4-day milestone reminder (does NOT touch original)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';

const MILESTONE_AGES = [70, 80, 90, 100];

const Birthdays = () => {
  const [tab,          setTab]          = useState('birthdays');
  // ── Original birthday state ───────────────────────────────────────────────
  const [birthdays,    setBirthdays]    = useState([]);
  const [loadingList,  setLoadingList]  = useState(true);
  const [checking,     setChecking]     = useState(false);
  const [checkResult,  setCheckResult]  = useState(null);
  const [listError,    setListError]    = useState('');
  // ── Milestone tab state ───────────────────────────────────────────────────
  const [milestoneLoading, setMilestoneLoading] = useState(false);
  const [milestoneResult,  setMilestoneResult]  = useState(null);
  const [milestoneError,   setMilestoneError]   = useState('');

  // ── Load birthday list on mount ───────────────────────────────────────────
  useEffect(() => {
    const fetchBirthdays = async () => {
      setLoadingList(true);
      setListError('');
      try {
        const res = await axios.get(`${API}/listbirthdays`);
        setBirthdays(res.data.birthdays || []);
      } catch (err) {
        setListError('Failed to load birthday list. Please refresh.');
      } finally {
        setLoadingList(false);
      }
    };
    fetchBirthdays();
  }, []);

  // ── Check & send birthday emails ──────────────────────────────────────────
  const handleCheck = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      const res = await axios.get(`${API}/checkbirthdays`);
      setCheckResult({ type: 'success', message: res.data.message || 'Birthday emails sent successfully!' });
    } catch (err) {
      setCheckResult({ type: 'error', message: err.response?.data?.message || 'Failed to send birthday emails.' });
    } finally {
      setChecking(false);
    }
  };

  // ── 4-day milestone reminder ──────────────────────────────────────────────
  const handleMilestoneCheck = async () => {
    setMilestoneLoading(true);
    setMilestoneResult(null);
    setMilestoneError('');
    try {
      const res = await axios.post(`${API}/check-milestone-upcoming`);
      setMilestoneResult(res.data);
    } catch (err) {
      setMilestoneError(err.response?.data?.message || 'Failed to send milestone reminder.');
    } finally {
      setMilestoneLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  };

  const getAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getDaysUntil = (nextBirthday) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const next  = new Date(nextBirthday);
    next.setHours(0,0,0,0);
    return Math.round((next - today) / (1000 * 60 * 60 * 24));
  };

  const todayBirthdays    = birthdays.filter(b => b.isToday);
  const upcomingBirthdays = birthdays.filter(b => !b.isToday);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#001F5B] mb-1">Birthdays</h1>
        <p className="text-gray-500 text-sm">
          View upcoming member birthdays and send birthday emails.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('birthdays')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
            tab === 'birthdays'
              ? 'border-[#E30613] text-[#E30613]'
              : 'border-transparent text-gray-500 hover:text-[#001F5B]'
          }`}>
          🎂 Birthday List
        </button>
        <button
          onClick={() => setTab('milestone')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
            tab === 'milestone'
              ? 'border-[#E30613] text-[#E30613]'
              : 'border-transparent text-gray-500 hover:text-[#001F5B]'
          }`}>
          🎁 Milestone Reminder (4-Day)
        </button>
      </div>

      {/* ══════════════ BIRTHDAY LIST TAB ══════════════ */}
      {tab === 'birthdays' && (
        <div>
          {/* Check button */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#001F5B] mb-1">Send Birthday Emails</h2>
            <p className="text-sm text-gray-500 mb-4">
              Click the button below to scan today's birthdays and send congratulatory emails to members.
              Milestone birthdays (70, 80, 90, 100) also notify the annuitants email.
            </p>
            {checkResult && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
                checkResult.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {checkResult.message}
              </div>
            )}
            <button
              onClick={handleCheck}
              disabled={checking}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
              style={{ background: checking ? '#9CA3AF' : '#001F5B' }}>
              {checking ? 'Sending Emails...' : 'Check & Send Birthday Emails'}
            </button>
          </div>

          {/* Today's birthdays */}
          {todayBirthdays.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#001F5B] mb-3 flex items-center gap-2">
                🎂 Today's Birthdays
                <span className="text-xs bg-[#E30613] text-white px-2 py-0.5 rounded-full font-bold">
                  {todayBirthdays.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayBirthdays.map((b, i) => {
                  const age         = getAge(b.dateOfBirth);
                  const isMilestone = MILESTONE_AGES.includes(age);
                  return (
                    <div key={i} className={`bg-white rounded-2xl p-5 shadow border-2 ${
                      isMilestone ? 'border-[#E30613]' : 'border-[#001F5B]/20'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#001F5B] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                          {b.fullname?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#001F5B] text-sm truncate">{b.fullname}</p>
                          <p className="text-xs text-gray-400 truncate">{b.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">{formatDate(b.dateOfBirth)}</span>
                        <div className="flex items-center gap-1">
                          {age && (
                            <span className="text-xs font-bold text-gray-500">{age} yrs</span>
                          )}
                          {isMilestone && (
                            <span className="text-xs bg-[#E30613] text-white px-2 py-0.5 rounded-full font-bold ml-1">
                              MILESTONE
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          🎉 Today!
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming birthdays list */}
          <div>
            <h2 className="text-lg font-bold text-[#001F5B] mb-3">
              Upcoming Birthdays
              {!loadingList && (
                <span className="text-xs text-gray-400 font-normal ml-2">
                  ({upcomingBirthdays.length} members)
                </span>
              )}
            </h2>

            {listError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                {listError}
              </div>
            )}

            {loadingList ? (
              <div className="text-center py-12 text-[#001F5B] animate-pulse">Loading birthday list...</div>
            ) : upcomingBirthdays.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
                No upcoming birthdays found.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#001F5B] text-white">
                      <th className="px-4 py-3 text-left text-xs font-bold">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Birthday</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Age</th>
                      <th className="px-4 py-3 text-left text-xs font-bold">Days Away</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBirthdays.map((b, i) => {
                      const age         = getAge(b.dateOfBirth);
                      const nextAge     = age ? age + 1 : null;
                      const isMilestone = MILESTONE_AGES.includes(nextAge);
                      const days        = b.nextBirthday ? getDaysUntil(b.nextBirthday) : null;
                      return (
                        <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isMilestone ? 'bg-red-50' : ''}`}>
                          <td className="px-4 py-3 font-semibold text-[#001F5B]">
                            {b.fullname}
                            {isMilestone && (
                              <span className="ml-2 text-xs bg-[#E30613] text-white px-1.5 py-0.5 rounded-full font-bold">
                                {nextAge}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{b.email}</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(b.dateOfBirth)}</td>
                          <td className="px-4 py-3 text-gray-500">{age || '—'}</td>
                          <td className="px-4 py-3">
                            {days !== null ? (
                              <span className={`font-bold ${days <= 7 ? 'text-[#E30613]' : 'text-gray-600'}`}>
                                {days === 0 ? 'Today!' : `${days} day${days !== 1 ? 's' : ''}`}
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ MILESTONE TAB ══════════════ */}
      {tab === 'milestone' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-[#001F5B] mb-2">4-Day Milestone Birthday Reminder</h2>
          <p className="text-sm text-gray-500 mb-2">
            Scans all members for milestone birthdays (70, 80, 90, 100) occurring
            exactly <strong>4 days from today</strong>. Sends an advance notice to Mrs. Beatrice Atekha,
            CC'd to emranannuitants@gmail.com and fxudegbu@gmail.com.
          </p>
          <div className="bg-[#001F5B]/5 border border-[#001F5B]/20 rounded-xl px-4 py-3 text-xs text-[#001F5B] mb-6">
            This runs automatically at 8 AM every day via cron. Use this button to trigger it manually.
          </div>

          {milestoneError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {milestoneError}
            </div>
          )}

          {milestoneResult && (
            <div className="mb-5 px-4 py-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">
              <p className="font-bold mb-1">{milestoneResult.message}</p>
              {milestoneResult.members && milestoneResult.members.length > 0 && (
                <ul className="mt-2 space-y-1 pl-5 list-disc text-xs">
                  {milestoneResult.members.map((name, i) => <li key={i}>{name}</li>)}
                </ul>
              )}
              {milestoneResult.count === 0 && (
                <p className="text-xs mt-1 text-green-700">No milestone birthdays in 4 days.</p>
              )}
            </div>
          )}

          <button
            onClick={handleMilestoneCheck}
            disabled={milestoneLoading}
            className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
            style={{ background: milestoneLoading ? '#9CA3AF' : '#E30613' }}>
            {milestoneLoading ? 'Sending...' : 'Send 4-Day Milestone Alert Now'}
          </button>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Cron Schedule</p>
            <p className="text-sm font-semibold text-[#001F5B]">Every day at 8:00 AM — Africa/Lagos timezone</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Birthdays;
