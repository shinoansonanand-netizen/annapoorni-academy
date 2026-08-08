import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Settings as SettingsIcon, ShieldCheck, User, Database, Server } from 'lucide-react';

export const Settings = () => {
  const { admin } = useAdminAuth();

  return (
    <div style={{ maxWidth: '750px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>System Settings & Status</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Overview of active platform configuration and security system.</p>
      </div>

      <div className="table-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Administrator Profile</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Logged in as: <strong>{admin?.username}</strong> ({admin?.email})</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1E3A8A', marginBottom: '0.4rem' }}>
              <Server size={18} /> Backend Service
            </div>
            <div style={{ fontSize: '0.9rem', color: '#334155' }}>Flask 3.0 REST API</div>
            <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>● Status: Operational</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0D9488', marginBottom: '0.4rem' }}>
              <Database size={18} /> Database Engine
            </div>
            <div style={{ fontSize: '0.9rem', color: '#334155' }}>MySQL / Relational DB</div>
            <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>● Status: Connected</div>
          </div>
        </div>

        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '1rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem', color: '#92400E' }}>
          🔒 <strong>V1.0 Access Rules:</strong> Student & Teacher profile management is disabled in V1.0 per platform architecture requirements. Central administrative system controls all educational content and site configurations.
        </div>
      </div>
    </div>
  );
};
