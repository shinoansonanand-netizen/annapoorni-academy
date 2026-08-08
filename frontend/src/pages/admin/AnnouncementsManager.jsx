import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Plus, Edit2, Trash2, Bell } from 'lucide-react';

export const AnnouncementsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', content: '', category: 'General', status: 'published', is_featured: false
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await API.get('/api/admin/announcements');
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', content: '', category: 'General', status: 'published', is_featured: false });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await API.put(`/api/admin/announcements/${editingItem.id}`, formData);
        setToastMsg('Announcement updated!');
      } else {
        await API.post('/api/admin/announcements', formData);
        setToastMsg('New announcement published!');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      alert('Error saving announcement');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/api/admin/announcements/${itemToDelete.id}`);
      setToastMsg('Announcement deleted.');
      setDeleteModalOpen(false);
      fetchItems();
    } catch (err) {
      alert('Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading Announcements...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Announcements & Events</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Publish notifications, admission news, workshops, and exam schedules.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Create Announcement
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td style={{ fontWeight: 700 }}>{i.title}</td>
                <td>{i.category}</td>
                <td>
                  <span className={`badge ${i.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                    {i.status}
                  </span>
                </td>
                <td>{i.is_featured ? 'Yes' : 'No'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(i)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => { setItemToDelete(i); setDeleteModalOpen(true); }}>
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
          <div className="modal-container" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingItem ? 'Edit Announcement' : 'New Announcement'}
              </h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Announcement Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Admissions Open 2026-2027"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Admission">Admission</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brief Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Content</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    value={formData.content || ''}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.status === 'published'}
                      onChange={e => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <span>Featured on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Announcement"
        message={`Are you sure you want to delete '${itemToDelete?.title}'?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};
