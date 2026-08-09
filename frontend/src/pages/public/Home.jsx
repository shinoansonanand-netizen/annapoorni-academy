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

  const hero = getSection('hero') || {
    title: 'Master Vedic Maths, Memory & Speed Reading',
    subtitle: 'Unlock faster mental calculations, advanced memory recall, national competition practice, and rapid reading efficiency with Coach Sindhu Ram.',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
    cta_text: 'Explore Courses',
    cta_url: '/courses',
    secondary_cta_text: 'Browse Subjects',
    secondary_cta_url: '/subjects',
    background_style: 'gradient'
  };

  const about = getSection('about') || {
    title: 'Empowering Minds with Coach Sindhu Ram',
    subtitle: 'Specialized Coaching in Vedic Mathematics, Memory Training, and Speed Reading.',
    content: 'Annapoorni Academy offers world-class training in Vedic Maths (16 Sutras for rapid mental arithmetic), Memory Coaching (association & recall techniques), and Speed Reading (rapid information processing). Our students excel in national-level speed competitions and academic challenges.',
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    cta_text: 'Learn More About Us',
    cta_url: '/about',
    meta: [
      { label: 'Active Students', value: '15,000+' },
      { label: 'Expert Courses', value: '120+' },
      { label: 'Interactive Lessons', value: '850+' },
      { label: 'Success Rate', value: '98%' }
    ]
  };

  const featured = getSection('featured_courses') || {
    title: 'Flagship Coaching Programs',
    subtitle: 'Master mental arithmetic sutras, retention strategies, and rapid reading with Coach Sindhu Ram.'
  };

  const displayCourses = featuredCourses.length > 0 ? featuredCourses : [
    {
      id: 1,
      title: 'Vedic Maths & Speed Calculation Mastery',
      description: 'Learn 16 Vedic Sutras for lightning-fast mental arithmetic, rapid multiplication, and competition prep.',
      category: 'Vedic Maths',
      difficulty: 'All Levels',
      thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      title: 'Memory Coaching & Retention Masterclass',
      description: 'Master cognitive recall techniques, mnemonic systems, mind mapping, and long-term memory strategy.',
      category: 'Memory Coaching',
      difficulty: 'All Levels',
      thumbnail_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Speed Reading & Rapid Information Processing',
      description: 'Double your reading speed, eliminate sub-vocalization, expand peripheral vision, and retain more text.',
      category: 'Speed Reading',
      difficulty: 'All Levels',
      thumbnail_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const benefits = getSection('benefits') || {
    title: 'Why Choose Annapoorni Academy',
    subtitle: 'Everything you need to excel in mental mathematics, competition practice, and rapid information processing.',
    meta: [
      { title: 'Direct Coaching', desc: 'Personal guidance by Coach Sindhu Ram in Zoom & In-Person offline batches.' },
      { title: '16 Vedic Sutras', desc: 'Master rapid mental calculation shortcuts for competitive exam success.' },
      { title: 'Memory Techniques', desc: 'Proven mnemonic strategies for 100% exam recall and retention.' },
      { title: 'Speed Reading', desc: 'Expand eye span and double reading speed with high comprehension.' }
    ]
  };

  const testimonials = getSection('testimonials') || {
    title: 'Student & Parent Testimonials',
    subtitle: 'Hear from students who achieved national-level competition ranks and academic success.',
    meta: [
      {
        quote: 'Coach Sindhu Ram’s Vedic Maths techniques helped me calculate complex math problems in seconds during my national competition!',
        name: 'Kavitha R.',
        role: 'National Competition Rank Holder',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      },
      {
        quote: 'The memory coaching session completely transformed my daughter’s exam prep. She retains formulas effortlessly.',
        name: 'Suresh Kumar',
        role: 'Parent of Student',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
      }
    ]
  };

  const announcementsSec = getSection('announcements') || {
    title: 'Academy Notices & Updates',
    subtitle: 'Latest news on upcoming Zoom batches, offline workshops, and speed math competitions.'
  };

  const cta = getSection('cta') || {
    title: 'Ready to Boost Your Mental Calculation & Memory Skills?',
    subtitle: 'Join Coach Sindhu Ram’s live Zoom and offline coaching batches today.',
    cta_text: 'Enroll Now & Get Details',
    cta_url: '/courses'
  };

  const getBenefitIcon = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('expert')) return <Award size={24} />;
    if (t.includes('structured')) return <Layers size={24} />;
    if (t.includes('assessments')) return <CheckCircle size={24} />;
    if (t.includes('resources')) return <FileText size={24} />;
    if (t.includes('pace')) return <Clock size={24} />;
    return <TrendingUp size={24} />;
  };

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
          <div className="container responsive-grid-1-1">
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
          <div className="container responsive-grid-1-1">
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
              {displayCourses.slice(0, 3).map((c) => (
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
