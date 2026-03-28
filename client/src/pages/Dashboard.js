import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItems, addItem, deleteItem } from '../api';
import AnimeCard from '../components/AnimeCard';
import AddItemModal from '../components/AddItemModal';
import './Dashboard.css';

const STATUS_FILTERS = ['All', 'Watching', 'Completed', 'Plan to Watch'];

const STATUS_ICONS = {
  All: '🎌',
  Watching: '▶️',
  Completed: '✅',
  'Plan to Watch': '📋',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const res = await getItems();
      setItems(res.data);
    } catch (err) {
      setError('Failed to fetch your list. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async (formData) => {
    const res = await addItem(formData);
    setItems((prev) => [res.data, ...prev]);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      setError('Failed to delete item.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const filtered = filter === 'All' ? items : items.filter((i) => i.status === filter);

  const stats = {
    total: items.length,
    watching: items.filter((i) => i.status === 'Watching').length,
    completed: items.filter((i) => i.status === 'Completed').length,
    planToWatch: items.filter((i) => i.status === 'Plan to Watch').length,
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header glass">
        <div className="header-brand">
          <div className="header-logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5"/>
              <path d="M10 22 L16 10 L22 22" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19 H20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="header-title"><span className="jp-sm">アニメ</span>Tracker</span>
        </div>

        <div className="header-right">
          <div className="user-pill">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <span className="user-name">{user?.username}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="dash-main">
        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card glass">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card glass" style={{'--stat-color': 'var(--watching)'}}>
            <span className="stat-value" style={{color:'var(--watching)'}}>{stats.watching}</span>
            <span className="stat-label">Watching</span>
          </div>
          <div className="stat-card glass" style={{'--stat-color': 'var(--completed)'}}>
            <span className="stat-value" style={{color:'var(--completed)'}}>{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card glass" style={{'--stat-color': 'var(--plan)'}}>
            <span className="stat-value" style={{color:'var(--plan)'}}>{stats.planToWatch}</span>
            <span className="stat-label">Planned</span>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="filter-bar glass">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                className={`filter-btn ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                <span className="filter-icon">{STATUS_ICONS[s]}</span>
                <span>{s}</span>
                {s !== 'All' && (
                  <span className="filter-count">
                    {s === 'Watching' ? stats.watching
                      : s === 'Completed' ? stats.completed
                      : stats.planToWatch}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button className="add-btn" onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add Anime</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="dash-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="load-spinner" />
            <p>Loading your list...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state glass">
            <div className="empty-icon">
              {filter === 'All' ? '🎌' : STATUS_ICONS[filter]}
            </div>
            <h3>{filter === 'All' ? 'Your list is empty' : `No ${filter} anime`}</h3>
            <p>
              {filter === 'All'
                ? 'Start tracking your anime journey!'
                : `Add something to your ${filter} list.`}
            </p>
            {filter === 'All' && (
              <button className="add-btn empty-add" onClick={() => setShowModal(true)}>
                + Add Your First Anime
              </button>
            )}
          </div>
        ) : (
          <div className="anime-grid">
            {filtered.map((item, i) => (
              <AnimeCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                deleting={deletingId === item._id}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
