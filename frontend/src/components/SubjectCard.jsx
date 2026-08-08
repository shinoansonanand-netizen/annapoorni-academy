import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, ArrowRight, Calculator, Atom, Code, Award, Cpu, Globe } from 'lucide-react';

export const SubjectCard = ({ subject }) => {
  if (!subject) return null;

  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'Calculator': return <Calculator size={28} />;
      case 'Atom': return <Atom size={28} />;
      case 'Code': return <Code size={28} />;
      case 'Award': return <Award size={28} />;
      case 'Cpu': return <Cpu size={28} />;
      case 'Globe': return <Globe size={28} />;
      default: return <BookOpen size={28} />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'rgba(30, 58, 138, 0.08)',
          color: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {renderIcon(subject.icon)}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '4px 10px', borderRadius: '12px' }}>
          {subject.course_count || 0} Courses
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>{subject.name}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>{subject.description}</p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
        <Link to={`/subjects/${subject.id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
          Explore Subject <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
