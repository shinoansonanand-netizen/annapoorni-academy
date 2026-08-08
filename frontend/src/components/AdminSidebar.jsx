import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  LayoutDashboard, Palette, Layout, Navigation, Image as ImageIcon, Search,
  BookOpen, Layers, FileText, HelpCircle, Bell, Share2, PhoneCall, Settings, LogOut, ShieldCheck
} from 'lucide-react';

export const AdminSidebar = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div style={{ background: '#1E3A8A', color: '#fff', padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2>Annapoorni</h2>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Admin Control Center</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
        {/* Dashboard */}
        <div className="admin-nav-group">
          <ul className="admin-menu">
            <li className="admin-menu-item">
              <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Website Section */}
        <div className="admin-nav-group">
          <div className="admin-nav-title">Website System</div>
          <ul className="admin-menu">
            <li className="admin-menu-item">
              <NavLink to="/admin/appearance" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Palette size={18} />
                <span>Appearance</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/homepage" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Layout size={18} />
                <span>Homepage Editor</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/navigation" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Navigation size={18} />
                <span>Navigation</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/media" className={({ isActive }) => (isActive ? 'active' : '')}>
                <ImageIcon size={18} />
                <span>Media Library</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/seo" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Search size={18} />
                <span>SEO Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Content Management */}
        <div className="admin-nav-group">
          <div className="admin-nav-title">Content & Admissions</div>
          <ul className="admin-menu">
            <li className="admin-menu-item">
              <NavLink to="/admin/enrollments" className={({ isActive }) => (isActive ? 'active' : '')}>
                <ShieldCheck size={18} style={{ color: '#059669' }} />
                <span style={{ fontWeight: 700 }}>Student Enrollments</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/courses" className={({ isActive }) => (isActive ? 'active' : '')}>
                <BookOpen size={18} />
                <span>Courses</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/subjects" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Layers size={18} />
                <span>Subjects</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/lessons" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FileText size={18} />
                <span>Lessons</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/quizzes" className={({ isActive }) => (isActive ? 'active' : '')}>
                <HelpCircle size={18} />
                <span>Quizzes</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/announcements" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Bell size={18} />
                <span>Announcements</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Social Media & Contact */}
        <div className="admin-nav-group">
          <div className="admin-nav-title">Settings & Contact</div>
          <ul className="admin-menu">
            <li className="admin-menu-item">
              <NavLink to="/admin/social" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Share2 size={18} />
                <span>Social Media</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <NavLink to="/admin/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                <PhoneCall size={18} />
                <span>Contact Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* System Settings */}
        <div className="admin-nav-group">
          <div className="admin-nav-title">System</div>
          <ul className="admin-menu">
            <li className="admin-menu-item">
              <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
            </li>
            <li className="admin-menu-item">
              <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
