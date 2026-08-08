import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { PlayCircle, Download, FileText, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

export const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await API.get(`/api/lessons/${id}`);
        setLesson(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>Loading Lesson Content...</div>;
  if (!lesson) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--error-color)' }}>Lesson not found.</div>;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Back Link */}
      <Link to={`/courses/${lesson.course_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Course Syllabus
      </Link>

      {/* Lesson Title & Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
          {lesson.course_title} • {lesson.module_title || 'Module'}
        </span>
        <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>{lesson.title}</h1>
      </div>

      {/* Video Player Section */}
      {lesson.video_url && (
        <div className="glass-card" style={{ padding: '1rem', marginBottom: '2.5rem', overflow: 'hidden' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
            <iframe
              src={lesson.video_url}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      )}

      {/* Main Content & Resources Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
        {/* Lesson Markdown Content */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
            Lesson Overview & Content
          </h3>
          <div
            style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--gray-800)', whiteSpace: 'pre-wrap' }}
          >
            {lesson.content || lesson.description}
          </div>
        </div>

        {/* Resources & Quizzes Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Downloadable Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ color: 'var(--primary-color)' }} /> Learning Resources
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {lesson.resources.map(res => (
                  <a
                    key={res.id}
                    href={res.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--gray-50)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    <span>{res.title}</span>
                    <Download size={16} style={{ color: 'var(--primary-color)' }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Attached Quiz */}
          {lesson.quizzes && lesson.quizzes.length > 0 && (
            <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={20} style={{ color: 'var(--accent-color)' }} /> Lesson Knowledge Check
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                Test your understanding of this lesson before moving to the next topic.
              </p>
              <Link to={`/quizzes/${lesson.quizzes[0].id}`} className="btn btn-accent btn-sm" style={{ width: '100%' }}>
                Take Quiz Assessment
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Lesson Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
        {lesson.prev_lesson_id ? (
          <Link to={`/lessons/${lesson.prev_lesson_id}`} className="btn btn-outline">
            <ArrowLeft size={16} /> Previous Lesson
          </Link>
        ) : <div />}

        {lesson.next_lesson_id ? (
          <Link to={`/lessons/${lesson.next_lesson_id}`} className="btn btn-primary">
            Next Lesson <ArrowRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};
