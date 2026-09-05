import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CreditCard, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../services/api';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const isRealStripeKey = stripePublishableKey.startsWith('pk_test_') || stripePublishableKey.startsWith('pk_live_');
const stripePromise = isRealStripeKey ? loadStripe(stripePublishableKey) : null;

const CheckoutForm = ({ bookingData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

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

      let confirmedPaymentId = paymentRes.paymentIntentId;

      // 2. If real Stripe is initialized, confirm card payment through Stripe network
      if (stripe && elements && paymentRes.clientSecret && !paymentRes.isMock) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card entry form not found');
        }

        const stripeResult = await stripe.confirmCardPayment(paymentRes.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Valued Tenant',
            },
          },
        });

        if (stripeResult.error) {
          throw new Error(stripeResult.error.message || 'Payment authorization failed');
        }

        confirmedPaymentId = stripeResult.paymentIntent.id;
      } else {
        // Simulated network delay for fallback
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }

      // 3. Register confirmed booking in database
      const { data: bookingRes } = await API.post('/bookings', {
        propertyId: bookingData.propertyId,
        moveInDate: bookingData.moveInDate,
        contactNumber: bookingData.contactNumber,
        additionalNotes: bookingData.additionalNotes,
        amountPaid: bookingData.amount,
        paymentIntentId: confirmedPaymentId,
      });

      if (!bookingRes.success) {
        throw new Error(bookingRes.message || 'Failed to record booking');
      }

      // 4. Trigger celebration confetti
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

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Payment Confirmed!</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Your reservation for <strong>{bookingData.propertyName}</strong> has been submitted. Status is currently <strong>Pending</strong> owner review.
        </p>
        <span className="badge badge-approved">Redirecting to My Bookings...</span>
      </div>
    );
  }

  return (
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

      {/* Credit Card Details Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#ffffff',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.85, fontWeight: 600 }}>
            {isRealStripeKey ? 'Stripe Official Test Gateway' : 'Stripe Card Simulator'}
          </span>
          <CreditCard size={22} />
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
          Test Card: <code style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>4242 4242 4242 4242</code>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.75 }}>
          <span>Exp: Any future date (e.g. 12/28)</span>
          <span>CVC: Any 3 digits</span>
        </div>
      </div>

      {/* Real Stripe Card Element or Simulator Input */}
      {isRealStripeKey ? (
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>Card Information</label>
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '15px',
                    color: '#f9fafb',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                    iconColor: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              className="form-input"
              value="4242 4242 4242 4242 (Stripe Test Card)"
              disabled
            />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Expiration Date</label>
              <input type="text" className="form-input" value="12/28" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">CVC / CVV</label>
              <input type="text" className="form-input" value="123" disabled />
            </div>
          </div>
        </>
      )}

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
          <span>Processing Stripe Payment...</span>
        ) : (
          <>
            <Lock size={16} />
            <span>Pay ${bookingData.amount.toLocaleString()} with Stripe</span>
          </>
        )}
      </button>
    </form>
  );
};

const StripePaymentModal = ({ bookingData, isOpen, onClose }) => {
  if (!isOpen || !bookingData) return null;

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

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm bookingData={bookingData} onClose={onClose} />
          </Elements>
        ) : (
          <CheckoutForm bookingData={bookingData} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default StripePaymentModal;
