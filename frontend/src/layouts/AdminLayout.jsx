import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import '../styles/admin.css';

export const AdminLayout = ({ pageTitle }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
        <p style={{ fontWeight: 600, color: '#475569' }}>Authenticating Admin System...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const getTitleFromPath = () => {
    if (pageTitle) return pageTitle;
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/appearance')) return 'Website Appearance';
    if (path.includes('/homepage')) return 'Homepage Section Editor';
    if (path.includes('/navigation')) return 'Navigation Management';
    if (path.includes('/courses')) return 'Course Management';
    if (path.includes('/subjects')) return 'Subject Management';
    if (path.includes('/lessons')) return 'Lesson & Module Management';
    if (path.includes('/quizzes')) return 'Quiz & Assessment Builder';
    if (path.includes('/announcements')) return 'Announcements & News';
    if (path.includes('/media')) return 'Media Library';
    if (path.includes('/social')) return 'Social Media Links';
    if (path.includes('/contact')) return 'Contact Information';
    if (path.includes('/seo')) return 'SEO Configuration';
    if (path.includes('/settings')) return 'System Settings';
    return 'Admin Panel';
  };

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title={getTitleFromPath()} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
