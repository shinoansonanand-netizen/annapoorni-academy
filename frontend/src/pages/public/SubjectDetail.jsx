import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';
import { CourseCard } from '../../components/CourseCard';

export const SubjectDetail = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await API.get(`/api/subjects/${id}`);
        setSubject(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>Loading Subject Overview...</div>;
  if (!subject) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--error-color)' }}>Subject not found.</div>;

  return (
    <div>
      <section style={{ background: 'var(--primary-color)', color: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '750px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '1rem' }}>{subject.name}</h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9 }}>{subject.description}</p>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Courses under {subject.name}</h2>
        {subject.courses?.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>No active courses published under this subject yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {subject.courses?.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
    </div>
  );
};
