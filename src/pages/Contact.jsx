import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, MessageSquare } from 'lucide-react';
import API from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email format.';
    }
    if (!formData.subject.trim()) errors.subject = 'Please specify a subject.';
    if (!formData.message.trim()) {
      errors.message = 'Please write your message or inquiry.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validate()) return;

    setLoading(true);
    try {
      // Sends message directly to database via POST /api/contact
      const { data } = await API.post('/contact', formData);
      if (data.success) {
        setSuccessMessage(data.message || 'Thank you! Your message has been saved in our database. We will reply promptly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setValidationErrors({});
      } else {
        setErrorMessage(data.message || 'Unable to submit your message.');
      }
    } catch (err) {
      console.error('Contact error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3.5rem' }}>
          <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>
            <MessageSquare size={14} /> Get in Touch
          </span>
          <h1 className="section-title">We'd Love to Hear From You</h1>
          <p className="section-subtitle">
            Have questions about a property, escrow payments, or owner partnerships? Reach out and our team will get back to you within 24 hours.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* Contact Details Card */}
          <div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '2rem',
            }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Direct Inquiries</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="nav-brand-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.2rem' }}>Corporate Office</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      100 Ocean Drive, Suite 400<br />Miami Beach, FL 33139
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="nav-brand-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.2rem' }}>Telephone Support</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+1 (800) 555-RENT (Toll-Free)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="nav-brand-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.2rem' }}>Direct Email</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@rentalhub.com</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="nav-brand-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.2rem' }}>Operating Hours</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Monday – Saturday: 8:00 AM – 8:00 PM EST<br />Sunday: 10:00 AM – 4:00 PM EST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Assurance Notice */}
            <div style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}>
              <CheckCircle2 size={24} color="var(--success)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                <strong>Rapid Response Guarantee:</strong> All tenant and property owner messages are tracked directly in our support database for SLA fulfillment.
              </div>
            </div>
          </div>

          {/* Contact Form with DB Persistence */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(1.5rem, 5vw, 2.5rem)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Send Us a Message</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Fill in the form below. Your message will be recorded immediately into our system.
            </p>

            {successMessage && (
              <div style={{
                background: 'var(--success-bg)',
                color: 'var(--success)',
                border: '1px solid var(--success)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <CheckCircle2 size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                border: '1px solid var(--danger)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <AlertCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                required
                value={formData.name}
                error={validationErrors.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  error={validationErrors.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <Input
                label="Subject"
                placeholder="e.g. Question regarding lease deposit"
                required
                value={formData.subject}
                error={validationErrors.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">
                  Your Message <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Please describe your question or requirement in detail..."
                  className={`form-textarea ${validationErrors.message ? 'input-error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    borderColor: validationErrors.message ? 'var(--danger)' : undefined,
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                  }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                {validationErrors.message && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                    {validationErrors.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={<Send size={18} />}
                style={{ width: '100%' }}
              >
                {loading ? 'Submitting Message...' : 'Submit Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
