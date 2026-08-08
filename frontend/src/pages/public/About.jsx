import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Award, BookOpen, Users, Globe, CheckCircle2 } from 'lucide-react';

export const About = () => {
  const { settings } = useSiteSettings();

  return (
    <div>
      <section style={{ background: 'var(--primary-color)', color: '#FFFFFF', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h1 style={{ fontSize: '2.75rem', color: '#FFFFFF', marginBottom: '1rem' }}>About {settings.site_name || 'Annapoorni Academy'}</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Dedicated to providing accessible, high-quality, and structured educational experiences for learners worldwide.
          </p>
        </div>
      </section>

      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--secondary-color)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              MEET COACH SINDHU RAM
            </span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Mastering Vedic Maths, Memory Training & Speed Reading
            </h2>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Coach Sindhu Ram is an accomplished **Vedic Maths Coach**, **Memory Coach**, and **Speed Reading Expert**. She has trained thousands of students to excel in national-level mental mathematics competitions and cognitive efficiency challenges.
            </p>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>
              Through Annapoorni Academy, Coach Sindhu Ram combines 16 ancient Vedic Sutras, cognitive memory retention techniques, and rapid information processing strategies to transform how students learn, calculate, and read.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={24} style={{ color: 'var(--secondary-color)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Vedic Mathematics & Competition Practice</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>16 Sutras for rapid mental calculations and national competition readiness.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={24} style={{ color: 'var(--secondary-color)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Memory Coaching & Retention</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Recall techniques, mnemonic visualization, and long-term memory mastery.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={24} style={{ color: 'var(--secondary-color)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Speed Reading & Efficiency</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Eliminate sub-vocalization, double reading speed, and maximize comprehension.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
