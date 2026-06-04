// src/pages/admin/AllUsers.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiMessageSquare, FiEdit, FiTrash2, FiUser, FiX, FiSend,
  FiArrowLeft, FiSave, FiMail, FiSearch, FiPhone, FiDownload
} from 'react-icons/fi';
import * as XLSX from 'xlsx';
import axios from 'axios';

// ── Helper: export users to Excel ───────────────────────────────────────────
const exportToExcel = (users, filename = 'EMRAN_Users') => {
  if (!users || users.length === 0) { alert('No users to export'); return; }

  const currentYear = new Date().getFullYear().toString();

  const rows = users.map((u) => {
    // Build dues summary string
    const duesObj = u.dues || {};
    const duesSummary = Object.entries(duesObj)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, d]) => `${year}: ${d?.payment ? `Paid (₦${d?.amount || 0})` : 'Unpaid'}`)
      .join(' | ') || 'No dues record';

    const currentYearDues = duesObj[currentYear];

    return {
      'Full Name': u.fullname || '',
      'Email': u.email || '',
      'Phone': u.phone || '',
      'Role': u.role || '',
      'Location': u.locationOfRetirement || '',
      'Company': u.companyAtRetirement || '',
      'Department': u.departmentOfRetirement || '',
      [`${currentYear} Dues`]: currentYearDues?.payment ? `Paid (₦${currentYearDues?.amount || 0})` : 'Unpaid',
      'All Dues History': duesSummary,
      'Registration Paid': u.registration?.payment ? `Yes (₦${u.registration?.amount || 0})` : 'No',
      'Date Joined': u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '',
      'Signup Approved': u.signupApproved ? 'Yes' : 'No',
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Members');

  // Column widths
  ws['!cols'] = [
    { wch: 28 }, { wch: 32 }, { wch: 18 }, { wch: 18 },
    { wch: 20 }, { wch: 12 }, { wch: 20 }, { wch: 18 },
    { wch: 50 }, { wch: 22 }, { wch: 16 }, { wch: 16 },
  ];

  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// ── Phone input style helper ─────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] outline-none transition";
const selectCls = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] outline-none transition appearance-none bg-white";

