
// Pages/Birthdays.js — Admin birthday management
// Tab 1: Original UI — birthday list table + send button (RESTORED)
// Tab 2: 4-day milestone reminder (NEW — does not touch Tab 1)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';
const MILESTONE_AGES = [70, 80, 90, 100];

const Birthdays = () => {
  const [tab,           setTab]           = useState('birthdays');
  // ── Tab 1 state ──────────────────────────────────────────────────────────
  const [birthdays,     setBirthdays]     = useState([]);
  const [loadingList,   setLoadingList]   = useState(true);
  const [checking,      setChecking]      = useState(false);
  const [checkResult,   setCheckResult]   = useState(null);
  const [listError,     setListError]     = useState('');
  // ── Tab 2 state ──────────────────────────────────────────────────────────
  const [milestoneLoad, setMilestoneLoad] = useState(false);
  const [milestoneRes,  setMilestoneRes]  = useState(null);
  const [milestoneErr,  setMilestoneErr]  = useState('');

  // Load birthday list on mount
  useEffect(() => {
    axios.get(`${API}/listbirthdays`)
      .then(res => setBirthdays(res.data.birthdays || []))
      .catch(() => setListError('Failed to load birthday list. Please refresh the page.'))
      .finally(() => setLoadingList(false));
  }, []);

  // Format just month + day
  const fmtMonthDay = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  };

  // Current age
  const getAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const b     = new Date(dob);
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  // Days until next birthday
  const daysUntil = (nextBirthdayStr) => {
    if (!nextBirthdayStr) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const next  = new Date(nextBirthdayStr); next.setHours(0,0,0,0);
    return Math.round((next - today) / 86400000);
  };

  // Trigger birthday emails
  const handleCheck = async () => {
    setChecking(true); setCheckResult(null);
    try {
      const res = await axios.get(`${API}/checkbirthdays`);
      setCheckResult({ ok: true, msg: res.data.message || 'Birthday emails sent successfully!' });
    } catch (err) {
      setCheckResult({ ok: false, msg: err.response?.data?.message || 'Failed to send birthday emails.' });
    } finally { setChecking(false); }
  };

  // Trigger 4-day milestone reminder
  const handleMilestone = async () => {
    setMilestoneLoad(true); setMilestoneRes(null); setMilestoneErr('');
    try {
      const res = await axios.post(`${API}/check-milestone-upcoming`);
      setMilestoneRes(res.data);
    } catch (err) {
      setMilestoneErr(err.response?.data?.message || 'Failed to send milestone reminder.');
    } finally { setMilestoneLoad(false); }
  };

  const todayBirthdays    = birthdays.filter(b => b.isToday);
  const upcomingBirthdays = birthdays.filter(b => !b.isToday);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#001F5B] mb-1">Birthdays</h1>
        <p className="text-gray-500 text-sm">Manage member birthday notifications and milestone reminders.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-gray-200">
        <button onClick={() => setTab('birthdays')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition ${
            tab === 'birthdays' ? 'border-[#E30613] text-[#E30613]' : 'border-transparent text-gray-500 hover:text-[#001F5B]'
          }`}>
          🎂 Birthday List
        </button>
        <button onClick={() => setTab('milestone')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 transition ${
            tab === 'milestone' ? 'border-[#E30613] text-[#E30613]' : 'border-transparent text-gray-500 hover:text-[#001F5B]'
          }`}>
          🎁 Milestone Reminder (4-Day)
        </button>
      </div>

      {/* ══════ TAB 1: BIRTHDAY LIST ══════ */}
      {tab === 'birthdays' && (
        <div>
          {/* Send button card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#001F5B] mb-1">Check & Send Birthday Emails</h2>
            <p className="text-sm text-gray-500 mb-4">
              Sends Happy Birthday emails to all members celebrating today.
              Milestone birthdays (70, 80, 90, 100) are also CC'd to emranannuitants@gmail.com.
              A tomorrow's digest is sent to the admin email.
            </p>
            {checkResult && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
                checkResult.ok
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>{checkResult.msg}</div>
            )}
            <button onClick={handleCheck} disabled={checking}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
              style={{ background: checking ? '#9CA3AF' : '#001F5B' }}>
              {checking ? 'Sending Emails...' : 'Check & Send Birthday Emails'}
            </button>
          </div>

          {/* Today's birthday cards */}
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
                    <div key={i}
                      className={`bg-white rounded-2xl p-5 shadow border-2 ${
                        isMilestone ? 'border-[#E30613]' : 'border-[#001F5B]/20'
                      }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#001F5B] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                          {b.fullname?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#001F5B] text-sm truncate">{b.fullname}</p>
                          <p className="text-xs text-gray-400 truncate">{b.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{fmtMonthDay(b.dateOfBirth)}</span>
                        <div className="flex items-center gap-1.5">
                          {age !== null && (
                            <span className="text-xs font-bold text-gray-500">{age} yrs</span>
                          )}
                          {isMilestone && (
                            <span className="text-xs bg-[#E30613] text-white px-2 py-0.5 rounded-full font-bold">
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

          {/* Upcoming birthdays table */}
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#001F5B] text-white">
                        {['Name','Email','Birthday','Age','Days Away'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingBirthdays.map((b, i) => {
                        const age         = getAge(b.dateOfBirth);
                        const nextAge     = age !== null ? age + 1 : null;
                        const isMilestone = MILESTONE_AGES.includes(nextAge);
                        const days        = daysUntil(b.nextBirthday);
                        return (
                          <tr key={i}
                            className={`border-b border-gray-50 ${
                              isMilestone ? 'bg-red-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}>
                            <td className="px-4 py-3 font-semibold text-[#001F5B]">
                              {b.fullname}
                              {isMilestone && (
                                <span className="ml-2 text-xs bg-[#E30613] text-white px-1.5 py-0.5 rounded-full font-bold">
                                  {nextAge}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{b.email}</td>
                            <td className="px-4 py-3 text-gray-700">{fmtMonthDay(b.dateOfBirth)}</td>
                            <td className="px-4 py-3 text-gray-500">{age ?? '—'}</td>
                            <td className="px-4 py-3">
                              {days !== null ? (
                                <span className={`font-bold ${
                                  days === 0 ? 'text-[#E30613]' :
                                  days <= 7  ? 'text-amber-600' : 'text-gray-600'
                                }`}>
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ TAB 2: MILESTONE REMINDER ══════ */}
      {tab === 'milestone' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-[#001F5B] mb-2">4-Day Milestone Birthday Reminder</h2>
          <p className="text-sm text-gray-500 mb-2">
            Scans all members for milestone birthdays (70, 80, 90, 100) occurring exactly{' '}
            <strong>4 days from today</strong>. Sends an advance notice to Mrs. Beatrice Atekha,
            CC'd to emranannuitants@gmail.com and fxudegbu@gmail.com.
          </p>
          <div className="bg-[#001F5B]/5 border border-[#001F5B]/20 rounded-xl px-4 py-3 text-xs text-[#001F5B] mb-6">
            This runs automatically at 8 AM every day via cron job. Use this button to trigger it manually.
          </div>

          {milestoneErr && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {milestoneErr}
            </div>
          )}

          {milestoneRes && (
            <div className="mb-5 px-4 py-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">
              <p className="font-bold mb-1">{milestoneRes.message}</p>
              {milestoneRes.members?.length > 0 && (
                <ul className="mt-2 space-y-1 pl-5 list-disc text-xs">
                  {milestoneRes.members.map((name, i) => <li key={i}>{name}</li>)}
                </ul>
              )}
              {milestoneRes.count === 0 && (
                <p className="text-xs mt-1 text-green-700">No milestone birthdays in 4 days.</p>
              )}
            </div>
          )}

          <button onClick={handleMilestone} disabled={milestoneLoad}
            className="px-8 py-3 rounded-xl text-white font-bold text-sm transition"
            style={{ background: milestoneLoad ? '#9CA3AF' : '#E30613' }}>
            {milestoneLoad ? 'Sending...' : 'Send 4-Day Milestone Alert Now'}
          </button>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Cron Schedule</p>
            <p className="text-sm font-semibold text-[#001F5B]">Every day at 8:00 AM — Africa/Lagos timezone</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Birthdays;
