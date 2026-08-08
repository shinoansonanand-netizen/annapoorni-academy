import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { AppearancePreview } from '../../components/AppearancePreview';
import { MediaUploaderModal } from '../../components/MediaUploaderModal';
import { Toast } from '../../components/Toast';
import { Palette, Type, Save, Sparkles, Image as ImageIcon } from 'lucide-react';

export const AppearanceEditor = () => {
  const { theme, updateLocalThemePreview, fetchTheme } = useTheme();
  const { settings, fetchSiteDetails } = useSiteSettings();

  const [formState, setFormState] = useState({ ...theme });
  const [siteState, setSiteState] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [targetField, setTargetField] = useState('logo_url');

  useEffect(() => {
    setFormState({ ...theme });
  }, [theme]);

  useEffect(() => {
    setSiteState({ ...settings });
  }, [settings]);

  const presets = {
    Academic: {
      primary_color: '#1E3A8A',
      secondary_color: '#0D9488',
      accent_color: '#F59E0B',
      background_color: '#F8FAFC',
      text_color: '#0F172A',
      card_color: '#FFFFFF',
      button_color: '#1E3A8A',
      header_color: '#FFFFFF',
      footer_color: '#0F172A',
      font_heading: 'Outfit',
      font_body: 'Inter'
    },
    Modern: {
      primary_color: '#4F46E5',
      secondary_color: '#06B6D4',
      accent_color: '#EC4899',
      background_color: '#FAFAFA',
      text_color: '#18181B',
      card_color: '#FFFFFF',
      button_color: '#4F46E5',
      header_color: '#FFFFFF',
      footer_color: '#18181B',
      font_heading: 'Plus Jakarta Sans',
      font_body: 'Inter'
    },
    Minimal: {
      primary_color: '#18181B',
      secondary_color: '#71717A',
      accent_color: '#3F3F46',
      background_color: '#FFFFFF',
      text_color: '#09090B',
      card_color: '#F4F4F5',
      button_color: '#18181B',
      header_color: '#FFFFFF',
      footer_color: '#09090B',
      font_heading: 'Inter',
      font_body: 'Inter'
    },
    Dark: {
      primary_color: '#3B82F6',
      secondary_color: '#14B8A6',
      accent_color: '#F59E0B',
      background_color: '#0F172A',
      text_color: '#F8FAFC',
      card_color: '#1E293B',
      button_color: '#3B82F6',
      header_color: '#1E293B',
      footer_color: '#020617',
      font_heading: 'Outfit',
      font_body: 'Inter'
    }
  };

  const handleFieldChange = (key, val) => {
    const updated = { ...formState, [key]: val };
    setFormState(updated);
    updateLocalThemePreview(updated);
  };

  const handleApplyPreset = (presetName) => {
    if (presets[presetName]) {
      const updated = { ...formState, active_preset: presetName, ...presets[presetName] };
      setFormState(updated);
      updateLocalThemePreview(updated);
    }
  };

  const handleSaveAndPublish = async () => {
    setSaving(true);
    try {
      await Promise.all([
        API.put('/api/admin/website/theme', formState),
        API.put('/api/admin/website/settings', siteState)
      ]);
      await fetchTheme();
      await fetchSiteDetails();
      setToastMsg('Website appearance published successfully!');
    } catch (err) {
      alert('Error saving theme: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Website Theme & Appearance</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Customize colors, typography, logos, and branding across the public platform in real-time.</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={handleSaveAndPublish} disabled={saving}>
          <Save size={18} /> {saving ? 'Publishing...' : 'Save & Publish Changes'}
        </button>
      </div>

      <div className="appearance-editor-split">
        {/* Left Controls Column */}
        <div className="appearance-controls-panel">
          {/* Preset System */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: '#F59E0B' }} /> Theme Presets
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {Object.keys(presets).map((pName) => (
                <button
                  key={pName}
                  onClick={() => handleApplyPreset(pName)}
                  className={`btn btn-sm ${formState.active_preset === pName ? 'btn-primary' : 'btn-outline'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {pName}
                </button>
              ))}
            </div>
          </div>

          {/* Branding & Logo */}
          <div style={{ marginBottom: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={16} /> Branding & Logos
            </h4>

            <div className="form-group">
              <label className="form-label">Academy Name</label>
              <input
                type="text"
                className="form-control"
                value={siteState.site_name || ''}
                onChange={e => setSiteState({ ...siteState, site_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                className="form-control"
                value={siteState.tagline || ''}
                onChange={e => setSiteState({ ...siteState, tagline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Logo URL</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  value={siteState.logo_url || ''}
                  onChange={e => setSiteState({ ...siteState, logo_url: e.target.value })}
                />
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setTargetField('logo_url');
                    setMediaModalOpen(true);
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={16} /> Website Color Palette
            </h4>

            {[
              { key: 'primary_color', label: 'Primary Brand Color' },
              { key: 'secondary_color', label: 'Secondary Accent Color' },
              { key: 'accent_color', label: 'Highlight / Gold Color' },
              { key: 'background_color', label: 'Main Website Background' },
              { key: 'text_color', label: 'Body Text Color' },
              { key: 'card_color', label: 'Card & Container Background' },
              { key: 'button_color', label: 'Primary Button Background' },
              { key: 'header_color', label: 'Header Navigation Background' },
              { key: 'footer_color', label: 'Footer Background' }
            ].map((col) => (
              <div key={col.key} className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">{col.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="color"
                    value={formState[col.key] || '#1E3A8A'}
                    onChange={e => handleFieldChange(col.key, e.target.value)}
                    style={{ width: '40px', height: '38px', padding: 0, border: 0, cursor: 'pointer', borderRadius: '6px' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={formState[col.key] || ''}
                    onChange={e => handleFieldChange(col.key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Typography */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} /> Typography & Fonts
            </h4>

            <div className="form-group">
              <label className="form-label">Heading Font Family</label>
              <select
                className="form-control"
                value={formState.font_heading || 'Outfit'}
                onChange={e => handleFieldChange('font_heading', e.target.value)}
              >
                <option value="Outfit">Outfit</option>
                <option value="Inter">Inter</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Body Font Family</label>
              <select
                className="form-control"
                value={formState.font_body || 'Inter'}
                onChange={e => handleFieldChange('font_body', e.target.value)}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Outfit">Outfit</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Live Preview Frame Column */}
        <div>
          <AppearancePreview theme={formState} settings={siteState} />
        </div>
      </div>

      <MediaUploaderModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={(url) => setSiteState({ ...siteState, [targetField]: url })}
      />
    </div>
  );
};
