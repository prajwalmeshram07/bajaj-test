import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import CreateTicketForm from '../components/CreateTicketForm';
import StatsStrip from '../components/StatsStrip';
import Filters from '../components/Filters';
import { getTickets, createTicket, updateTicketStatus, deleteTicket, getStats } from '../services/api';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [priority, setPriority] = useState('');
  const [breachedOnly, setBreachedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function fetchAll() {
    try {
      const params = {};
      if (priority) params.priority = priority;
      if (breachedOnly) params.breached = 'true';

      const [ticketsRes, statsRes] = await Promise.all([
        getTickets(params),
        getStats()
      ]);
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load tickets. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [priority, breachedOnly]);

  async function handleCreate(formData) {
    const res = await createTicket(formData);
    setTickets(prev => [res.data, ...prev]);
    setShowForm(false);
    // refresh stats
    const statsRes = await getStats();
    setStats(statsRes.data);
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await updateTicketStatus(id, newStatus);
      setTickets(prev => prev.map(t => t._id === id ? res.data : t));
      const statsRes = await getStats();
      setStats(statsRes.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(id);
      setTickets(prev => prev.filter(t => t._id !== id));
      const statsRes = await getStats();
      setStats(statsRes.data);
    } catch (err) {
      alert('Failed to delete ticket');
    }
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>DeskFlow</h1>
          <p className="dash-subtitle">Support Ticket Triage Board</p>
        </div>
        <button className="btn-new" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ New Ticket'}
        </button>
      </header>

      <StatsStrip stats={stats} />

      {showForm && (
        <CreateTicketForm onCreated={handleCreate} />
      )}

      <Filters
        priority={priority}
        onPriorityChange={setPriority}
        breachedOnly={breachedOnly}
        onBreachedChange={setBreachedOnly}
      />

      {loading && <p className="loading-msg">Loading tickets...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <Board
          tickets={tickets}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Dashboard;
