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
    const admin = JSON.parse(localStorage.getItem('adminData') || 'null');
    const adminId = admin?._id || admin?.id || null;
    if (!adminId) return config;

    const method = (config.method || 'get').toLowerCase();

    if (method === 'get') {
      config.params = { ...(config.params || {}), adminId };
    } else if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      // Don't touch FormData — appending adminId here keeps the multipart body intact
      if (!config.data.has('adminId')) {
        config.data.append('adminId', adminId);
      }
    } else {
      if (!config.data || typeof config.data !== 'object') config.data = { adminId };
      else config.data = { ...(config.data || {}), adminId };
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
