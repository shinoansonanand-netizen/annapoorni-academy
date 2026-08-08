import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { Save, PhoneCall, Mail, MapPin, Clock, MessageSquare, Search, Trash2, CheckCircle2 } from 'lucide-react';

export const ContactManager = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [inquiryLoading, setInquiryLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState({
    email: '', phone: '', address: '', maps_embed_url: '', working_hours: '', contact_form_recipient: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchContact = async () => {
    try {
      const res = await API.get('/api/contact');
      if (res.data) setFormData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      setInquiryLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await API.get('/api/admin/contact/inquiries', { params });
      setInquiries(res.data);
    } catch (err) {
      console.error('Failed to fetch contact inquiries', err);
    } finally {
      setInquiryLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [activeTab, search, statusFilter]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/api/admin/contact', formData);
      setToastMsg('Contact details updated successfully!');
    } catch (err) {
      alert('Error updating contact information');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/api/admin/contact/inquiries/${id}`, { status: newStatus });
      fetchInquiries();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      await API.delete(`/api/admin/contact/inquiries/${id}`);
      fetchInquiries();
    } catch (err) {
      alert('Failed to delete inquiry.');
    }
  };

  if (loading) return <div>Loading Contact Settings...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Contact & Inquiries Manager</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            Manage website messages & official contact information.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--gray-200)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`btn btn-sm ${activeTab === 'inquiries' ? 'btn-primary' : ''}`}
            style={{ borderRadius: '8px' }}
          >
            📬 Website Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : ''}`}
            style={{ borderRadius: '8px' }}
          >
            ⚙️ Contact Settings
          </button>
        </div>
      </div>

      {activeTab === 'inquiries' ? (
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="search-box" style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, subject..."
                style={{ paddingLeft: '2.5rem', width: '280px' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="new">🆕 New</option>
              <option value="contacted">📞 Contacted</option>
              <option value="resolved">✅ Resolved</option>
            </select>
          </div>

          {inquiryLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Loading website inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
              <MessageSquare size={48} style={{ color: 'var(--gray-400)', margin: '0 auto 1rem' }} />
              <h3>No Website Inquiries</h3>
              <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                When visitors fill out the Contact form, their messages will appear here.
              </p>
            </div>
          ) : (
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--gray-100)', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Date</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Sender</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Subject & Message</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Mode</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                        {new Date(item.created_at).toLocaleDateString()} <br />
                        <span style={{ fontSize: '0.75rem' }}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '0.825rem' }}>
                          <a href={`mailto:${item.email}`} style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={13} /> {item.email}
                          </a>
                          {item.phone && (
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${item.name}, regarding your inquiry: ${item.subject}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <PhoneCall size={13} /> {item.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-color)' }}>{item.subject}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '4px', lineHeight: 1.5 }}>
                          {item.message}
                        </p>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          background: item.mode?.includes('Zoom') ? '#DBEAFE' : '#E0E7FF',
                          color: item.mode?.includes('Zoom') ? '#1E40AF' : '#3730A3',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '10px'
                        }}>
                          {item.mode}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <select
                          value={item.status}
                          onChange={e => handleStatusChange(item.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            border: '1px solid var(--gray-300)',
                            background: item.status === 'new' ? '#FEF3C7' : item.status === 'resolved' ? '#D1FAE5' : '#E0F2FE',
                            color: item.status === 'new' ? '#92400E' : item.status === 'resolved' ? '#065F46' : '#075985'
                          }}
                        >
                          <option value="new">🆕 New</option>
                          <option value="contacted">📞 Contacted</option>
                          <option value="resolved">✅ Resolved</option>
                        </select>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteInquiry(item.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--error-color)', borderColor: 'var(--gray-300)' }}
                          title="Delete Inquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '750px' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Official Academy Email</label>
              <input
                type="email"
                required
                className="form-control"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone / Mobile</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campus Physical Address</label>
              <textarea
                rows="3"
                required
                className="form-control"
                value={formData.address || ''}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Working Hours</label>
              <input
                type="text"
                className="form-control"
                value={formData.working_hours || ''}
                onChange={e => setFormData({ ...formData, working_hours: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Form Recipient Email (Admin Email)</label>
              <input
                type="email"
                className="form-control"
                value={formData.contact_form_recipient || ''}
                onChange={e => setFormData({ ...formData, contact_form_recipient: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Google Maps Embed URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://www.google.com/maps/embed?..."
                value={formData.maps_embed_url || ''}
                onChange={e => setFormData({ ...formData, maps_embed_url: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Contact Settings'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
