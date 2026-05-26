import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function getTickets(params = {}) {
  return api.get('/tickets', { params });
}

export function createTicket(data) {
  return api.post('/tickets', data);
}

export function updateTicketStatus(id, status) {
  return api.patch(`/tickets/${id}`, { status });
}

export function deleteTicket(id) {
  return api.delete(`/tickets/${id}`);
}

export function getStats() {
  return api.get('/tickets/stats');
}
