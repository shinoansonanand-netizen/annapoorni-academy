import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { MediaUploaderModal } from '../../components/MediaUploaderModal';
import { Image as ImageIcon, Upload, Copy, Trash2, ExternalLink } from 'lucide-react';

export const MediaLibrary = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [uploaderOpen, setUploaderOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await API.get('/api/admin/media');
      setMediaList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setToastMsg('Image URL copied to clipboard!');
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/api/admin/media/${itemToDelete.id}`);
      setToastMsg('Media asset deleted.');
      setDeleteModalOpen(false);
      fetchMedia();
    } catch (err) {
      alert('Failed to delete media asset');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading Media Library...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Media Library</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Upload and manage website logos, course thumbnails, hero banners, and assets.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setUploaderOpen(true)}>
          <Upload size={18} /> Upload Media Asset
        </button>
      </div>

      {mediaList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#FFFFFF', borderRadius: '12px' }}>
          <ImageIcon size={48} style={{ color: '#94A3B8', marginBottom: '1rem' }} />
          <p style={{ color: '#64748B' }}>No media assets uploaded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {mediaList.map(m => (
            <div key={m.id} className="table-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9' }}>
                <img src={m.file_url} alt={m.alt_text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.original_name}
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {(m.file_size / 1024).toFixed(1)} KB • {m.category}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => handleCopyUrl(m.file_url)}>
                  <Copy size={13} /> Copy URL
                </button>
                <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <ExternalLink size={13} />
                </a>
                <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => { setItemToDelete(m); setDeleteModalOpen(true); }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MediaUploaderModal
        isOpen={uploaderOpen}
        onClose={() => {
          setUploaderOpen(false);
          fetchMedia();
        }}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Media Asset"
        message={`Are you sure you want to permanently delete '${itemToDelete?.original_name}'?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};
