import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { AnnouncementCard } from '../../components/AnnouncementCard';

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const url = category ? `/api/announcements?category=${category}` : '/api/announcements';
        const res = await API.get(url);
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [category]);

  const categories = ['All', 'General', 'Admission', 'Workshop', 'Exam', 'Event'];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Academy News & Announcements</h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
          Stay updated with official notifications, admission deadlines, workshops, and events.
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {categories.map((cat) => {
          const val = cat === 'All' ? '' : cat;
          const isActive = category === val;
          return (
            <button
              key={cat}
              onClick={() => setCategory(val)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '20px' }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Announcements...</div>
      ) : announcements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
          No announcements found in this category.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {announcements.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
        </div>
      )}
    </div>
  );
};
