import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { SubjectCard } from '../../components/SubjectCard';

export const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get('/api/subjects');
        setSubjects(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Academic Subjects</h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
          Explore structured disciplines covering Mathematics, Science, Computer Technology, and foundational skills.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Subjects...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {subjects.map(s => <SubjectCard key={s.id} subject={s} />)}
        </div>
      )}
    </div>
  );
};
