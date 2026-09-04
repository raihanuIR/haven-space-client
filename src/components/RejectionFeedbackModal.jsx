import React, { useState } from 'react';
import { X, AlertTriangle, MessageSquare, Send } from 'lucide-react';

const RejectionFeedbackModal = ({
  isOpen,
  onClose,
  mode = 'view', // 'view' for owner, 'create' for admin
  property,
  onSubmitFeedback,
}) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please enter detailed feedback explaining why this listing was rejected.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmitFeedback(property._id, feedback.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit rejection feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={22} color="var(--danger)" />
            <h3 style={{ fontSize: '1.25rem' }}>
              {mode === 'view' ? 'Rejection Reason & Feedback' : 'Reject Property Listing'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Property: <strong style={{ color: 'var(--text-primary)' }}>{property.title}</strong>
          </p>
        </div>

        {mode === 'view' ? (
          <div>
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
                <MessageSquare size={16} />
                <span>Admin Feedback:</span>
              </div>
              <p style={{ fontStyle: 'italic' }}>
                "{property.rejectionFeedback || 'No specific feedback notes provided by the review team.'}"
              </p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              You can update your listing details or upload new photos to address this feedback and request a re-review.
            </p>
            <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Feedback for Property Owner *</label>
              <textarea
                required
                rows="4"
                placeholder="Explain the reason for rejection (e.g. invalid documentation, missing images, inaccurate pricing)..."
                className="form-textarea"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-danger"
                style={{ flex: 1, gap: '0.5rem' }}
              >
                <Send size={16} />
                <span>{submitting ? 'Submitting...' : 'Reject Property'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RejectionFeedbackModal;
