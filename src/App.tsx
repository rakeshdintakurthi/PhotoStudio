import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Lightbox } from '@/components/common/Lightbox';
import { HomePage } from '@/pages/public/HomePage';
import { DiscoverEventsPage } from '@/pages/public/DiscoverEventsPage';
import { CollegeEventsPage } from '@/pages/public/CollegeEventsPage';
import { EventDetailPage } from '@/pages/public/EventDetailPage';
import { PrivateGalleryPage } from '@/pages/public/PrivateGalleryPage';
import { AboutContactPage } from '@/pages/public/AboutContactPage';

import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { CustomerLoginPage } from '@/pages/customer/CustomerLoginPage';
import { CustomerRegisterPage } from '@/pages/customer/CustomerRegisterPage';
import { CustomerAccountPage } from '@/pages/customer/CustomerAccountPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminEventsPage } from '@/pages/admin/AdminEventsPage';
import { AdminCollegesPage } from '@/pages/admin/AdminCollegesPage';
import { AdminUploadPage } from '@/pages/admin/AdminUploadPage';
import { AdminGalleriesPage } from '@/pages/admin/AdminGalleriesPage';
import { AdminPrivateGalleriesPage } from '@/pages/admin/AdminPrivateGalleriesPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { useAuthStore } from '@/store/authStore';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Public Website Layout wrapper with Navbar and Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#171717]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Global Fullscreen Lightbox viewer */}
      <Lightbox />

      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverEventsPage />} />
          <Route path="/colleges" element={<CollegeEventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/private-access" element={<PrivateGalleryPage />} />
          <Route path="/private-access/:slug" element={<PrivateGalleryPage />} />
          <Route path="/about" element={<AboutContactPage />} />
          <Route path="/contact" element={<AboutContactPage />} />

          {/* CUSTOMER AUTHENTICATION & ACCOUNT */}
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />
          <Route path="/account" element={<CustomerAccountPage />} />
        </Route>

        {/* ADMIN AUTHENTICATION */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ADMIN DASHBOARD (PROTECTED) */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="colleges" element={<AdminCollegesPage />} />
          <Route path="upload" element={<AdminUploadPage />} />
          <Route path="galleries" element={<AdminGalleriesPage />} />
          <Route path="private-galleries" element={<AdminPrivateGalleriesPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
