import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

export const MediaUploaderModal = ({ isOpen, onClose, onSelect, category = 'general' }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [altText, setAltText] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/admin/media');
      setMediaList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('alt_text', altText);

    try {
      const res = await API.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedFile(null);
      setAltText('');
      await fetchMedia();
      if (onSelect) onSelect(res.data.file_url);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={20} /> Media Library & Upload
          </h3>
          <button onClick={onClose} style={{ color: '#64748B' }}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Upload Form */}
          <form onSubmit={handleUpload} style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Alt text (optional)"
                className="form-control"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                style={{ maxWidth: '220px' }}
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={uploading || !selectedFile}>
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>

          {/* Media Grid */}
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {loading ? (
              <p>Loading media files...</p>
            ) : mediaList.length === 0 ? (
              <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>No media uploaded yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (onSelect) onSelect(m.file_url);
                      onClose();
                    }}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      background: '#FFFFFF'
                    }}
                  >
                    <img src={m.file_url} alt={m.alt_text} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                    <div style={{ padding: '4px 6px', fontSize: '0.7rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.original_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
