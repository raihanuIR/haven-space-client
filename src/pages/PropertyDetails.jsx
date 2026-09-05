import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Heart,
  Share2,
  ShieldCheck,
  Star,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock,
  Home,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import StripePaymentModal from '../components/StripePaymentModal';
import ShareModal from '../components/ShareModal';
import LoadingSpinner from '../components/LoadingSpinner';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const fetchPropertyData = async (isSilentRetry = false) => {
    if (!isSilentRetry) {
      setLoading(true);
    }
    setErrorMessage(null);

    const rawId = id ? String(id).trim() : '';
    if (!rawId) {
      setProperty(null);
      setErrorMessage('Invalid property identifier.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Fetch primary property with auto-retry resilience
      let propertyItem = null;
      try {
        const propRes = await API.get(`/properties/${rawId}`);
        if (propRes.data?.success && propRes.data.property) {
          propertyItem = propRes.data.property;
        }
      } catch (firstErr) {
        // If 404, it truly doesn't exist
        if (firstErr.response?.status === 404) {
          setProperty(null);
          setErrorMessage('Property not found. The listing may have been unlisted or removed.');
          setLoading(false);
          return;
        }

        // On network error or 500 (backend waking up / connecting to Atlas), auto-retry once after 800ms
        console.warn('[PropertyDetails] First attempt failed, retrying in 800ms...', firstErr.message);
        await new Promise((resolve) => setTimeout(resolve, 800));
        const retryRes = await API.get(`/properties/${rawId}`);
        if (retryRes.data?.success && retryRes.data.property) {
          propertyItem = retryRes.data.property;
        }
      }

      if (!propertyItem) {
        setProperty(null);
        setErrorMessage('Unable to load property details. The server may still be connecting.');
        setLoading(false);
        return;
      }

      setProperty(propertyItem);
      setLoading(false);

      // Step 2: Fetch secondary reviews & favorites non-blocking so they NEVER crash the property view
      try {
        const reviewRes = await API.get(`/reviews/property/${rawId}`);
        if (reviewRes.data?.success && Array.isArray(reviewRes.data.reviews)) {
          setReviews(reviewRes.data.reviews);
        }
      } catch (revErr) {
        console.warn('[PropertyDetails] Non-blocking review fetch warning:', revErr.message);
      }

      if (isAuthenticated) {
        try {
          const favRes = await API.get('/favorites');
          if (favRes.data?.success && Array.isArray(favRes.data.favorites)) {
            const hasFav = favRes.data.favorites.some(
              (f) => f.propertyId?._id === rawId || f.propertyId === rawId
            );
            setIsFavorite(hasFav);
          }
        } catch (favErr) {
          console.warn('[PropertyDetails] Non-blocking favorite fetch warning:', favErr.message);
        }
      }
    } catch (err) {
      console.error('[PropertyDetails] Error fetching property:', err);
      setProperty(null);
      setErrorMessage(
        err.response?.status === 404
          ? 'Property not found. The listing may have been unlisted or removed.'
          : 'Unable to connect to the rental service. Please check your internet connection or try again.'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await API.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await API.post('/favorites', { propertyId: id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Toggle favorite error:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleProceedToPayment = (bookingDetails) => {
    setConfirmedBookingData(bookingDetails);
    setBookingModalOpen(false);
    setPaymentModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const { data } = await API.post('/reviews', {
        propertyId: id,
        rating: newRating,
        comment: newComment.trim(),
      });

      if (data.success) {
        setReviews([data.review, ...reviews]);
        setNewComment('');
        setReviewMessage('Thank you! Your review has been published.');
        setTimeout(() => setReviewMessage(''), 4000);
      }
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading property details..." />;
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <AlertCircle size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1.25rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Listing Unavailable</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            {errorMessage || 'The requested property could not be loaded at this moment.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => fetchPropertyData(false)} className="btn btn-primary">
              Try Again
            </button>
            <button onClick={() => navigate('/properties')} className="btn btn-secondary">
              Back to Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Title & Quick Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-approved">{property.propertyType}</span>
              <span className="badge badge-role">Verified Owner Listing</span>
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>{property.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <MapPin size={16} color="var(--accent-primary)" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShareModalOpen(true)}
              className="btn btn-secondary"
              title="Share property listing"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`btn ${isFavorite ? 'btn-danger' : 'btn-secondary'}`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="property-gallery-main">
            <img
              src={property.images[selectedImage] || property.images[0]}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
            />
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {property.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '100px',
                    height: '70px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid var(--accent-primary)' : '2px solid transparent',
                    opacity: selectedImage === idx ? 1 : 0.7,
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Two-Column Layout: Details + Booking Card */}
        <div className="property-details-layout">
          {/* Left Column: Specs, Description, Amenities, Reviews */}
          <div>
            {/* Key Specs Card */}
            <div className="specs-summary-grid">
              <div>
                <Bed size={24} color="var(--accent-primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem' }}>{property.bedrooms} Bedrooms</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Comfortable capacity</span>
              </div>
              <div>
                <Bath size={24} color="var(--accent-primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem' }}>{property.bathrooms} Bathrooms</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Full & half baths</span>
              </div>
              <div>
                <Maximize2 size={24} color="var(--accent-primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem' }}>{property.propertySize} sqft</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Interior living area</span>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.45rem', marginBottom: '1rem' }}>About this Property</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '1rem' }}>Offered Amenities</h2>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        background: 'var(--bg-tertiary)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      <CheckCircle size={16} color="var(--success)" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Features */}
            {property.extraFeatures && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '1rem' }}>Special Features</h2>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{property.extraFeatures}</p>
                </div>
              </div>
            )}

            {/* Review System Section */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', marginTop: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.45rem' }}>
                  Tenant Reviews & Ratings ({reviews.length})
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={18} fill="#f59e0b" />
                  <span>
                    {reviews.length > 0
                      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                      : '5.0'} / 5.0
                  </span>
                </div>
              </div>

              {/* Review Form for logged in tenant */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Write a Verified Review</h3>
                {reviewMessage && (
                  <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {reviewMessage}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={24}
                          onClick={() => setNewRating(star)}
                          fill={newRating >= star ? '#f59e0b' : 'none'}
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Experience & Feedback</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Share your stay experience, owner responsiveness, neighborhood vibe..."
                      className="form-textarea"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn btn-primary btn-sm"
                  >
                    {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Be the first tenant to leave a review for this property!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--accent-gradient)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}>
                            {rev.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem' }}>{rev.name}</h4>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{rev.email}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {rev.comment}
                      </p>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking & Owner Summary Card */}
          <div>
            <div style={{
              position: 'sticky',
              top: '100px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}>
              {/* Booking Action Box */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-xl)',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--accent-primary)' }}>
                    ${property.rentPrice.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    /{property.rentType?.toLowerCase()}
                  </span>
                </div>

                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status</span>
                    <span className="badge badge-approved">Available for Booking</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Lease Type</span>
                    <strong>{property.rentType} Term</strong>
                  </div>
                </div>

                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  Book Property Now
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Reservation deposit processed securely via Stripe.
                </p>
              </div>

              {/* Owner Info Card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Listed by Verified Owner</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}>
                    {property.owner?.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <strong style={{ display: 'block' }}>{property.owner?.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{property.owner?.email}</span>
                  </div>
                </div>

                {property.owner?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Phone size={15} color="var(--accent-primary)" />
                    <span>{property.owner.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        property={property}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        bookingData={confirmedBookingData}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />

      {/* Share Modal */}
      <ShareModal
        property={property}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};

export default PropertyDetails;
