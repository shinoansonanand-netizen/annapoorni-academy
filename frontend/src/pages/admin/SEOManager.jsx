import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { Save, Search, Globe } from 'lucide-react';

export const SEOManager = () => {
  const [formData, setFormData] = useState({
    site_title: '', meta_description: '', keywords: '', og_title: '', og_description: '', og_image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchSeo = async () => {
    try {
      const res = await API.get('/api/seo');
      if (res.data) setFormData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/api/admin/seo', formData);
      setToastMsg('SEO settings updated!');
    } catch (err) {
      alert('Error updating SEO settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading SEO Settings...</div>;

  return (
    <div style={{ maxWidth: '750px' }}>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Search Engine Optimization (SEO)</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Configure website page titles, meta descriptions, keywords, and Open Graph social sharing cards.</p>
      </div>

      <div className="table-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Global Website Title</label>
            <input
              type="text"
              required
              className="form-control"
              value={formData.site_title || ''}
              onChange={e => setFormData({ ...formData, site_title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta Description</label>
            <textarea
              rows="3"
              required
              className="form-control"
              value={formData.meta_description || ''}
              onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta Keywords (Comma separated)</label>
            <input
              type="text"
              className="form-control"
              value={formData.keywords || ''}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
            />
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Open Graph (Social Sharing) Cards</h4>

            <div className="form-group">
              <label className="form-label">Open Graph Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.og_title || ''}
                onChange={e => setFormData({ ...formData, og_title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Open Graph Description</label>
              <textarea
                rows="2"
                className="form-control"
                value={formData.og_description || ''}
                onChange={e => setFormData({ ...formData, og_description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Social Share Card Image URL</label>
              <input
                type="text"
                className="form-control"
                value={formData.og_image || ''}
                onChange={e => setFormData({ ...formData, og_image: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save SEO Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
};
