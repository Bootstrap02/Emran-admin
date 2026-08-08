// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import { PendingSignups, } from './Pages/Pending';
import {ConfirmedPayments, AllPayments} from './Pages/Payment';
import NewsEvents from './Pages/NewsEvents';
import Notifications from './Pages/Notifications';
import { CreateAlert, CreateNewsevent, CreateNotification } from './Pages/Createinfo';
import { AllAlerts, AllNewsevents, AllNotifications } from './Pages/Manageinfo';
import { AllUsers, FindUser, UserEdit, DuesStatus } from './Pages/User';
import Firstpage from './Pages/Firstpage';
import AdminActivityLogs from './Pages/AdminActivityLogs';
import Birthdays from './Pages/Birthdays';
import PrivateRoute from './Components/PrivateRoute';
import ElectionAdmin from './Pages/ElectionAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/firstpage" element={<Firstpage />} />
        <Route path="/pending" element={<PendingSignups />} />
        <Route path="/confirmpayment" element={<ConfirmedPayments />} />
        <Route path="/viewpayment" element={<AllPayments />} />
        <Route path="/alerts/:id" element={<CreateAlert />} />
        <Route path="/users" element={<AllUsers />} />
        <Route path="/finduser" element={<FindUser />} />
        <Route path="/sortdues" element={<DuesStatus />} />
        <Route path="/useredit/:id" element={<UserEdit />} />
        <Route path="/allalerts" element={<AllAlerts />} />
        <Route path="/notifications/:id" element={<CreateNotification />} />
        <Route path="/allnotifications" element={<AllNotifications />} />
        <Route path="/newsevents/:id" element={<CreateNewsevent />} />
        <Route path="/allnewsevents" element={<AllNewsevents />} />
<Route path="/admin-activity" element={<PrivateRoute><AdminActivityLogs /></PrivateRoute>} />
        <Route path="/birthdays" element={<PrivateRoute><Birthdays /></PrivateRoute>} />
        <Route path="/news-events" element={<PrivateRoute><NewsEvents /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/elections" element={<PrivateRoute><ElectionAdmin /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
