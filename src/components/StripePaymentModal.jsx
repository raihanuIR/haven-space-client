import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CreditCard, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';

const StripePaymentModal = ({ bookingData, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvc: '123',
    cardholder: 'Valued Tenant',
  });
  const navigate = useNavigate();

  if (!isOpen || !bookingData) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Request Payment Intent from Backend
      const { data: paymentRes } = await API.post('/payments/create-payment-intent', {
        amount: bookingData.amount,
        propertyId: bookingData.propertyId,
        propertyTitle: bookingData.propertyName,
      });

      if (!paymentRes.success) {
        throw new Error(paymentRes.message || 'Payment processing initialization failed');
      }

      // Simulate payment network verification delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // 2. Register confirmed booking in database
      const { data: bookingRes } = await API.post('/bookings', {
        propertyId: bookingData.propertyId,
        moveInDate: bookingData.moveInDate,
        contactNumber: bookingData.contactNumber,
        additionalNotes: bookingData.additionalNotes,
        amountPaid: bookingData.amount,
        paymentIntentId: paymentRes.paymentIntentId,
      });

      if (!bookingRes.success) {
        throw new Error(bookingRes.message || 'Failed to record booking');
      }

      // 3. Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/dashboard/tenant');
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>Stripe Secure Checkout</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Payment Confirmed!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your reservation for <strong>{bookingData.propertyName}</strong> has been submitted. Status is currently <strong>Pending</strong> owner review.
            </p>
            <span className="badge badge-approved">Redirecting to My Bookings...</span>
          </div>
        ) : (
          <form onSubmit={handlePay}>
            {error && (
              <div style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Stripe Card Simulator</span>
                <CreditCard size={24} />
              </div>
              <div style={{ fontSize: '1.25rem', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '1rem' }}>
                {cardInfo.cardNumber}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>{cardInfo.cardholder}</span>
                <span>Exp: {cardInfo.expDate}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-input"
                value="4242 4242 4242 4242 (Stripe Test Card)"
                disabled
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Expiration Date</label>
                <input type="text" className="form-input" value="12/28" disabled />
              </div>
              <div className="form-group">
                <label className="form-label">CVC / CVV</label>
                <input type="text" className="form-input" value="123" disabled />
              </div>
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              margin: '1.25rem 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: 600 }}>Total Amount to Charge:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                ${bookingData.amount.toLocaleString()} USD
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              {loading ? (
                <span>Processing Secure Payment...</span>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay ${bookingData.amount.toLocaleString()} with Stripe</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StripePaymentModal;
