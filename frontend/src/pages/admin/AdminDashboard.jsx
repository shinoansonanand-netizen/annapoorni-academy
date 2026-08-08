import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  BookOpen, Layers, FileText, HelpCircle, Bell, Image as ImageIcon, Award, Activity, Plus 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/api/admin/dashboard');
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading Admin Overview...</div>;

  const metrics = summary?.metrics || {};

  return (
    <div>
      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#1E3A8A' }}>
            <BookOpen size={24} />
          </div>
          <div className="metric-info">
            <h3>{metrics.total_courses || 0}</h3>
            <p>Total Courses ({metrics.published_courses || 0} Published)</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#CCFBF1', color: '#0D9488' }}>
            <Layers size={24} />
          </div>
          <div className="metric-info">
            <h3>{metrics.total_subjects || 0}</h3>
            <p>Active Subjects</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <FileText size={24} />
          </div>
          <div className="metric-info">
            <h3>{metrics.total_lessons || 0}</h3>
            <p>Structured Lessons</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#E0E7FF', color: '#4338CA' }}>
            <HelpCircle size={24} />
          </div>
          <div className="metric-info">
            <h3>{metrics.total_quizzes || 0}</h3>
            <p>Quizzes ({metrics.total_quiz_attempts || 0} Submissions)</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#FCE7F3', color: '#BE185D' }}>
            <Bell size={24} />
          </div>
          <div className="metric-info">
            <h3>{metrics.total_announcements || 0}</h3>
            <p>Announcements</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#F3E8FF', color: '#6B21A8' }}>
            <ImageIcon size={24} />
          </div>
          <div className="metric-info">
            <h3>{metrics.total_media || 0}</h3>
            <p>Media Library Assets</p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/admin/appearance" className="btn btn-primary btn-sm">Customize Theme & Colors</Link>
        <Link to="/admin/homepage" className="btn btn-outline btn-sm">Edit Homepage Sections</Link>
        <Link to="/admin/courses" className="btn btn-outline btn-sm"><Plus size={16} /> Create Course</Link>
        <Link to="/admin/quizzes" className="btn btn-outline btn-sm"><Plus size={16} /> Build Quiz</Link>
      </div>

      {/* Recent Tables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recently Added Courses */}
        <div className="table-card">
          <div className="table-header">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Courses</h3>
            <Link to="/admin/courses" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Manage All</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary?.recent_courses?.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td>{c.category}</td>
                  <td>
                    <span className={`badge ${c.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="table-card">
          <div className="table-header">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Student Quiz Submissions</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {summary?.recent_attempts?.map(at => (
                <tr key={at.id}>
                  <td style={{ fontWeight: 600 }}>{at.user_identifier}</td>
                  <td>{at.score} / {at.max_score}</td>
                  <td>{at.percentage}%</td>
                  <td>
                    <span className={`badge ${at.is_passed ? 'badge-success' : 'badge-danger'}`}>
                      {at.is_passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
