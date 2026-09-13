/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Classes } from './pages/Classes';
import { ClassDetails } from './pages/ClassDetails';
import { AttendanceGateway } from './pages/AttendanceGateway';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Billing } from './pages/Billing';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Teacher Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/classes/:classId" element={<ClassDetails />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing" element={<Billing />} />
            </Route>
          </Route>
          
          {/* Shared / Public Routes */}
          <Route path="/attendance/:sessionId" element={<AttendanceGateway />} />
          <Route path="/classes/:classId/attendance" element={<Navigate to={`/classes/${window.location.pathname.split('/')[2]}`} />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

