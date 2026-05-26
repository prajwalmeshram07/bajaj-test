// SLA targets in minutes
const SLA_LIMITS = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320
};

function computeSLA(ticket) {
  const start = new Date(ticket.createdAt);
  const end = ticket.resolvedAt ? new Date(ticket.resolvedAt) : new Date();

  const diffMs = end - start;
  const ageMinutes = Math.floor(diffMs / 60000);

  const limit = SLA_LIMITS[ticket.priority];
  const slaBreached = ageMinutes > limit;

  return { ageMinutes, slaBreached };
}

module.exports = { computeSLA, SLA_LIMITS };
