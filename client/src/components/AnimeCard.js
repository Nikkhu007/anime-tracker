import React from 'react';
import './AnimeCard.css';

const STATUS_CONFIG = {
  Watching:       { color: 'var(--watching)', bg: 'rgba(0,212,170,0.12)',  border: 'rgba(0,212,170,0.25)',  icon: '▶' },
  Completed:      { color: 'var(--completed)', bg: 'rgba(255,209,102,0.12)', border: 'rgba(255,209,102,0.25)', icon: '✓' },
  'Plan to Watch':{ color: 'var(--plan)',      bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)', icon: '◷' },
};

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 10; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= rating ? 'filled' : 'empty'}`}
      >★</span>
    );
  }
  return <div className="star-row">{stars}</div>;
}

export default function AnimeCard({ item, onDelete, deleting, index }) {
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Plan to Watch'];

  return (
    <div
      className="anime-card glass"
      style={{
        animationDelay: `${index * 0.06}s`,
        opacity: 0,
        animation: `fadeInUp 0.45s ease ${index * 0.06}s forwards`,
      }}
    >
      {/* Top accent bar */}
      <div className="card-accent" style={{ background: cfg.color }} />

      <div className="card-body">
        {/* Title */}
        <h3 className="card-title" title={item.title}>{item.title}</h3>

        {/* Status badge */}
        <span
          className="status-badge"
          style={{
            color: cfg.color,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
          }}
        >
          <span className="status-icon">{cfg.icon}</span>
          {item.status}
        </span>

        {/* Rating */}
        <div className="card-rating">
          <StarRating rating={item.rating} />
          <span className="rating-num">
            {item.rating > 0 ? `${item.rating}/10` : 'Not rated'}
          </span>
        </div>

        {/* Date */}
        <span className="card-date">
          Added {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </span>
      </div>

      {/* Delete button */}
      <button
        className="card-delete"
        onClick={() => onDelete(item._id)}
        disabled={deleting}
        title="Remove"
        aria-label="Delete item"
      >
        {deleting ? (
          <span className="delete-spinner" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19,6l-1,14H6L5,6"/>
            <path d="M10,11v6M14,11v6"/>
            <path d="M9,6V4h6v2"/>
          </svg>
        )}
      </button>
    </div>
  );
}
