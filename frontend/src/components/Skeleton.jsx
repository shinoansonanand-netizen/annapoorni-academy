import React from 'react';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius
      }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Skeleton height="180px" borderRadius="12px" />
    <Skeleton width="40%" height="16px" />
    <Skeleton width="80%" height="24px" />
    <Skeleton width="100%" height="40px" />
  </div>
);
