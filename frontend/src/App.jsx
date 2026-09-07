import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AppLayout from './components/layout/AppLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetupPasswordPage from './pages/SetupPasswordPage';
import MyReportPage from './pages/MyReportPage';
import ReportHistoryPage from './pages/ReportHistoryPage';
import ReportDetailPage from './pages/ReportDetailPage';
import TeamMemberProfilePage from './pages/TeamMemberProfilePage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import ManagerReviewPage from './pages/ManagerReviewPage';
import DashboardPage from './pages/DashboardPage';
import AccountSettingsPage from './pages/AccountSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route path="/setup-password" element={<SetupPasswordPage />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-report" element={<MyReportPage />} />
              <Route path="/reports-history" element={<ReportHistoryPage />} />
              <Route path="/reports/:id" element={<ReportDetailPage />} />
              <Route path="/settings" element={<AccountSettingsPage />} />

              {/* Manager & Admin Only Routes */}
              <Route element={<RoleRoute roles={['manager', 'admin']} />}>
                <Route path="/manager-review" element={<ManagerReviewPage />} />
                <Route path="/projects" element={<ProjectManagementPage />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/member/:id" element={<TeamMemberProfilePage />} />
              </Route>
            </Route>
          </Route>

          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
