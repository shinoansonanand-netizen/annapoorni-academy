import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { CourseCard } from '../../components/CourseCard';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { ArrowRight, Award, Layers, CheckCircle, FileText, Clock, TrendingUp, Star } from 'lucide-react';

export const Home = () => {
  const [sections, setSections] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [secRes, courseRes, annRes] = await Promise.all([
          API.get('/api/homepage'),
          API.get('/api/courses?featured=true'),
          API.get('/api/announcements?featured=true')
        ]);
        setSections(secRes.data || []);
        setFeaturedCourses(courseRes.data || []);
        setAnnouncements(annRes.data || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const getSection = (key) => sections.find(s => s.section_key === key && s.is_enabled);

  const hero = getSection('hero');
  const about = getSection('about');
  const featured = getSection('featured_courses');
  const benefits = getSection('benefits');
  const testimonials = getSection('testimonials');
  const announcementsSec = getSection('announcements');
  const cta = getSection('cta');

  const getBenefitIcon = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('expert')) return <Award size={24} />;
    if (t.includes('structured')) return <Layers size={24} />;
    if (t.includes('assessments')) return <CheckCircle size={24} />;
    if (t.includes('resources')) return <FileText size={24} />;
    if (t.includes('pace')) return <Clock size={24} />;
    return <TrendingUp size={24} />;
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Annapoorni Academy...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      {hero && (
        <section style={{
          background: hero.background_style === 'gradient'
            ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
            : 'var(--primary-color)',
          color: '#FFFFFF',
          padding: '5rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div className="animate-fade-in">
              <h1 style={{ fontSize: '3rem', lineHeight: 1.15, fontWeight: 800, marginBottom: '1.25rem', color: '#FFFFFF' }}>
                {hero.title || 'Learn Better. Grow Smarter.'}
              </h1>
              <p style={{ fontSize: '1.15rem', opacity: 0.92, lineHeight: 1.6, marginBottom: '2rem' }}>
                {hero.subtitle || 'Discover world-class educational courses, subjects, lessons, and interactive assessments.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {hero.cta_text && (
                  <Link to={hero.cta_url || '/courses'} className="btn btn-accent btn-lg">
                    {hero.cta_text} <ArrowRight size={18} />
                  </Link>
                )}
                {hero.secondary_cta_text && (
                  <Link to={hero.secondary_cta_url || '/subjects'} className="btn btn-outline btn-lg" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
                    {hero.secondary_cta_text}
                  </Link>
                )}
              </div>
            </div>

            {hero.image_url && (
              <div style={{ position: 'relative' }}>
                <img
                  src={hero.image_url}
                  alt={hero.title}
                  style={{ borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      {about && (
        <section style={{ padding: '5rem 0' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {about.image_url && (
              <img
                src={about.image_url}
                alt={about.title}
                style={{ borderRadius: '16px', boxShadow: 'var(--shadow-style)', width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            )}
            <div>
              <span style={{ color: 'var(--secondary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem' }}>
                ABOUT ANNAPOORNI ACADEMY
              </span>
              <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                {about.title}
              </h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {about.content || about.subtitle}
              </p>

              {/* Statistics Grid */}
              {about.meta && about.meta.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                  {about.meta.map((stat, idx) => (
                    <div key={idx} style={{ background: 'var(--gray-50)', padding: '1rem 1.25rem', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>{stat.value}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 600 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {about.cta_text && (
                <Link to={about.cta_url || '/about'} className="btn btn-primary">
                  {about.cta_text} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      {featured && (
        <section style={{ padding: '5rem 0', background: 'var(--gray-50)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
              <span style={{ color: 'var(--secondary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem' }}>
                CURATED LEARNING
              </span>
              <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem' }}>{featured.title}</h2>
              <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>{featured.subtitle}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {featuredCourses.slice(0, 3).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/courses" className="btn btn-outline btn-lg">
                View All Courses <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Learning Benefits Section */}
      {benefits && (
        <section style={{ padding: '5rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
              <h2 style={{ fontSize: '2.25rem' }}>{benefits.title}</h2>
              <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>{benefits.subtitle}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {(benefits.meta || []).map((card, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(30, 58, 138, 0.08)',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    {getBenefitIcon(card.title)}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{card.title}</h3>
                  <p style={{ fontSize: '0.925rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials && (
        <section style={{ padding: '5rem 0', background: 'var(--gray-50)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
              <h2 style={{ fontSize: '2.25rem' }}>{testimonials.title}</h2>
              <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>{testimonials.subtitle}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {(testimonials.meta || []).map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '4px', color: 'var(--accent-color)', marginBottom: '1rem' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--accent-color)" />)}
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--gray-700)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                    "{item.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                    <img src={item.avatar} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-color)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Announcements */}
      {announcementsSec && (
        <section style={{ padding: '5rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '2.25rem' }}>{announcementsSec.title}</h2>
                <p style={{ color: 'var(--gray-600)', marginTop: '0.4rem' }}>{announcementsSec.subtitle}</p>
              </div>
              <Link to="/announcements" className="btn btn-outline">
                All Notices <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {announcements.slice(0, 3).map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call To Action */}
      {cta && (
        <section style={{
          padding: '5rem 0',
          background: 'var(--footer-color)',
          color: '#FFFFFF',
          textAlign: 'center'
        }}>
          <div className="container" style={{ maxWidth: '750px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '1rem' }}>{cta.title}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--gray-300)', marginBottom: '2rem' }}>{cta.subtitle}</p>
            {cta.cta_text && (
              <Link to={cta.cta_url || '/courses'} className="btn btn-accent btn-lg">
                {cta.cta_text} <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
