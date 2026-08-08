import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Plus, Edit2, Trash2, Video, FileText } from 'lucide-react';

export const LessonsManager = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '', course_id: '', description: '', content: '', video_url: '', duration: '15 mins', is_published: true, display_order: 1
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [lRes, cRes] = await Promise.all([
        API.get('/api/admin/lessons'),
        API.get('/api/admin/courses')
      ]);
      setLessons(lRes.data || []);
      setCourses(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingLesson(null);
    setFormData({
      title: '', course_id: courses[0]?.id || '', description: '', content: '', video_url: '', duration: '15 mins', is_published: true, display_order: lessons.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (les) => {
    setEditingLesson(les);
    setFormData({ ...les });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await API.put(`/api/admin/lessons/${editingLesson.id}`, formData);
        setToastMsg('Lesson updated!');
      } else {
        await API.post('/api/admin/lessons', formData);
        setToastMsg('Lesson published!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error saving lesson: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!lessonToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/api/admin/lessons/${lessonToDelete.id}`);
      setToastMsg('Lesson removed.');
      setDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to delete lesson');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading Lessons...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Lesson Management</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Create video lectures, markdown reading notes, and structured module contents.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Create New Lesson
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Lesson Title</th>
              <th>Course</th>
              <th>Video Embed</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(l => (
              <tr key={l.id}>
                <td style={{ fontWeight: 700 }}>#{l.display_order}</td>
                <td style={{ fontWeight: 700 }}>{l.title}</td>
                <td>{l.course_title || 'General'}</td>
                <td>
                  {l.video_url ? <span style={{ color: '#0D9488', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Video size={14} /> Embedded</span> : '-'}
                </td>
                <td>{l.duration}</td>
                <td>
                  <span className={`badge ${l.is_published ? 'badge-published' : 'badge-draft'}`}>
                    {l.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(l)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => { setLessonToDelete(l); setDeleteModalOpen(true); }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Lesson Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Variables, Types & Operations"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Course</label>
                  <select
                    required
                    className="form-control"
                    value={formData.course_id}
                    onChange={e => setFormData({ ...formData, course_id: e.target.value })}
                  >
                    <option value="">Select Course...</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Video Embed URL (YouTube/Vimeo)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://www.youtube.com/embed/..."
                      value={formData.video_url || ''}
                      onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="15 mins"
                      value={formData.duration || ''}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Lesson Markdown / Content</label>
                  <textarea
                    rows="6"
                    className="form-control"
                    placeholder="# Lesson Title&#10;&#10;Write lesson details or code snippets here..."
                    value={formData.content || ''}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <span>Published & Visible</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Lesson"
        message={`Are you sure you want to delete '${lessonToDelete?.title}'?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};
