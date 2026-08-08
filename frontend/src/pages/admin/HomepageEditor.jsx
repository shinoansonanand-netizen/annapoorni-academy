import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { Layout, Save, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';

export const HomepageEditor = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchSections = async () => {
    try {
      const res = await API.get('/api/admin/homepage');
      setSections(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSectionChange = (idx, field, val) => {
    const updated = [...sections];
    updated[idx][field] = val;
    setSections(updated);
  };

  const handleToggleEnable = (idx) => {
    const updated = [...sections];
    updated[idx].is_enabled = !updated[idx].is_enabled;
    setSections(updated);
  };

  const handleMove = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Reassign display orders
    updated.forEach((sec, i) => sec.display_order = i + 1);
    setSections(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/api/admin/homepage', { sections });
      setToastMsg('Homepage section configuration published!');
      await fetchSections();
    } catch (err) {
      alert('Failed to save homepage sections');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading Homepage Sections...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Homepage Section Editor</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Reorder homepage sections, toggle visibility, and customize titles and button text.</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save & Publish Homepage'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sections.map((sec, idx) => (
          <div
            key={sec.id || sec.section_key}
            className="table-card"
            style={{
              padding: '1.5rem',
              borderLeft: `4px solid ${sec.is_enabled ? '#1E3A8A' : '#CBD5E1'}`,
              opacity: sec.is_enabled ? 1 : 0.65
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }}>
                  Order #{idx + 1}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{sec.section_name}</h3>
                <span className={`badge ${sec.is_enabled ? 'badge-published' : 'badge-draft'}`}>
                  {sec.is_enabled ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => handleMove(idx, -1)} disabled={idx === 0}>
                  <MoveUp size={14} />
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => handleMove(idx, 1)} disabled={idx === sections.length - 1}>
                  <MoveDown size={14} />
                </button>
                <button
                  className={`btn btn-sm ${sec.is_enabled ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => handleToggleEnable(idx)}
                >
                  {sec.is_enabled ? <><EyeOff size={14} /> Disable</> : <><Eye size={14} /> Enable</>}
                </button>
              </div>
            </div>

            {/* Editable Fields for Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Heading / Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec.title || ''}
                  onChange={e => handleSectionChange(idx, 'title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={sec.subtitle || ''}
                  onChange={e => handleSectionChange(idx, 'subtitle', e.target.value)}
                />
              </div>

              {(sec.section_key === 'hero' || sec.section_key === 'about' || sec.section_key === 'cta') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Primary Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={sec.cta_text || ''}
                      onChange={e => handleSectionChange(idx, 'cta_text', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Button Destination URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={sec.cta_url || ''}
                      onChange={e => handleSectionChange(idx, 'cta_url', e.target.value)}
                    />
                  </div>
                </>
              )}

              {sec.image_url !== undefined && (
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Section Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={sec.image_url || ''}
                    onChange={e => handleSectionChange(idx, 'image_url', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
