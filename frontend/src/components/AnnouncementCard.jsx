import React from 'react';
import { Calendar, Tag } from 'lucide-react';

export const AnnouncementCard = ({ announcement }) => {
  if (!announcement) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Latest Notice';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Latest Notice';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <span style={{
          background: 'rgba(13, 148, 136, 0.1)',
          color: 'var(--secondary-color)',
          padding: '4px 10px',
          borderRadius: '12px',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Tag size={12} /> {announcement.category || 'General'}
        </span>
        <span style={{ color: 'var(--gray-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={13} /> {formatDate(announcement.created_at)}
        </span>
      </div>

      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-color)', lineHeight: 1.35 }}>
        {announcement.title}
      </h4>

      <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
        {announcement.description}
      </p>

      {announcement.content && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--gray-200)', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
          {announcement.content}
        </div>
      )}
    </div>
  );
};
