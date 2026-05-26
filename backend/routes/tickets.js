const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { computeSLA } = require('../utils/sla');

// valid forward/backward transitions
const TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved']
};

function attachSLA(ticket) {
  const plain = ticket.toObject();
  const { ageMinutes, slaBreached } = computeSLA(plain);
  return { ...plain, ageMinutes, slaBreached };
}

// POST /tickets — create a new ticket
router.post('/', async (req, res) => {
  const { subject, description, customerEmail, priority } = req.body;

  if (!subject || !description || !customerEmail) {
    return res.status(400).json({ error: 'subject, description, and customerEmail are required' });
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${validPriorities.join(', ')}` });
  }

  try {
    const ticket = new Ticket({ subject, description, customerEmail, priority });
    await ticket.save();
    res.status(201).json(attachSLA(ticket));
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /tickets — list all tickets with optional filters
router.get('/', async (req, res) => {
  const { status, priority, breached } = req.query;
  const filter = {};

  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  const validPriorities = ['low', 'medium', 'high', 'urgent'];

  if (status) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status filter' });
    }
    filter.status = status;
  }

  if (priority) {
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority filter' });
    }
    filter.priority = priority;
  }

  try {
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    let result = tickets.map(attachSLA);

    if (breached === 'true') {
      result = result.filter(t => t.slaBreached);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET /tickets/stats
router.get('/stats', async (req, res) => {
  try {
    const all = await Ticket.find();
    const withSLA = all.map(attachSLA);

    const stats = {
      total: all.length,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      breachedOpen: 0
    };

    withSLA.forEach(t => {
      if (t.status === 'open') stats.open++;
      if (t.status === 'in_progress') stats.in_progress++;
      if (t.status === 'resolved') stats.resolved++;
      if (t.status === 'closed') stats.closed++;
      if (t.slaBreached && t.status !== 'closed') stats.breachedOpen++;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

// PATCH /tickets/:id — update status
router.patch('/:id', async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  if (!status) {
    return res.status(400).json({ error: 'status field is required' });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const allowed = TRANSITIONS[ticket.status];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Cannot move from '${ticket.status}' to '${status}'. Allowed: ${allowed.join(', ')}`
      });
    }

    // handle resolvedAt
    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (ticket.status === 'resolved' && status === 'in_progress') {
      ticket.resolvedAt = null;
    }

    ticket.status = status;
    await ticket.save();

    res.json(attachSLA(ticket));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// DELETE /tickets/:id
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router;
