import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { CourseCard } from '../../components/CourseCard';
import { CardSkeleton } from '../../components/Skeleton';
import { Search, Filter } from 'lucide-react';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          API.get('/api/courses'),
          API.get('/api/subjects')
        ]);
        setCourses(cRes.data || []);
        setSubjects(sRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !selectedSubject || String(c.subject_id) === String(selectedSubject);
    const matchesCategory = !selectedCategory || c.category === selectedCategory;
    return matchesSearch && matchesSubject && matchesCategory;
  });

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Explore Educational Courses</h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
          Discover structured modules, video lectures, downloadable study materials, and interactive quizzes.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search courses by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            className="form-control"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Categories</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray-500)' }}>
          <h3>No courses found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try adjusting your search query or subject filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
