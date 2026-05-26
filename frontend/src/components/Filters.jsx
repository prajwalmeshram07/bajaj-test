import React from 'react';

function Filters({ priority, onPriorityChange, breachedOnly, onBreachedChange }) {
  return (
    <div className="filters-bar">
      <label className="filter-label">
        Priority:
        <select value={priority} onChange={e => onPriorityChange(e.target.value)}>
          <option value="">All</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <label className="filter-label filter-toggle">
        <input
          type="checkbox"
          checked={breachedOnly}
          onChange={e => onBreachedChange(e.target.checked)}
        />
        Show breached only
      </label>
    </div>
  );
}

export default Filters;
