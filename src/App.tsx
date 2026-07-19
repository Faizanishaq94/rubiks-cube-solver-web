import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import VerifyPage from '@/pages/auth/VerifyPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import JobsPage from '@/pages/dashboard/JobsPage';
import JobDetailPage from '@/pages/dashboard/JobDetailPage';
import SubmitPage from '@/pages/dashboard/SubmitPage';
import AccountPage from '@/pages/dashboard/AccountPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function SessionInit() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionInit />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/submit/rubiks-cube" element={<SubmitPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
