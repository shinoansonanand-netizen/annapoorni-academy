import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        {type === 'success' ? (
          <CheckCircle size={20} className="text-emerald-500" />
        ) : (
          <AlertCircle size={20} className="text-rose-500" />
        )}
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
        {onClose && (
          <button onClick={onClose} style={{ marginLeft: 'auto', color: '#94A3B8' }}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
