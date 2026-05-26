import React from 'react';
import TicketCard from './TicketCard';

const COLUMNS = ['open', 'in_progress', 'resolved', 'closed'];
const COL_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

function Board({ tickets, onStatusChange, onDelete }) {
  return (
    <div className="board">
      {COLUMNS.map(col => {
        const colTickets = tickets.filter(t => t.status === col);
        return (
          <div key={col} className="board-col">
            <div className="col-header">
              <span className="col-title">{COL_LABELS[col]}</span>
              <span className="col-count">{colTickets.length}</span>
            </div>
            <div className="col-body">
              {colTickets.length === 0
                ? <p className="empty-col">No tickets</p>
                : colTickets.map(t => (
                  <TicketCard
                    key={t._id}
                    ticket={t}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Board;
