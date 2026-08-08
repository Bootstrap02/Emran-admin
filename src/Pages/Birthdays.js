import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin';

const getAdminIdFromStorage = () => {
  try {
    const d = JSON.parse(localStorage.getItem('userData')) || JSON.parse(localStorage.getItem('adminData'));
    return d?.user?._id || d?._id || d?.id || d?.userId || '';
  } catch (e) { return ''; }
};

const Birthdays = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.birthdays)) return data.birthdays;
    if (Array.isArray(data?.members)) return data.members;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

const fetchBirthdays = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const adminId = getAdminIdFromStorage();
      const params = {};
      if (adminId) params.adminId = adminId;
      const res = await axios.get(`${API_BASE}/checkbirthdays`, { params });
      const items = extractList(res?.data);
      setList(items);
      if (items.length === 0) setError('No birthdays found.');
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

  const getName = (item) =>
    item?.fullname || item?.fullName || item?.name || item?.username ||
    (item?.firstname || '') + ' ' + (item?.lastname || '') || item?._id || '-';

  const getDob = (item) =>
    item?.dob || item?.DOB || item?.dateOfBirth || item?.birthday || item?.birthDate || item?.dateOfbirth || '';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001F5B]">Birthdays</h1>
          <p className="text-gray-600 mt-1">Members celebrating birthdays.</p>
        </div>
        <button
          onClick={fetchBirthdays}
          disabled={loading}
          className="bg-[#E30613] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#c50511] disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

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
            const dob = getDob(item);
            const age = getAge(dob);
            return (
              <div key={item?._id || item?.id || idx} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#001F5B]">{getName(item)}</h3>
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="font-medium text-gray-700">Date of Birth:</span> {formatDate(dob)}
                  </div>
                  {age !== null && (
                    <div className="text-sm text-gray-500"><span className="font-medium text-gray-700">Age:</span> {age}</div>
                  )}
                </div>
                <div className="w-40 text-right">
                  <div className="text-sm text-gray-500">Member ID</div>
                  <div className="font-medium text-gray-800">{item?._id || item?.id || '-'}</div>
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
