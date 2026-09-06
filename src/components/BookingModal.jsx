import React, { useState } from 'react';
import { X, Calendar, Phone, FileText, DollarSign, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ property, isOpen, onClose, onProceedToPayment }) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'Owner';
  const [formData, setFormData] = useState({
    moveInDate: '',
    contactNumber: '',
    additionalNotes: '',
  });
  const [error, setError] = useState('');

  if (!isOpen || !property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOwner) {
      setError('Property owners are not permitted to submit rental bookings. Please log in with a Tenant account.');
      return;
    }
    if (!formData.moveInDate || !formData.contactNumber) {
      setError('Please provide your move-in date and contact telephone number.');
      return;
    }
    setError('');
    onProceedToPayment({
      ...formData,
      propertyId: property._id,
      amount: property.rentPrice,
      propertyName: property.title,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.35rem' }}>Reserve Property</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{property.title}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* User Info (Read only) */}
          <div className="form-grid-2" style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Full Name</span>
              <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Email Address</span>
              <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong>
            </div>
          </div>

          {/* Move-in Date */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Preferred Move-in Date *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
              value={formData.moveInDate}
              onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
            />
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label className="form-label">
              <Phone size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Contact Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 012-3456"
              className="form-input"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            />
          </div>

          {/* Additional Notes */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Special Requests or Notes
            </label>
            <textarea
              rows="3"
              placeholder="e.g., Requesting late afternoon move-in, pet details..."
              className="form-textarea"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            />
          </div>

          {/* Total Calculation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
            borderTop: '1px solid var(--border-color)',
            margin: '1rem 0',
          }}>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Reservation Deposit</span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>100% refundable upon owner rejection</p>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              ${property.rentPrice.toLocaleString()}
            </div>
          </div>

          {isOwner && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>Property owners cannot book properties. Please log in with a Tenant account.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isOwner}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              opacity: isOwner ? 0.6 : 1,
              cursor: isOwner ? 'not-allowed' : 'pointer',
            }}
          >
            {isOwner ? 'Owners Cannot Book' : 'Confirm & Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
