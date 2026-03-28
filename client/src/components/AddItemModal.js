import React, { useState, useEffect, useRef } from 'react';
import './AddItemModal.css';

const STATUSES = ['Plan to Watch', 'Watching', 'Completed'];

export default function AddItemModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', status: 'Plan to Watch', rating: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    // Trap body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      await onAdd({ ...form, title: form.title.trim(), rating: Number(form.rating) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box glass">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">+</span>
            Add to List
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="modal-field">
            <label htmlFor="title">Anime / Movie Title</label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Attack on Titan, Your Name..."
              maxLength={120}
            />
          </div>

          {/* Status */}
          <div className="modal-field">
            <label htmlFor="status">Status</label>
            <div className="status-selector">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`status-opt ${form.status === s ? 'selected' : ''} status-${s.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setForm({ ...form, status: s })}
                >
                  {s === 'Watching' ? '▶ Watching'
                    : s === 'Completed' ? '✓ Completed'
                    : '◷ Plan to Watch'}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="modal-field">
            <label>
              Rating
              <span className="rating-display">
                {form.rating > 0 ? `${form.rating} / 10` : 'Not rated'}
              </span>
            </label>
            <div className="star-picker">
              {[...Array(10)].map((_, i) => {
                const val = i + 1;
                return (
                  <button
                    key={val}
                    type="button"
                    className={`star-pick ${val <= (hoverRating || form.rating) ? 'lit' : ''}`}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setForm({ ...form, rating: form.rating === val ? 0 : val })}
                    title={`${val}/10`}
                  >★</button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && <div className="modal-error">{error}</div>}

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : '+ Add to List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
