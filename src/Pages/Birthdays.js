
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';

const Birthdays = () => {
  const [list, setList] = useState([]);
  const [totalChecked, setTotalChecked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const fetchBirthdays = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/listbirthdays`);
      const items = res?.data?.birthdays || [];
      setList(items);
      setTotalChecked(res?.data?.totalUsersChecked ?? null);
      if (items.length === 0) setError('No members have a date of birth on file yet.');
    } catch (err) {
      console.error('Failed to fetch birthdays:', err);
      setError(err.response?.data?.message || 'Failed to fetch birthdays.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBirthdays();
  }, [fetchBirthdays]);

  const handleSendBirthdayEmails = async () => {
    setSending(true);
    try {
      await axios.get(`${API_BASE}/checkbirthdays`);
      alert('Birthday emails sent successfully!');
    } catch (err) {
      console.error('Failed to send birthday emails:', err);
      alert(err.response?.data?.message || 'Failed to send birthday emails.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getAge = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  };

  const daysUntil = (nextBirthdayStr) => {
    const next = new Date(nextBirthdayStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    return Math.round((next - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001F5B]">Birthdays</h1>
          <p className="text-gray-600 mt-1">
            Members with a date of birth on file, sorted by who's next.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSendBirthdayEmails}
            disabled={sending}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white px-5 py-3 rounded-lg font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <span>🎉</span>
            {sending ? 'Sending Emails...' : 'Send Birthday Emails'}
          </button>

          <button
            onClick={fetchBirthdays}
            disabled={loading}
            className="bg-[#E30613] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#c50511] transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {totalChecked !== null && (
        <p className="text-xs text-gray-400 mb-4">
          {list.length} of {totalChecked} total members have a date of birth on file.
        </p>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {loading ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
          Loading birthdays...
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map((item, idx) => {
            const days = daysUntil(item.nextBirthday);
            const age = getAge(item.dateOfBirth);
            return (
              <div
                key={item?._id || idx}
                className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-[#001F5B]">
                      {item.fullname}
                    </h3>
                    {item.isToday && (
                      <span className="text-xs font-bold bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        🎂 TODAY
                      </span>
                    )}
                    {!item.isToday && days === 1 && (
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Tomorrow
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="font-medium text-gray-700">Date of Birth:</span>{' '}
                    {formatDate(item.dateOfBirth)}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Turning:</span>{' '}
                    {age !== null ? age + 1 : '-'}
                  </div>
                  {!item.isToday && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Next birthday in:</span>{' '}
                      {days} day{days !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="w-40 text-right">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-800 text-sm break-all">
                    {item.email || '-'}
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && list.length === 0 && !error && (
            <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
              No birthdays to display.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Birthdays;
