import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart, ArrowRight, Sparkles } from 'lucide-react';
import { EnrollmentModal } from './EnrollmentModal';

export const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!course) return null;

  return (
    <>
      <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {course.category && (
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'var(--primary-color)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {course.category}
            </span>
          )}
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#059669',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px'
          }}>
            Zoom & Offline
          </span>
        </div>

        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BarChart size={15} /> {course.difficulty || 'All Levels'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-color)', lineHeight: 1.3 }}>
            {course.title}
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1, fontWeight: 700 }}
            >
              <Sparkles size={14} /> Enroll Now
            </button>

            <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">
              Details
            </Link>
          </div>
        </div>
      </div>

      <EnrollmentModal
        course={course}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
