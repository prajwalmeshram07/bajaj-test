import React, { useState } from 'react';

const defaultForm = {
  subject: '',
  description: '',
  customerEmail: '',
  priority: 'medium'
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function CreateTicketForm({ onCreated }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.customerEmail.trim()) {
      errs.customerEmail = 'Email is required';
    } else if (!validateEmail(form.customerEmail)) {
      errs.customerEmail = 'Enter a valid email';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await onCreated(form);
      setForm(defaultForm);
    } catch (err) {
      setErrors({ api: err.response?.data?.error || 'Failed to create ticket' });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  return (
    <div className="create-form-wrapper">
      <h2>New Ticket</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label>Subject</label>
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Brief issue summary"
          />
          {errors.subject && <span className="field-error">{errors.subject}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the issue in detail"
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Customer Email</label>
          <input
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
            placeholder="customer@example.com"
          />
          {errors.customerEmail && <span className="field-error">{errors.customerEmail}</span>}
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {errors.api && <p className="api-error">{errors.api}</p>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
}

export default CreateTicketForm;
