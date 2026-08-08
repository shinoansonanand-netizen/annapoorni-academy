import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Plus, Edit2, Trash2, Share2, ExternalLink } from 'lucide-react';

export const SocialMediaManager = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    platform: '', url: '', icon: 'Instagram', display_order: 1, is_enabled: true,
    show_in_header: true, show_in_footer: true, show_in_contact: true, show_in_homepage: true
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSocials = async () => {
    try {
      const res = await API.get('/api/admin/social-links');
      setLinks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleOpenAdd = () => {
    setEditingLink(null);
    setFormData({
      platform: 'Instagram', url: 'https://instagram.com/', icon: 'Instagram', display_order: links.length + 1, is_enabled: true,
      show_in_header: true, show_in_footer: true, show_in_contact: true, show_in_homepage: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (l) => {
    setEditingLink(l);
    setFormData({ ...l });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await API.put(`/api/admin/social-links/${editingLink.id}`, formData);
        setToastMsg('Social media link updated!');
      } else {
        await API.post('/api/admin/social-links', formData);
        setToastMsg('Social media link added!');
      }
      setModalOpen(false);
      fetchSocials();
    } catch (err) {
      alert('Error saving social link');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/api/admin/social-links/${itemToDelete.id}`);
      setToastMsg('Social link removed.');
      setDeleteModalOpen(false);
      fetchSocials();
    } catch (err) {
      alert('Failed to delete social link');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading Social Links...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Social Media Integration</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Configure official social profile URLs and select where each icon displays on the site.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Connect Social Account
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Official Profile URL</th>
              <th>Display Placements</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr key={l.id}>
                <td style={{ fontWeight: 700 }}>{l.platform}</td>
                <td>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {l.url} <ExternalLink size={12} />
                  </a>
                </td>
                <td style={{ fontSize: '0.825rem', color: '#475569' }}>
                  {[
                    l.show_in_header && 'Header',
                    l.show_in_footer && 'Footer',
                    l.show_in_contact && 'Contact Page',
                    l.show_in_homepage && 'Homepage'
                  ].filter(Boolean).join(', ')}
                </td>
                <td>
                  <span className={`badge ${l.is_enabled ? 'badge-published' : 'badge-draft'}`}>
                    {l.is_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(l)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => { setItemToDelete(l); setDeleteModalOpen(true); }}>
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
          <div className="modal-container" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingLink ? 'Edit Social Link' : 'Connect Official Social Account'}
              </h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Platform Name</label>
                  <select
                    className="form-control"
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="X">X / Twitter</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Profile URL</label>
                  <input
                    type="url"
                    required
                    className="form-control"
                    placeholder="https://instagram.com/your_official_account"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Display Locations</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.show_in_header}
                        onChange={e => setFormData({ ...formData, show_in_header: e.target.checked })}
                      />
                      <span>Show in Header Navbar</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.show_in_footer}
                        onChange={e => setFormData({ ...formData, show_in_footer: e.target.checked })}
                      />
                      <span>Show in Footer</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.show_in_contact}
                        onChange={e => setFormData({ ...formData, show_in_contact: e.target.checked })}
                      />
                      <span>Show on Contact Page</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.show_in_homepage}
                        onChange={e => setFormData({ ...formData, show_in_homepage: e.target.checked })}
                      />
                      <span>Show on Homepage</span>
                    </label>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_enabled}
                    onChange={e => setFormData({ ...formData, is_enabled: e.target.checked })}
                  />
                  <span>Link Active & Enabled</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Social Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Social Link"
        message={`Are you sure you want to remove '${itemToDelete?.platform}' link?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};
