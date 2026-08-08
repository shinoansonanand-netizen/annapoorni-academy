import React from 'react';

export const AppearancePreview = ({ theme, settings }) => {
  const p = theme.primary_color || '#1E3A8A';
  const s = theme.secondary_color || '#0D9488';
  const a = theme.accent_color || '#F59E0B';
  const bg = theme.background_color || '#F8FAFC';
  const text = theme.text_color || '#0F172A';
  const cardBg = theme.card_color || '#FFFFFF';
  const headerBg = theme.header_color || '#FFFFFF';
  const footerBg = theme.footer_color || '#0F172A';
  const headingFont = theme.font_heading || 'Outfit';
  const bodyFont = theme.font_body || 'Inter';

  return (
    <div className="preview-frame-container">
      <div className="preview-browser-bar">
        <div className="preview-dot" style={{ background: '#EF4444' }} />
        <div className="preview-dot" style={{ background: '#F59E0B' }} />
        <div className="preview-dot" style={{ background: '#10B981' }} />
        <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '4px', fontSize: '0.75rem', padding: '2px 10px', color: '#64748B', marginLeft: '10px' }}>
          https://annapoorni.edu/ (Live Theme Preview)
        </div>
      </div>

      <div className="preview-iframe-wrapper" style={{ background: bg, color: text, fontFamily: `'${bodyFont}', sans-serif` }}>
        {/* Mock Header */}
        <div style={{ background: headerBg, height: '56px', borderBottom: '1px solid #E2E8F0', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, color: p, fontFamily: `'${headingFont}', sans-serif`, fontSize: '1.1rem' }}>
            {settings?.site_name || 'Annapoorni Academy'}
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>Home</span>
            <span>Courses</span>
            <span>Subjects</span>
            <span>Announcements</span>
          </div>
        </div>

        {/* Mock Hero */}
        <div style={{ padding: '3rem 2rem', textAlign: 'center', background: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`, color: '#FFFFFF' }}>
          <h2 style={{ fontFamily: `'${headingFont}', sans-serif`, fontSize: '2rem', fontWeight: theme.heading_weight || '700', marginBottom: '0.5rem' }}>
            Learn Better. Grow Smarter.
          </h2>
          <p style={{ opacity: 0.9, maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
            {settings?.tagline || 'Empowering Minds, Shaping Futures with premier courses.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{ background: a, color: '#0F172A', padding: '8px 20px', borderRadius: theme.border_radius || '12px', fontWeight: 700, border: 'none' }}>
              Explore Courses
            </button>
            <button style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '8px 20px', borderRadius: theme.border_radius || '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.4)' }}>
              Browse Subjects
            </button>
          </div>
        </div>

        {/* Mock Cards Section */}
        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ background: cardBg, padding: '1.25rem', borderRadius: theme.border_radius || '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <span style={{ background: p, color: '#FFFFFF', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              COMPUTER SCIENCE
            </span>
            <h4 style={{ fontFamily: `'${headingFont}', sans-serif`, fontSize: '1.1rem', marginTop: '0.5rem', color: text }}>
              Python Programming Essentials
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '0.25rem' }}>
              Learn fundamental syntax, logic, and data structures.
            </p>
          </div>

          <div style={{ background: cardBg, padding: '1.25rem', borderRadius: theme.border_radius || '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <span style={{ background: s, color: '#FFFFFF', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              MATHEMATICS
            </span>
            <h4 style={{ fontFamily: `'${headingFont}', sans-serif`, fontSize: '1.1rem', marginTop: '0.5rem', color: text }}>
              Calculus & Trigonometry
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '0.25rem' }}>
              Master analytical limits, derivatives, and applications.
            </p>
          </div>
        </div>

        {/* Mock Footer */}
        <div style={{ background: footerBg, color: '#F8FAFC', padding: '1.5rem 2rem', marginTop: 'auto', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>© Annapoorni Academy. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1rem', color: a }}>
            <span>Instagram</span>
            <span>YouTube</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
