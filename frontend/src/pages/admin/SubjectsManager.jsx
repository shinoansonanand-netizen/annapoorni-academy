import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const SubjectsManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', icon: 'BookOpen', status: 'published', display_order: 1
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/api/admin/subjects');
      setSubjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({ name: '', description: '', icon: 'BookOpen', status: 'published', display_order: subjects.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSubject(s);
    setFormData({ ...s });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await API.put(`/api/admin/subjects/${editingSubject.id}`, formData);
        setToastMsg('Subject updated successfully!');
      } else {
        await API.post('/api/admin/subjects', formData);
        setToastMsg('Subject created!');
      }
      setModalOpen(false);
      fetchSubjects();
    } catch (err) {
      alert('Error saving subject');
    }
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/api/admin/subjects/${subjectToDelete.id}`);
      setToastMsg('Subject removed.');
      setDeleteModalOpen(false);
      fetchSubjects();
    } catch (err) {
      alert('Failed to delete subject');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading Subjects...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Subject Management</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage high-level academic subject categories.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Subject
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Icon</th>
              <th>Subject Name</th>
              <th>Description</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700 }}>#{s.display_order}</td>
                <td><span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{s.icon}</span></td>
                <td style={{ fontWeight: 700 }}>{s.name}</td>
                <td style={{ color: '#64748B' }}>{s.description}</td>
                <td>{s.course_count || 0} Courses</td>
                <td>
                  <span className={`badge ${s.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(s)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => { setSubjectToDelete(s); setDeleteModalOpen(true); }}>
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
          <div className="modal-container" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Subject Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Mathematics"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon Identifier</label>
                  <select
                    className="form-control"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  >
                    <option value="Calculator">Calculator (Math)</option>
                    <option value="Atom">Atom (Science)</option>
                    <option value="Code">Code (Computer Science)</option>
                    <option value="BookOpen">BookOpen (General)</option>
                    <option value="Award">Award (Certifications)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Subject"
        message={`Are you sure you want to delete '${subjectToDelete?.name}'?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};
