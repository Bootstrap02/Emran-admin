import React from 'react';
import { createRoot } from 'react-dom/client';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import rootReducer from './Reducers/rootReducer';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 👈 ADD THIS

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