// ══════════════════════════════════════════════════════════════════════════════
// ALL USERS  — mobile-responsive card layout on small screens
// ══════════════════════════════════════════════════════════════════════════════
export const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);
  const [search, setSearch] = useState('');

  const allUsers = JSON.parse(localStorage.getItem('users'));

  useEffect(() => { setUsers(allUsers || []); }, []); // eslint-disable-line

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminData'));
    const adminToken = JSON.parse(localStorage.getItem('adminToken'));
    if (!admin && !adminToken) { navigate('/'); return; }
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.fullname?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  }, [users, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently? This cannot be undone.')) return;
    try {
      await axios.delete('https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/deleteuser/', { data: { id } });
      setUsers(prev => {
        const updated = prev.filter(u => u._id !== id);
        localStorage.setItem('users', JSON.stringify(updated));
        return updated;
      });
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  const openMessageModal = (user) => { setSelectedUser(user); setMessageText(''); setMessageModalOpen(true); };
  const sendMessage = () => {
    if (!messageText.trim()) return;
    alert(`Message sent to ${selectedUser.fullname}: "${messageText}"`);
    setMessageModalOpen(false); setMessageText('');
  };
  const openDetailModal = (user) => { setSelectedDetailUser(user); setDetailModalOpen(true); };

  const currentYear = new Date().getFullYear().toString();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-3">
            All Registered Users
          </h1>
          <p className="text-lg text-gray-600">Manage members, send messages, edit profiles</p>
        </div>

        {/* Search + Export bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E30613] outline-none" />
          </div>
          <button onClick={() => exportToExcel(filtered, 'EMRAN_All_Users')}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md whitespace-nowrap">
            <FiDownload /> Export Excel
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} user(s) found</p>

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                <tr>
                  {['Name', 'Email', 'Phone', `Dues (${currentYear})`, 'Registration', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-sm font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-500 text-xl">No users found</td></tr>
                ) : filtered.map((user, i) => {
                  const yearDues = user.dues?.[currentYear];
                  const isPaid = yearDues?.payment === true;
                  return (
                    <tr key={user._id} onClick={() => openDetailModal(user)}
                      className={`hover:bg-gray-50 transition cursor-pointer ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{user.fullname}</td>
                      <td className="px-5 py-4 text-gray-600 text-sm">{user.email}</td>
                      <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">{user.phone || 'N/A'}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isPaid ? '✓ Paid' : '✗ Unpaid'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${user.registration?.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.registration?.payment ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); openMessageModal(user); }}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition" title="Message">
                            <FiMessageSquare className="text-xl" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/useredit/${user._id}`); }}
                            className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition" title="Edit">
                            <FiEdit className="text-xl" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition" title="Delete">
                            <FiTrash2 className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="sm:hidden space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No users found</div>
          ) : filtered.map((user) => {
            const yearDues = user.dues?.[currentYear];
            const isPaid = yearDues?.payment === true;
            return (
              <div key={user._id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5"
                onClick={() => openDetailModal(user)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#001F5B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.fullname?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#001F5B] text-base leading-tight">{user.fullname}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPaid ? '✓ Paid' : '✗ Unpaid'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <FiPhone className="text-xs" />
                  <span>{user.phone || 'No phone'}</span>
                </div>
                <div className="flex gap-2 border-t pt-3" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openMessageModal(user)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl font-medium transition">
                    <FiMessageSquare /> Msg
                  </button>
                  <button onClick={() => navigate(`/useredit/${user._id}`)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-xl font-medium transition">
                    <FiEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(user._id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition">
                    <FiTrash2 /> Del
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Message Modal ── */}
      {messageModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setMessageModalOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-6 py-5 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <FiUser className="text-2xl" />
                <div>
                  <h2 className="text-lg font-bold">Message to {selectedUser.fullname}</h2>
                  <p className="text-xs opacity-80">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setMessageModalOpen(false)} className="text-white hover:text-[#E30613] text-2xl"><FiX /></button>
            </div>
            <div className="p-6">
              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..." rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 resize-none" />
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t rounded-b-3xl flex justify-end">
              <button onClick={sendMessage} disabled={!messageText.trim()}
                className={`px-8 py-3 rounded-xl font-bold transition ${messageText.trim() ? 'bg-[#E30613] text-white hover:bg-[#c20511]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                <FiSend className="inline mr-2" /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {detailModalOpen && selectedDetailUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setDetailModalOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setDetailModalOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-[#E30613] text-2xl"><FiX /></button>
            <h2 className="text-2xl font-bold text-[#001F5B] mb-6">{selectedDetailUser.fullname}</h2>
            <div className="space-y-4 text-base">
              <div><strong className="text-gray-600">Email:</strong> {selectedDetailUser.email}</div>
              <div><strong className="text-gray-600">Phone:</strong> {selectedDetailUser.phone || 'N/A'}</div>
              <div><strong className="text-gray-600">Role:</strong> {selectedDetailUser.role}</div>
              <div><strong className="text-gray-600">Registration:</strong>{' '}
                <span className={selectedDetailUser.registration?.payment ? 'text-green-600' : 'text-red-600'}>
                  {selectedDetailUser.registration?.payment ? 'Paid' : 'Not Paid'}
                </span>
              </div>
              <div>
                <strong className="text-gray-600">Dues:</strong>
                {selectedDetailUser.dues && Object.keys(selectedDetailUser.dues).length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {Object.entries(selectedDetailUser.dues).sort((a, b) => Number(a[0]) - Number(b[0])).map(([year, data]) => (
                      <div key={year} className="flex justify-between border rounded-lg px-3 py-2 text-sm">
                        <span>{year}</span>
                        <span className={data?.payment ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {data?.payment ? `Paid (₦${data.amount || 0})` : 'Unpaid'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : <span className="text-gray-400 ml-2">No records</span>}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 justify-end">
              <button onClick={() => { setDetailModalOpen(false); navigate(`/useredit/${selectedDetailUser._id}`); }}
                className="px-6 py-3 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] font-bold flex items-center gap-2">
                <FiEdit /> Edit
              </button>
              <button onClick={() => { setDetailModalOpen(false); openMessageModal(selectedDetailUser); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold flex items-center gap-2">
                <FiMessageSquare /> Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



// ══════════════════════════════════════════════════════════════════════════════
// USER EDIT  — expanded with all schema fields
// ══════════════════════════════════════════════════════════════════════════════
export const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [userData, setUserData] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [selectedDuesYear, setSelectedDuesYear] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    // Basic
    fullname: '', email: '', phone: '', address: '',
    // Role / flags
    role: 'prospect', position: '', staffId: '', pensionId: '',
    signupApproved: false, signupDisapproved: false, isVerified: false,
    // Retirement
    dateOfRetirement: '', companyAtRetirement: '', locationOfRetirement: '',
    departmentOfRetirement: '',
    // Spouse
    spouse: '', spousePhone: '',
    // Next of kin
    nextOfKin: '', nextOfKinEmail: '', nextOfKinPhone: '',
    // Beneficiary
    beneficiary: '', beneficiaryEmail: '', beneficiaryPhone: '',
    // Payment
    registration: { payment: false, amount: 0, dueDate: '' },
    dues: {},
  });

  const currentYear = useMemo(() => new Date().getFullYear().toString(), []);
  const availableYears = useMemo(() => {
    const start = 2022;
    const end = new Date().getFullYear() + 2;
    return Array.from({ length: end - start }, (_, i) => (start + i).toString());
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/finduser/${id}`);
        setUserData(res.data.user || res.data);
      } catch (err) {
        setError('Failed to load user data');
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!userData || initialized) return;

    let duesData = { ...(userData.dues || {}) };
    availableYears.forEach((year) => {
      if (!duesData[year]) duesData[year] = { payment: false, amount: 0, dueDate: '' };
    });

    setFormData({
      fullname: userData.fullname || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      role: userData.role || 'prospect',
      position: userData.position || '',
      staffId: userData.staffId || '',
      pensionId: userData.pensionId || '',
      signupApproved: !!userData.signupApproved,
      signupDisapproved: !!userData.signupDisapproved,
      isVerified: !!userData.isVerified,
      dateOfRetirement: userData.dateOfRetirement ? new Date(userData.dateOfRetirement).toISOString().split('T')[0] : '',
      companyAtRetirement: userData.companyAtRetirement || '',
      locationOfRetirement: userData.locationOfRetirement || '',
      departmentOfRetirement: userData.departmentOfRetirement || '',
      spouse: userData.spouse || '',
      spousePhone: userData.spousePhone || '',
      nextOfKin: userData.nextOfKin || '',
      nextOfKinEmail: userData.nextOfKinEmail || '',
      nextOfKinPhone: userData.nextOfKinPhone || '',
      beneficiary: userData.beneficiary || '',
      beneficiaryEmail: userData.beneficiaryEmail || '',
      beneficiaryPhone: userData.beneficiaryPhone || '',
      registration: userData.registration || { payment: false, amount: 0, dueDate: '' },
      dues: duesData,
    });

    const yearsWithData = Object.keys(duesData).filter(y => duesData[y].payment || Number(duesData[y].amount) > 0);
    setSelectedDuesYear(yearsWithData.length > 0 ? Math.max(...yearsWithData.map(Number)).toString() : currentYear);
    setInitialized(true);
  }, [userData, availableYears, currentYear, initialized]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('dues.')) {
      const [, year, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        dues: {
          ...prev.dues,
          [year]: {
            ...prev.dues[year],
            [field]: type === 'checkbox' ? checked : field === 'amount' ? Number(value) || 0 : value,
          },
        },
      }));
    } else if (name.startsWith('registration.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        registration: {
          ...prev.registration,
          [field]: type === 'checkbox' ? checked : field === 'amount' ? Number(value) || 0 : value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Save changes?')) return;
    try {
      await axios.put('https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/updateuser/', { id, ...formData, isAdmin: true });
      setSuccessMsg('User updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const addNewDuesYear = () => {
    const maxYear = Math.max(...Object.keys(formData.dues).map(Number));
    const newYear = (maxYear + 1).toString();
    if (!formData.dues[newYear]) {
      setFormData(prev => ({ ...prev, dues: { ...prev.dues, [newYear]: { payment: false, amount: 0, dueDate: '' } } }));
      setSelectedDuesYear(newYear);
    }
  };

  const removeDuesYear = (year) => {
    if (!window.confirm(`Remove dues for ${year}?`)) return;
    setFormData(prev => { const d = { ...prev.dues }; delete d[year]; return { ...prev, dues: d }; });
    if (selectedDuesYear === year) {
      const remaining = Object.keys(formData.dues).filter(y => y !== year);
      setSelectedDuesYear(remaining.length > 0 ? Math.max(...remaining.map(Number)).toString() : currentYear);
    }
  };

  if (loading) return <div className="text-center py-20 text-2xl text-[#001F5B]">Loading user data...</div>;
  if (error) return <div className="text-center py-20 text-2xl text-red-600">{error}</div>;

  const tabs = [
    { key: 'basic', label: 'Personal' },
    { key: 'retirement', label: 'Retirement' },
    { key: 'family', label: 'Family' },
    { key: 'account', label: 'Account' },
    { key: 'dues', label: 'Dues' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-[#E30613] hover:text-[#c20511] font-semibold mb-6 transition">
          <FiArrowLeft /> Back to Users
        </button>

        {successMsg && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">{successMsg}</div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">{error}</div>}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-t-8 border-[#E30613]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">{formData.fullname || 'User Profile'}</h1>
            <p className="opacity-80 mt-1">{formData.role?.toUpperCase()}</p>
            {formData.staffId && <p className="text-xs opacity-60 mt-1">Staff ID: {formData.staffId}</p>}
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition border-b-2 -mb-px
                  ${activeTab === t.key ? 'border-[#E30613] text-[#E30613] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">

            {/* ── TAB: Personal ── */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#001F5B] border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', name: 'fullname' },
                    { label: 'Email', name: 'email', type: 'email' },
                    { label: 'Phone', name: 'phone' },
                    { label: 'Address', name: 'address' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                      <input type={f.type || 'text'} name={f.name} value={formData[f.name] || ''} onChange={handleChange} className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB: Retirement ── */}
            {activeTab === 'retirement' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#001F5B] border-b pb-2">Retirement Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                    <input name="staffId" value={formData.staffId || ''} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pension ID</label>
                    <input name="pensionId" value={formData.pensionId || ''} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position / Title</label>
                    <input name="position" value={formData.position || ''} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Retirement</label>
                    <input type="date" name="dateOfRetirement" value={formData.dateOfRetirement || ''} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company at Retirement</label>
                    <select name="companyAtRetirement" value={formData.companyAtRetirement || ''} onChange={handleChange} className={selectCls}>
                      <option value="">Select</option>
                      <option value="MPN">MPN</option>
                      <option value="EEPNL">EEPNL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location of Retirement</label>
                    <select name="locationOfRetirement" value={formData.locationOfRetirement || ''} onChange={handleChange} className={selectCls}>
                      <option value="">Select</option>
                      {['Lagos','QIT/Eket','Port Harcourt/Onne','Bonny','USA','Europe','Asia'].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department of Retirement</label>
                    <input name="departmentOfRetirement" value={formData.departmentOfRetirement || ''} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Family (Spouse / NOK / Beneficiary) ── */}
            {activeTab === 'family' && (
              <div className="space-y-8">
                {/* Spouse */}
                <div>
                  <h3 className="text-lg font-bold text-[#001F5B] border-b pb-2 mb-4">Spouse</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Full Name</label>
                      <input name="spouse" value={formData.spouse || ''} onChange={handleChange} placeholder="None if not applicable" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Phone</label>
                      <input name="spousePhone" value={formData.spousePhone || ''} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* Next of Kin */}
                <div>
                  <h3 className="text-lg font-bold text-[#001F5B] border-b pb-2 mb-4">Next of Kin</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input name="nextOfKin" value={formData.nextOfKin || ''} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="nextOfKinEmail" value={formData.nextOfKinEmail || ''} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input name="nextOfKinPhone" value={formData.nextOfKinPhone || ''} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* Beneficiary */}
                <div>
                  <h3 className="text-lg font-bold text-[#001F5B] border-b pb-2 mb-4">Beneficiary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input name="beneficiary" value={formData.beneficiary || ''} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="beneficiaryEmail" value={formData.beneficiaryEmail || ''} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input name="beneficiaryPhone" value={formData.beneficiaryPhone || ''} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Account ── */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#001F5B] border-b pb-2">Account & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className={selectCls}>
                      <option value="prospect">Prospect</option>
                      <option value="prospectiveMember">Prospective Member</option>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {[
                    { label: 'Signup Approved', name: 'signupApproved' },
                    { label: 'Signup Disapproved', name: 'signupDisapproved' },
                    { label: 'Is Verified', name: 'isVerified' },
                  ].map(f => (
                    <div key={f.name} className="flex items-center gap-3 pt-6">
                      <input type="checkbox" checked={!!formData[f.name]} onChange={handleChange} name={f.name}
                        className="w-5 h-5 accent-[#E30613]" />
                      <label className="text-sm font-medium text-gray-700">{f.label}</label>
                    </div>
                  ))}
                </div>

                {/* Registration fee */}
                <div className="border-t pt-6">
                  <h4 className="text-base font-bold text-[#001F5B] mb-4">Registration Fee</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={!!formData.registration.payment} onChange={handleChange}
                        name="registration.payment" className="w-5 h-5 accent-[#E30613]" />
                      <label className="text-sm font-medium">Paid Registration</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                      <input type="number" name="registration.amount" value={formData.registration.amount || ''}
                        onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Due Date</label>
                      <input type="date" name="registration.dueDate" value={formData.registration.dueDate || ''}
                        onChange={handleChange} className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Dues ── */}
            {activeTab === 'dues' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#001F5B]">Annual Dues</h3>
                  <button type="button" onClick={addNewDuesYear}
                    className="px-5 py-2 bg-[#001F5B] text-white rounded-lg hover:bg-[#0A3D6B] text-sm font-medium">
                    + Add Year
                  </button>
                </div>

                <select value={selectedDuesYear} onChange={(e) => setSelectedDuesYear(e.target.value)}
                  className="w-full sm:w-56 px-4 py-3 border border-gray-300 rounded-lg">
                  <option value="">Select Year</option>
                  {Object.keys(formData.dues).sort().map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                {selectedDuesYear && formData.dues[selectedDuesYear] && (
                  <div className="bg-gray-50 p-5 rounded-xl relative">
                    <button type="button" onClick={() => removeDuesYear(selectedDuesYear)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={formData.dues[selectedDuesYear].payment || false}
                          onChange={handleChange} name={`dues.${selectedDuesYear}.payment`}
                          className="w-5 h-5 accent-[#E30613]" />
                        <label className="font-medium">Paid for {selectedDuesYear}</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                        <input type="number" name={`dues.${selectedDuesYear}.amount`}
                          value={formData.dues[selectedDuesYear].amount || ''} onChange={handleChange}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Due Date</label>
                        <input type="date" name={`dues.${selectedDuesYear}.dueDate`}
                          value={formData.dues[selectedDuesYear].dueDate || ''} onChange={handleChange}
                          className={inputCls} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded-xl overflow-hidden">
                    <thead className="bg-[#001F5B] text-white">
                      <tr>
                        <th className="px-4 py-2 text-left">Year</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(formData.dues).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, data], i) => (
                        <tr key={year} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 font-medium">{year}</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${data.payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {data.payment ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">₦{(data.amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
              <button type="button" onClick={() => navigate('/admin/users')}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-medium">
                Cancel
              </button>
              <button type="submit"
                className="px-8 py-3 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] font-bold flex items-center gap-2 shadow-md">
                <FiSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



  
        
      


            
                        



export const FindUser = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('name'); // name, email, phone
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Message modal states
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  // Detail modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);

   useEffect(() => {
      const admin= JSON.parse(localStorage.getItem("adminData"))
      const adminToken= JSON.parse(localStorage.getItem("adminToken"))
      if (!admin && !adminToken) {
        navigate('/');
        return;
      }
    }, [navigate]);
// Handle search - FIXED with correct backend route
const handleSearch = async (e) => {
  e.preventDefault();

  if (!searchQuery.trim()) {
    setError('Please enter a search term');
    return;
  }

  setLoading(true);
  setError(null);
  setResults([]);

  try {
    // FIXED: Correct endpoint + proper query param format
    const res = await axios.get(
  `https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/findusername?type=${searchType}&query=${encodeURIComponent(searchQuery.trim())}`
);

    // Handle both possible response shapes
    setResults(res.data.users || res.data || []);
  } catch (err) {
    // Better error message
    const errMsg = err.response?.data?.message || err.message || 'Failed to search users';
    setError(errMsg);
    console.error('Search error:', err);
  } finally {
    setLoading(false);
  }
};
  // Delete user
 const handleDelete = async (id) => {
  if (!window.confirm('Delete this user permanently? This cannot be undone.')) return;

  try {
    // Fix 1: Add trailing slash to URL
    const url = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/deleteuser/';

    // Fix 2: Send body correctly in config.data
     await axios.delete(url, { data: { id } }); // Note: { data: { id } }

    // Update state and localStorage
    setResults(prev => {
      const newUsers = prev.filter(u => u._id !== id);
      localStorage.setItem('users', JSON.stringify(newUsers)); // Update LS after filter
      return newUsers;
    });

    alert('User deleted successfully');
  } catch (err) {
    // Better error handling: Log full response for debugging
    console.error('Delete error:', err.response ? err.response.data : err.message);
    alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
  }
};
const now = new Date();
const currentYear = now.getFullYear().toString();
  // Message modal
  const openMessageModal = (user) => {
    setSelectedUser(user);
    setMessageText('');
    setMessageModalOpen(true);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    alert(`Message sent to ${selectedUser.fullname}: "${messageText}"`);
    setMessageModalOpen(false);
    setMessageText('');
    // Real endpoint later: axios.post('/api/admin/messages', { to: selectedUser._id, text: messageText });
  };

  // Detail modal
  const openDetailModal = (user) => {
    setSelectedDetailUser(user);
    setDetailModalOpen(true);
  };

  // New function: Resend Payment Email via POST to backend
const resendPaymentEmail = async (user) => {
  try {
    const response = await axios.post(
      'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/resendpaymentemail',
      { id: user._id }
    );
    alert(response.data.message || 'Email resent successfully!');
  } catch (err) {
    console.error('Resend error:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Failed to resend email');
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
            Find a User
          </h1>
          <p className="text-xl text-gray-600">
            Search members by name, email, or phone number
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className=" max-lg:hidden bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="name"
                checked={searchType === 'name'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-5 h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-lg font-medium text-gray-700">By Name</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="email"
                checked={searchType === 'email'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-5 h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-lg font-medium text-gray-700">By Email</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="phone"
                checked={searchType === 'phone'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-5 h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-lg font-medium text-gray-700">By Phone</span>
            </label>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'name' ? 'Enter full name...' :
                searchType === 'email' ? 'Enter email position...' :
                'Enter phone number...'
              }
              className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition font-bold flex items-center gap-3"
            >
              <FiSearch /> Search
            </button>
          </div>
        </form>
       <form onSubmit={handleSearch} className="hidden max-lg:block bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-12">
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 justify-center">
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="name"
                checked={searchType === 'name'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-base sm:text-lg font-medium text-gray-700">By Name</span>
            </label>

            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="email"
                checked={searchType === 'email'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-base sm:text-lg font-medium text-gray-700">By Email</span>
            </label>

            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="phone"
                checked={searchType === 'phone'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
              />
              <span className="text-base sm:text-lg font-medium text-gray-700">By Phone</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'name' ? 'Enter full name...' :
                searchType === 'email' ? 'Enter email...' :
                'Enter phone number...'
              }
              className="flex-1 px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 sm:px-10 sm:py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition font-bold flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <FiSearch /> Search
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16 text-2xl text-[#001F5B] animate-pulse">
            Searching...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-2xl text-red-600">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 text-xl text-gray-500">
            No users found matching your search
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                  <tr>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Name</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
                    <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
                    <th className="px-6 py-5 text-center text-lg font-semibold">Dues/({currentYear})</th>
                    <th className="px-6 py-5 text-center text-lg font-semibold">Registration</th>
                    <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map(user => (
                    <tr
                      key={user._id}
                      onClick={() => openDetailModal(user)}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
                        {user.fullname}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-gray-600">
                        {user.phone || 'N/A'}
                      </td>
                      {/* <td className="px-6 py-6 whitespace-nowrap text-center">
  {(() => {
    const duesEntries = user.dues
      ? Object.entries(user.dues)
      : [];

    if (!duesEntries.length) {
      return (
        <span className="inline-flex px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
          No Dues
        </span>
      );
    }

    // Sort by year ascending
    const sorted = duesEntries.sort(
      (a, b) => Number(a[0]) - Number(b[0])
    );

    const [lastYear, lastDues] = sorted[sorted.length - 1];

    return (
      <span
        className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
          lastDues.payment
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {lastYear} — {lastDues.payment ? 'Paid' : 'Unpaid'}
      </span>
    );
  })()}
</td> */}
{/* DUES STATUS COLUMN - FIXED TO ALWAYS SHOW 2026 DUES */}
<td className="px-6 py-6 whitespace-nowrap text-center">
  {(() => {
    const dues = user.dues || {};

    // Force check for year 2026 only
    const yearToCheck = "2026";
    const dues2026 = dues[yearToCheck];

    if (!dues2026) {
      return (
        <span className="inline-flex px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
          2026 — No Record
        </span>
      );
    }

    return (
      <span
        className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
          dues2026.payment
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        2026 — {dues2026.payment ? 'Paid' : 'Unpaid'}
      </span>
    );
  })()}
</td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                          user.registration.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.registration.payment ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-6">
                          <button
                            onClick={(e) => { e.stopPropagation(); openMessageModal(user); }}
                            className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
                            title="Send Message"
                          >
                            <FiMessageSquare className="text-3xl" />
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/useredit/${user._id}`); }}
                            className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
                            title="Edit User"
                          >
                            <FiEdit className="text-3xl" />
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
                            title="Delete User"
                          >
                            <FiTrash2 className="text-3xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModalOpen && selectedUser && (
          <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={() => setMessageModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FiUser className="text-4xl" />
                  <div>
                    <h2 className="text-2xl font-bold">Message to {selectedUser.fullname}</h2>
                    <p className="text-sm opacity-90">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setMessageModalOpen(false)} className="text-white hover:text-[#E30613] text-3xl">
                  <FiX />
                </button>
              </div>

              <div className="p-8 flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows="8"
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
                />
              </div>

              <div className="bg-gray-50 px-8 py-6 border-t flex justify-end">
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className={`px-10 py-4 rounded-xl font-bold transition ${
                    messageText.trim() ? 'bg-[#E30613] text-white hover:bg-[#c20511]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiSend className="inline mr-2" /> Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {/* {detailModalOpen && selectedDetailUser && (
          <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={() => setDetailModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001F5B]">
                  User Details: {selectedDetailUser.fullname}
                </h2>
                <button onClick={() => setDetailModalOpen(false)} className="text-3xl text-gray-600 hover:text-[#E30613]">
                  <FiX />
                </button>
              </div>

              <div className="space-y-6 text-lg">
                <div>
                  <strong className="text-gray-700">Email:</strong> {selectedDetailUser.email}
                </div>
                <div>
                  <strong className="text-gray-700">Phone:</strong> {selectedDetailUser.phone || 'N/A'}
                </div>
                <div>
                  <strong className="text-gray-700">Dues Paid:</strong>{' '}
                  <span className={selectedDetailUser.duesPaid ? 'text-green-600' : 'text-red-600'}>
                    {selectedDetailUser.duesPaid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Subscription Active:</strong>{' '}
                  <span className={selectedDetailUser.subscriptionPaid ? 'text-green-600' : 'text-red-600'}>
                    {selectedDetailUser.subscriptionPaid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Role:</strong> {selectedDetailUser.role || 'Unknown'}
                </div>
                <div>
                  <strong className="text-gray-700">Joined:</strong>{' '}
                  {new Date(selectedDetailUser.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>

              <div className="max-lg:hidden mt-10 flex justify-end gap-6">
                <button
                  onClick={() => resendPaymentEmail(selectedDetailUser)}
                  className="px-4 py-2 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition"
                >
                  Send Payment Email
                </button>
                <button
                  onClick={() => navigate(`/useredit/${selectedDetailUser._id}`)}
                  className="px-8 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openMessageModal(selectedDetailUser);
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </div>
              <div className="hidden max-lg:flex flex-col sm:flex-row mt-8 
                justify-end gap-3 sm:gap-4 w-full">

  <button
    onClick={() => resendPaymentEmail(selectedDetailUser)}
    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base
               bg-[#E30613] text-white rounded-lg 
               hover:bg-[#c20511] transition"
  >
    Send Payment Email
  </button>

  <button
    onClick={() => navigate(`/useredit/${selectedDetailUser._id}`)}
    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base
               bg-[#E30613] text-white rounded-lg 
               hover:bg-[#c20511] transition"
  >
    Edit Profile
  </button>

  <button
    onClick={() => {
      setDetailModalOpen(false);
      openMessageModal(selectedDetailUser);
    }}
    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base
               bg-blue-600 text-white rounded-lg 
               hover:bg-blue-700 transition"
  >
    Send Message
  </button>

</div>
            </div>
          </div>
        )} */}
        {/* User Detail Modal */}
{detailModalOpen && selectedDetailUser && (
  <div 
    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
    onClick={() => setDetailModalOpen(false)}
  >
    <div 
      className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#001F5B]">
          User Details: {selectedDetailUser.fullname}
        </h2>
        <button 
          onClick={() => setDetailModalOpen(false)} 
          className="text-3xl text-gray-600 hover:text-[#E30613]"
        >
          <FiX />
        </button>
      </div>

      <div className="space-y-6 text-lg">

        <div>
          <strong className="text-gray-700">Email:</strong>{' '}
          {selectedDetailUser.email}
        </div>

        <div>
          <strong className="text-gray-700">Phone:</strong>{' '}
          {selectedDetailUser.phone || 'N/A'}
        </div>

        <div>
          <strong className="text-gray-700">Role:</strong>{' '}
          {selectedDetailUser.role || 'Unknown'}
        </div>

        <div>
          <strong className="text-gray-700">Joined:</strong>{' '}
          {selectedDetailUser.createdAt
            ? new Date(selectedDetailUser.createdAt).toLocaleDateString('en-GB')
            : 'N/A'}
        </div>

        {/* REGISTRATION STATUS */}
        <div>
          <strong className="text-gray-700">Registration Paid:</strong>{' '}
          <span
            className={
              selectedDetailUser.registration?.payment
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {selectedDetailUser.registration?.payment ? 'Yes' : 'No'}
          </span>
          {selectedDetailUser.registration?.amount > 0 && (
            <span className="ml-2 text-gray-600">
              (₦{selectedDetailUser.registration.amount})
            </span>
          )}
        </div>

        {/* DUES SECTION */}
        <div>
          <strong className="text-gray-700">Annual Dues:</strong>

          {selectedDetailUser.dues &&
          Object.keys(selectedDetailUser.dues).length > 0 ? (
            <div className="mt-3 space-y-2">
              {Object.entries(selectedDetailUser.dues)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([year, data]) => (
                  <div
                    key={year}
                    className="flex justify-between border rounded-lg px-4 py-2"
                  >
                    <span>{year}</span>
                    <span
                      className={
                        data?.payment
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {data?.payment ? 'Paid' : 'Unpaid'}
                      {data?.amount > 0 && (
                        <span className="ml-2 text-gray-500">
                          (₦{data.amount})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="mt-2 text-gray-500">No dues records found.</div>
          )}
        </div>

      </div>

      {/* DESKTOP BUTTONS */}
      <div className="max-lg:hidden mt-10 flex justify-end gap-6">
        <button
          onClick={() => resendPaymentEmail(selectedDetailUser)}
          className="px-4 py-2 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition"
        >
          Send Payment Email
        </button>

        <button
          onClick={() => navigate(`/useredit/${selectedDetailUser._id}`)}
          className="px-8 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition"
        >
          Edit Profile
        </button>

        <button
          onClick={() => {
            setDetailModalOpen(false);
            openMessageModal(selectedDetailUser);
          }}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </div>

      {/* MOBILE BUTTONS */}
      <div className="hidden max-lg:flex flex-col sm:flex-row mt-8 justify-end gap-3 sm:gap-4 w-full">

        <button
          onClick={() => resendPaymentEmail(selectedDetailUser)}
          className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base
                     bg-[#E30613] text-white rounded-lg 
                     hover:bg-[#c20511] transition"
        >
          Send Payment Email
        </button>

        <button
          onClick={() => navigate(`/useredit/${selectedDetailUser._id}`)}
          className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base
                     bg-[#E30613] text-white rounded-lg 
                     hover:bg-[#c20511] transition"
        >
          Edit Profile
        </button>

        <button
          onClick={() => {
            setDetailModalOpen(false);
            openMessageModal(selectedDetailUser);
          }}
          className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base
                     bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition"
        >
          Send Message
        </button>

      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
};


// export const DuesStatus = () => {
//   const navigate = useNavigate();
//   const [duesStatus, setDuesStatus] = useState('paid'); // 'paid' or 'unpaid'
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Message modal states
//   const [messageModalOpen, setMessageModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messageText, setMessageText] = useState('');

//   // Detail modal states
//   const [detailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedDetailUser, setSelectedDetailUser] = useState(null);

//    useEffect(() => {
//       const admin= JSON.parse(localStorage.getItem("adminData"))
//       const adminToken= JSON.parse(localStorage.getItem("adminToken"))
//       if (!admin && !adminToken) {
//         navigate('/');
//         return;
//       }
//     }, [navigate]);
//   // Fetch users by dues status
//   useEffect(() => {
//     const fetchUsersByDues = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const paidParam = duesStatus === 'paid' ? 'true' : 'false';
//         const res = await axios.get(
//           `https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/finduserdues?paid=${paidParam}`
//         );

//         setFilteredUsers(res.data.users || res.data || []);
//       } catch (err) {
//         setError('Failed to load users by dues status');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsersByDues();
//   }, [duesStatus]);

//   // Delete user
//  const handleDelete = async (id) => {
//   if (!window.confirm('Delete this user permanently? This cannot be undone.')) return;

//   try {
//     // Fix 1: Add trailing slash to URL
//     const url = 'https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/deleteuser/';

//     // Fix 2: Send body correctly in config.data
//      await axios.delete(url, { data: { id } }); // Note: { data: { id } }

//     // Update state and localStorage
//     setFilteredUsers(prev => {
//       const newUsers = prev.filter(u => u._id !== id);
//       localStorage.setItem('users', JSON.stringify(newUsers)); // Update LS after filter
//       return newUsers;
//     });

//     alert('User deleted successfully');
//   } catch (err) {
//     // Better error handling: Log full response for debugging
//     console.error('Delete error:', err.response ? err.response.data : err.message);
//     alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
//   }
// };

//   // Message modal
//   const openMessageModal = (user) => {
//     setSelectedUser(user);
//     setMessageText('');
//     setMessageModalOpen(true);
//   };

//   const sendMessage = () => {
//     if (!messageText.trim()) return;
//     alert(`Message sent to ${selectedUser.fullname}`);
//     setMessageModalOpen(false);
//     setMessageText('');
//     // Real API later: axios.post('/api/admin/messages', { to: selectedUser._id, text: messageText });
//   };

//   // Detail modal
//   const openDetailModal = (user) => {
//     setSelectedDetailUser(user);
//     setDetailModalOpen(true);
//   };

//   // Download PDF (fixed syntax)
//   const downloadPDF = (status) => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.setFont('helvetica', 'bold');
//     doc.text(`EMRAN ${status === 'paid' ? 'Paid' : 'Unpaid'} Dues Members`, 20, 20);

//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 20, 30);

//     const tableColumn = ["Name", "Email", "Phone", "Dues Paid", "Joined"];
//     const tableRows = filteredUsers.map(user => [
//       user.fullname,
//       user.email,
//       user.phone || 'N/A',
//       user.duesPaid ? 'Yes' : 'No',
//       new Date(user.createdAt).toLocaleDateString('en-GB'),
//     ]);

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 45,
//       theme: 'grid',
//       headStyles: {
//         fillColor: [0, 31, 91], // #001F5B
//         textColor: [255, 255, 255],
//         fontStyle: 'bold',
//       },
//       styles: {
//         fontSize: 10,
//         cellPadding: 6,
//         overflow: 'linebreak',
//       },
//       columnStyles: {
//         0: { cellWidth: 45 },
//         1: { cellWidth: 55 },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 25 },
//         4: { cellWidth: 30 },
//       },
//       margin: { top: 45, left: 15, right: 15 },
//     });

//     doc.save(`${status === 'paid' ? 'Paid' : 'Unpaid'}_Dues_Members_${new Date().toISOString().slice(0,10)}.pdf`);
//   };


//   //Downoad Excel File
// const downloadExcel = (status) => {
//   // Prepare data (same as your PDF logic)
//   const data = filteredUsers.map(user => ({
//     Name: user.fullname,
//     Email: user.email,
//     Phone: user.phone || 'N/A',
//     "Dues Paid": user.duesPaid ? 'Yes' : 'No',
//     Joined: new Date(user.createdAt).toLocaleDateString('en-GB'),
//   }));

//   // Create worksheet
//   const worksheet = XLSX.utils.json_to_sheet(data);
  
//   // Create workbook
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Dues List");

//   // Generate and download file
//   const fileName = `${status === 'paid' ? 'Paid' : 'Unpaid'}_Dues_Members_${new Date().toISOString().slice(0,10)}.xlsx`;
//   XLSX.writeFile(workbook, fileName);
// };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
//             Dues Status
//           </h1>
//           <p className="text-xl text-gray-600">
//             View members by dues payment status
//           </p>
//         </div>

//         {/* Filter Checkboxes */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
//           <div className="flex flex-col md:flex-row gap-8 justify-center">
//             <label className="flex items-center gap-4 cursor-pointer">
//               <input
//                 type="radio"
//                 name="duesStatus"
//                 value="paid"
//                 checked={duesStatus === 'paid'}
//                 onChange={() => setDuesStatus('paid')}
//                 className="w-6 h-6 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
//               />
//               <span className="text-xl font-medium text-gray-700">Dues Paid</span>
//             </label>

//             <label className="flex items-center gap-4 cursor-pointer">
//               <input
//                 type="radio"
//                 name="duesStatus"
//                 value="unpaid"
//                 checked={duesStatus === 'unpaid'}
//                 onChange={() => setDuesStatus('unpaid')}
//                 className="w-6 h-6 text-[#E30613] border-gray-300 rounded focus:ring-[#E30613]"
//               />
//               <span className="text-xl font-medium text-gray-700">Dues Unpaid</span>
//             </label>
//           </div>

//           {/* Download Buttons */}
//           {duesStatus ==='paid' ?
//            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
//   <button
//     onClick={() => downloadPDF('paid')}
//     className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold"
//   >
//     <FiDownload /> Download Paid (PDF)
//   </button>
//   <button
//     onClick={() => downloadExcel('paid')}
//     className="flex items-center gap-3 px-8 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-bold"
//   >
//     <FiDownload /> Download Paid (Excel)
//   </button>
// </div>
// :
//  <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
//  <button
//     onClick={() => downloadPDF('unpaid')}
//     className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
//   >
//     <FiDownload /> Download Unpaid (PDF)
//   </button>
//   <button
//     onClick={() => downloadExcel('unpaid')}
//     className="flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-bold"
//   >
//     <FiDownload /> Download Unpaid (Excel)
//   </button>
// </div>
//           }
//         </div>

//         {/* Results Table */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <FiLoader className="text-6xl text-[#E30613] animate-spin" />
//             <span className="ml-4 text-2xl text-gray-600">Loading {duesStatus === 'paid' ? 'paid' : 'unpaid'} users...</span>
//           </div>
//         ) : error ? (
//           <div className="text-center py-20 text-2xl text-red-600">{error}</div>
//         ) : filteredUsers.length === 0 ? (
//           <div className="text-center py-20 text-xl text-gray-500">
//             No {duesStatus === 'paid' ? 'paid' : 'unpaid'} dues users found
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
//                   <tr>
//                     <th className="px-6 py-5 text-left text-lg font-semibold">Name</th>
//                     <th className="px-6 py-5 text-left text-lg font-semibold">Email</th>
//                     <th className="px-6 py-5 text-left text-lg font-semibold">Phone</th>
//                     <th className="px-6 py-5 text-center text-lg font-semibold">Dues</th>
//                     <th className="px-6 py-5 text-center text-lg font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredUsers.map(user => (
//                     <tr
//                       key={user._id}
//                       onClick={() => openDetailModal(user)}
//                       className="hover:bg-gray-50 transition cursor-pointer"
//                     >
//                       <td className="px-6 py-6 whitespace-nowrap font-medium text-gray-900">
//                         {user.fullname}
//                       </td>
//                       <td className="px-6 py-6 whitespace-nowrap text-gray-600">
//                         {user.email}
//                       </td>
//                       <td className="px-6 py-6 whitespace-nowrap text-gray-600">
//                         {user.phone || 'N/A'}
//                       </td>
//                       <td className="px-6 py-6 whitespace-nowrap text-center">
//                         <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
//                           user.duesPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {user.duesPaid ? 'Paid' : 'Unpaid'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-6 whitespace-nowrap text-center">
//                         <div className="flex justify-center gap-6">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openMessageModal(user);
//                             }}
//                             className="text-blue-600 hover:text-blue-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-blue-50"
//                             title="Send Message"
//                           >
//                             <FiMessageSquare className="text-3xl" />
//                           </button>

//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/useredit/${user._id}`);
//                             }}
//                             className="text-green-600 hover:text-green-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-green-50"
//                             title="Edit User"
//                           >
//                             <FiEdit className="text-3xl" />
//                           </button>

//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete(user._id);
//                             }}
//                             className="text-red-600 hover:text-red-800 transition transform hover:scale-125 p-2 rounded-full hover:bg-red-50"
//                             title="Delete User"
//                           >
//                             <FiTrash2 className="text-3xl" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Message Modal */}
//         {messageModalOpen && selectedUser && (
//           <div 
//             className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
//             onClick={() => setMessageModalOpen(false)}
//           >
//             <div 
//               className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white px-8 py-6 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <FiUser className="text-4xl" />
//                   <div>
//                     <h2 className="text-2xl font-bold">Message to {selectedUser.fullname}</h2>
//                     <p className="text-sm opacity-90">{selectedUser.email}</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setMessageModalOpen(false)} className="text-white hover:text-[#E30613] text-3xl">
//                   <FiX />
//                 </button>
//               </div>

//               <div className="p-8 flex-1">
//                 <textarea
//                   value={messageText}
//                   onChange={(e) => setMessageText(e.target.value)}
//                   placeholder="Type your message here..."
//                   rows="8"
//                   className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/30 transition resize-none"
//                 />
//               </div>

//               <div className="bg-gray-50 px-8 py-6 border-t flex justify-end">
//                 <button
//                   onClick={sendMessage}
//                   disabled={!messageText.trim()}
//                   className={`px-10 py-4 rounded-xl font-bold transition ${
//                     messageText.trim() ? 'bg-[#E30613] text-white hover:bg-[#c20511]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                 >
//                   <FiSend className="inline mr-2" /> Send
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* User Detail Modal */}
//         {detailModalOpen && selectedDetailUser && (
//           <div 
//             className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
//             onClick={() => setDetailModalOpen(false)}
//           >
//             <div 
//               className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-[#001F5B]">
//                   User Details: {selectedDetailUser.fullname}
//                 </h2>
//                 <button onClick={() => setDetailModalOpen(false)} className="text-3xl text-gray-600 hover:text-[#E30613]">
//                   <FiX />
//                 </button>
//               </div>

//               <div className="space-y-6 text-lg">
//                 <div>
//                   <strong className="text-gray-700">Email:</strong> {selectedDetailUser.email}
//                 </div>
//                 <div>
//                   <strong className="text-gray-700">Phone:</strong> {selectedDetailUser.phone || 'N/A'}
//                 </div>
//                 <div>
//                   <strong className="text-gray-700">Dues Paid:</strong>{' '}
//                   <span className={selectedDetailUser.duesPaid ? 'text-green-600' : 'text-red-600'}>
//                     {selectedDetailUser.duesPaid ? 'Yes' : 'No'}
//                   </span>
//                 </div>
//                 <div>
//                   <strong className="text-gray-700">Subscription Active:</strong>{' '}
//                   <span className={selectedDetailUser.subscriptionPaid ? 'text-green-600' : 'text-red-600'}>
//                     {selectedDetailUser.subscriptionPaid ? 'Yes' : 'No'}
//                   </span>
//                 </div>
//                 <div>
//                   <strong className="text-gray-700">Role:</strong> {selectedDetailUser.role || 'Unknown'}
//                 </div>
//                 <div>
//                   <strong className="text-gray-700">Joined:</strong>{' '}
//                   {new Date(selectedDetailUser.createdAt).toLocaleDateString('en-GB')}
//                 </div>
//               </div>

//               <div className="mt-10 flex justify-end gap-6">
//                 <button
//                   onClick={() => navigate(`/useredit/${selectedDetailUser._id}`)}
//                   className="px-8 py-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c20511] transition"
//                 >
//                   Edit Profile
//                 </button>
//                 <button
//                   onClick={() => {
//                     setDetailModalOpen(false);
//                     openMessageModal(selectedDetailUser);
//                   }}
//                   className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
//                 >
//                   Send Message
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// ══════════════════════════════════════════════════════════════════════════════
// DUES STATUS — with year selector + Excel download by status
// ═════════════════════════════════════════════════════════════════════════════
                      
export const DuesStatus = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [duesStatus, setDuesStatus] = useState('paid');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminData'));
    const adminToken = JSON.parse(localStorage.getItem('adminToken'));
    if (!admin && !adminToken) { navigate('/'); return; }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://campusbuy-backend-nkmx.onrender.com/mobilcreateadmin/finduserdues`,
          { params: { paid: duesStatus === 'paid', year: selectedYear } }
        );
        setFilteredUsers(res.data.users || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, [duesStatus, selectedYear]);

  const handleExcel = () => {
    const label = duesStatus === 'paid' ? 'Paid' : 'Unpaid';
    const rows = filteredUsers.map(u => ({
      'Full Name': u.fullname || '',
      'Email': u.email || '',
      'Phone': u.phone || '',
      'Role': u.role || '',
      [`${selectedYear} Dues`]: u.dues?.[selectedYear]?.payment
        ? `Paid (₦${u.dues[selectedYear].amount || 0})`
        : 'Unpaid',
      'Due Date': u.dues?.[selectedYear]?.dueDate
        ? new Date(u.dues[selectedYear].dueDate).toLocaleDateString('en-GB')
        : '',
      'Registration Paid': u.registration?.payment ? 'Yes' : 'No',
      'Date Joined': u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 32 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${label}_Dues_${selectedYear}`);
    XLSX.writeFile(wb, `EMRAN_${label}_Dues_${selectedYear}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#001F5B] mb-3">Dues Status</h1>
          <p className="text-gray-600">Filter and export members by dues payment year</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-center mb-6">
            {/* Year selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Year</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E30613] outline-none text-base">
                {['2023','2024','2025','2026','2027'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Paid / Unpaid toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Status</label>
              <div className="flex rounded-xl overflow-hidden border-2 border-gray-200">
                {['paid','unpaid'].map(s => (
                  <button key={s} type="button" onClick={() => setDuesStatus(s)}
                    className={`px-6 py-3 font-bold text-sm transition capitalize
                      ${duesStatus === s
                        ? s === 'paid' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    {s === 'paid' ? '✓ Paid' : '✗ Unpaid'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Download button */}
          {!loading && filteredUsers.length > 0 && (
            <div className="text-center">
              <button onClick={handleExcel}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-md transition
                  ${duesStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                <FiDownload />
                Download {duesStatus === 'paid' ? 'Paid' : 'Unpaid'} Members — {selectedYear} (Excel)
              </button>
              <p className="text-sm text-gray-500 mt-2">{filteredUsers.length} record(s) found</p>
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-xl text-[#001F5B] animate-pulse">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No {duesStatus} members found for {selectedYear}</div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Phone</th>
                    <th className="px-5 py-4 text-center text-sm font-semibold">Dues {selectedYear}</th>
                    <th className="px-5 py-4 text-center text-sm font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, i) => {
                    const yearDues = user.dues?.[selectedYear];
                    return (
                      <tr key={user._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="px-5 py-4 font-medium text-gray-900">{user.fullname}</td>
                        <td className="px-5 py-4 text-gray-600 text-sm">{user.email}</td>
                        <td className="px-5 py-4 text-gray-600 text-sm">{user.phone || 'N/A'}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${yearDues?.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {yearDues?.payment ? '✓ Paid' : '✗ Unpaid'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">
                          {yearDues?.amount ? `₦${Number(yearDues.amount).toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {filteredUsers.map(user => {
                const yearDues = user.dues?.[selectedYear];
                return (
                  <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-[#001F5B] text-sm">{user.fullname}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${yearDues?.payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {yearDues?.payment ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                    {yearDues?.amount > 0 && (
                      <p className="text-xs font-medium text-gray-700 mt-1">₦{Number(yearDues.amount).toLocaleString()}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
