import React from 'react';

const PRIORITY_COLORS = {
  urgent: '#e53e3e',
  high: '#dd6b20',
  medium: '#d69e2e',
  low: '#38a169'
};

const VALID_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved']
};

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

function formatAge(minutes) {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${Math.floor(minutes / 1440)}d`;
}

function TicketCard({ ticket, onStatusChange, onDelete }) {
  const transitions = VALID_TRANSITIONS[ticket.status] || [];

  return (
    <div className="ticket-card" style={{ borderLeft: `4px solid ${PRIORITY_COLORS[ticket.priority]}` }}>
      <div className="ticket-top">
        <span className="priority-badge" style={{ background: PRIORITY_COLORS[ticket.priority] }}>
          {ticket.priority}
        </span>
        {ticket.slaBreached && (
          <span className="sla-badge">⚠ SLA</span>
        )}
      </div>

      <p className="ticket-subject">{ticket.subject}</p>
      <p className="ticket-email">{ticket.customerEmail}</p>
      <p className="ticket-age">Age: {formatAge(ticket.ageMinutes)}</p>

      <div className="ticket-actions">
        {transitions.map(s => (
          <button
            key={s}
            className="btn-transition"
            onClick={() => onStatusChange(ticket._id, s)}
          >
            → {STATUS_LABELS[s]}
          </button>
        ))}
        <button className="btn-delete" onClick={() => onDelete(ticket._id)}>Delete</button>
      </div>
    </div>
  );
}

export default TicketCard;
