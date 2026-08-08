import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B' }}>
            <AlertTriangle size={20} /> {title || 'Confirm Action'}
          </h3>
          <button onClick={onClose} style={{ color: '#64748B' }}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#334155', fontSize: '0.95rem' }}>
            {message || 'Are you sure you want to perform this action? This step cannot be undone.'}
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" style={{ background: '#EF4444' }} onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
