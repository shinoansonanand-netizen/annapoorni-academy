import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Plus, Edit2, Trash2, Navigation } from 'lucide-react';

export const NavigationManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: '', destination: '/', display_order: 1, is_enabled: true, is_external: false, location: 'both'
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNav = async () => {
    try {
      const res = await API.get('/api/admin/navigation');
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ label: '', destination: '/', display_order: items.length + 1, is_enabled: true, is_external: false, location: 'both' });
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
        await API.put(`/api/admin/navigation/${editingItem.id}`, formData);
        setToastMsg('Navigation link updated successfully!');
      } else {
        await API.post('/api/admin/navigation', formData);
        setToastMsg('New navigation link created!');
      }
      setModalOpen(false);
      fetchNav();
    } catch (err) {
      alert('Error saving navigation item: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/api/admin/navigation/${itemToDelete.id}`);
      setToastMsg('Navigation link removed.');
      setDeleteModalOpen(false);
      fetchNav();
    } catch (err) {
      alert('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading Navigation Settings...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Website Navigation Manager</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Control header and footer menu items, links, order, and visibility.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add Menu Item
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Label</th>
              <th>Destination Path / URL</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700 }}>#{item.display_order}</td>
                <td style={{ fontWeight: 600 }}>{item.label}</td>
                <td style={{ color: '#64748B' }}>{item.destination}</td>
                <td style={{ textTransform: 'capitalize' }}>{item.location}</td>
                <td>
                  <span className={`badge ${item.is_enabled ? 'badge-published' : 'badge-draft'}`}>
                    {item.is_enabled ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(item)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => { setItemToDelete(item); setDeleteModalOpen(true); }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
              </h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Link Label</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Courses"
                    value={formData.label}
                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination Path / URL</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="/courses or https://..."
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.display_order}
                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <select
                    className="form-control"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="both">Both Header & Footer</option>
                    <option value="header">Header Only</option>
                    <option value="footer">Footer Only</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_enabled}
                      onChange={e => setFormData({ ...formData, is_enabled: e.target.checked })}
                    />
                    <span>Enabled</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_external}
                      onChange={e => setFormData({ ...formData, is_external: e.target.checked })}
                    />
                    <span>External Link</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Menu Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Navigation Item"
        message={`Are you sure you want to remove '${itemToDelete?.label}' from navigation?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};
