import React from 'react';

function StatsStrip({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-strip">
      <div className="stat-item">
        <span className="stat-num">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-item">
        <span className="stat-num">{stats.open}</span>
        <span className="stat-label">Open</span>
      </div>
      <div className="stat-item">
        <span className="stat-num">{stats.in_progress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-item">
        <span className="stat-num">{stats.resolved}</span>
        <span className="stat-label">Resolved</span>
      </div>
      <div className="stat-item">
        <span className="stat-num">{stats.closed}</span>
        <span className="stat-label">Closed</span>
      </div>
      <div className="stat-item stat-breached">
        <span className="stat-num">{stats.breachedOpen}</span>
        <span className="stat-label">⚠ SLA Breached</span>
      </div>
    </div>
  );
}

export default StatsStrip;
