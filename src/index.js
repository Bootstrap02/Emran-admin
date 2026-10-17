
import React from 'react';
import { createRoot } from 'react-dom/client';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import rootReducer from './Reducers/rootReducer';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 👈 ADD THIS
import axios from 'axios';

// Global axios interceptor to attach adminId to requests (if admin is logged in)
axios.interceptors.request.use((config) => {
  try {
    // Send the admin login token to our backend so protected actions (e.g. confirming payments)
    // can verify WHO is acting. Never sent to other sites.
    if ((config.url || '').includes('campusbuy-backend')) {
      const rawToken = localStorage.getItem('adminToken');
      const adminToken = rawToken ? JSON.parse(rawToken) : null;
      if (adminToken && !(config.headers && config.headers.Authorization)) {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${adminToken}` };
      }
    }
  } catch (err) { /* ignore */ }

  try {
    const admin = JSON.parse(localStorage.getItem('adminData') || 'null');
    const adminId = admin?._id || admin?.id || null;
    if (!adminId) return config;
    const adminName = admin?.fullname || '';

    // The activity-log endpoint uses adminId as a FILTER, so never inject the
    // logged-in admin there (that is what limited "all admins" to just yourself).
    if ((config.url || '').includes('/adminactivitylogs')) return config;

    const method = (config.method || 'get').toLowerCase();

    if (method === 'get') {
      config.params = { adminId, adminName, ...(config.params || {}) };
    } else if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (!config.data.has('adminId')) config.data.append('adminId', adminId);
      if (adminName && !config.data.has('adminName')) config.data.append('adminName', adminName);
    } else {
      if (!config.data || typeof config.data !== 'object') config.data = { adminId, adminName };
      else config.data = { adminId, adminName, ...(config.data || {}) };
    }
  } catch (err) {
    // ignore
  }
  return config;
}, (err) => Promise.reject(err));

const store = createStore(rootReducer);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="666708954692-1mt08bg1dqkp1mig52cpp79dpjpdtj54.apps.googleusercontent.com">   {/* 👈 WRAP HERE */}
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
