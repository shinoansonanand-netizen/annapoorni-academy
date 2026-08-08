import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ExternalLink, User } from 'lucide-react';

export const AdminHeader = ({ title }) => {
  const { admin } = useAdminAuth();

  return (
    <header className="admin-topbar">
      <h1 className="admin-page-title">{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline"
          style={{ fontSize: '0.85rem' }}
        >
          View Public Site <ExternalLink size={14} />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#F8FAFC', padding: '6px 14px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>
            {admin?.username || 'Administrator'}
          </span>
        </div>
      </div>
    </header>
  );
};
