import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  MapPin,
  TrendingUp,
  Star,
  ArrowRight,
  Home as HomeIcon,
  Users,
  CheckCircle,
} from 'lucide-react';
import API from '../services/api';
import PropertyCard from '../components/PropertyCard';
import ShareModal from '../components/ShareModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareProperty, setShareProperty] = useState(null);

  // Search Bar State
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: 'All',
    minPrice: '',
    maxPrice: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch 6 featured properties using MongoDB .limit(6)
        const [propRes, reviewRes] = await Promise.all([
          API.get('/properties/featured'),
          API.get('/reviews/featured'),
        ]);

        if (propRes.data.success) {
          setFeaturedProperties(propRes.data.properties);
        }
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
      } catch (err) {
        console.error('Home data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.location) query.set('location', searchParams.location);
    if (searchParams.propertyType && searchParams.propertyType !== 'All') {
      query.set('propertyType', searchParams.propertyType);
    }
    if (searchParams.minPrice) query.set('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) query.set('maxPrice', searchParams.maxPrice);

    navigate(`/properties?${query.toString()}`);
  };

  const topLocations = [
    { city: 'Miami, FL', properties: '320+ Properties', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=600&q=80' },
    { city: 'Austin, TX', properties: '240+ Properties', image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=600&q=80' },
    { city: 'San Francisco, CA', properties: '180+ Properties', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80' },
    { city: 'New York, NY', properties: '450+ Properties', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="page-wrapper">
      {/* 1. Banner Section with Framer Motion and Multi-Field Search */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-grid">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-approved" style={{ marginBottom: '1rem' }}>
                <Sparkles size={14} /> Next-Gen Rental Marketplace
              </span>
              <h1>
                Find Your Ideal Rental Sanctuary with <span className="gradient-text">Complete Peace of Mind</span>
              </h1>
              <p className="hero-description">
                Browse verified premium residences, schedule digital viewings, and execute secure reservation deposits powered by Stripe. Direct owner connections with zero hidden fees.
              </p>

              {/* Banner Search Box */}
              <motion.div
                className="banner-search-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleSearchSubmit} className="search-inputs-grid">
                  {/* Location Input */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Miami, Austin, New York..."
                      className="form-input"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    />
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Property Type</label>
                    <select
                      className="form-select"
                      value={searchParams.propertyType}
                      onChange={(e) => setSearchParams({ ...searchParams, propertyType: e.target.value })}
                    >
                      <option value="All">All Types</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Studio">Studio</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Condo">Condo</option>
                    </select>
                  </div>

                  {/* Min Price */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Min Price</label>
                    <input
                      type="number"
                      placeholder="$ Min"
                      className="form-input"
                      value={searchParams.minPrice}
                      onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                    />
                  </div>

                  {/* Max Price */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Max Price</label>
                    <input
                      type="number"
                      placeholder="$ Max"
                      className="form-input"
                      value={searchParams.maxPrice}
                      onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                    />
                  </div>

                  {/* Search Button */}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ height: '48px', padding: '0 1.5rem' }}>
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </form>
              </motion.div>
            </motion.div>

            {/* Hero Image & Floating Metric Card */}
            <motion.div
              className="hero-image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Modern Architecture"
                className="hero-image-main"
              />
              <div className="hero-floating-card">
                <div className="nav-brand-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>100% Verified</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Direct Owner Verification & Stripe Escrow</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Featured Properties Section (6 approved properties using MongoDB limit) */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>Curated Selections</span>
            <h2 className="section-title">Featured Approved Properties</h2>
            <p className="section-subtitle">
              Handpicked verified properties available for immediate booking and reservation.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured listings..." />
          ) : featuredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No featured properties found currently.
            </div>
          ) : (
            <motion.div
              className="properties-grid"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {featuredProperties.map((prop) => (
                <PropertyCard
                  key={prop._id}
                  property={prop}
                  onShare={(p) => setShareProperty(p)}
                />
              ))}
            </motion.div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => navigate('/properties')} className="btn btn-secondary btn-lg" style={{ gap: '0.65rem' }}>
              <span>Explore All Properties</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>Why RentalHub</span>
            <h2 className="section-title">Engineered for Seamless Rentals</h2>
            <p className="section-subtitle">
              We eliminate traditional leasing friction with digital workflows, transparent fees, and guaranteed buyer protection.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Verified Listings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Every single property undergoes administrative verification before being visible on our marketplace.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Instant Stripe Escrow</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Secure payment handling with instant receipts and automatic transaction tracking for complete clarity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Zero Hidden Surcharges</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                What you see is what you pay. Transparent monthly, weekly, or daily rental pricing agreed with owners.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Real Tenant Feedback</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Authentic star reviews and comments from real tenants who actually resided in the listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Reviews Section (4 good tenant reviews) */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>Tenant Testimonials</span>
            <h2 className="section-title">Loved by Thousands of Tenants</h2>
            <p className="section-subtitle">
              Read how renters found their dream homes without the usual stress and hassle.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev, index) => (
              <motion.div
                key={rev._id || index}
                className="review-card"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="review-stars">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{rev.comment}"
                </p>
                <div className="review-user-info" style={{ marginTop: 'auto' }}>
                  <img
                    src={rev.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={rev.name}
                    className="review-avatar"
                  />
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>{rev.name}</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Verified Tenant</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Extra Section 1: Top Locations */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>Explore Metros</span>
            <h2 className="section-title">Top Rental Destinations</h2>
            <p className="section-subtitle">
              Find prime listings across America's most dynamic tech, coastal, and urban hubs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {topLocations.map((loc, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(`/properties?location=${encodeURIComponent(loc.city.split(',')[0])}`)}
                style={{
                  position: 'relative',
                  height: '260px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <img
                  src={loc.image}
                  alt={loc.city}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.1) 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                  color: '#ffffff',
                }}>
                  <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{loc.city}</h3>
                  <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{loc.properties}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Extra Section 2: Market Statistics & Platform Trust */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            background: 'var(--accent-gradient)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h2 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '1rem' }}>
              The Marketplace Trusted by Modern Renters
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto 3rem auto', fontSize: '1.1rem', opacity: 0.9 }}>
              From boutique studios to expansive waterfront penthouses, our platform manages end-to-end leasing with exceptional satisfaction.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
              maxWidth: '900px',
              margin: '0 auto',
            }}>
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit' }}>1,800+</div>
                <div style={{ opacity: 0.85, fontSize: '0.95rem' }}>Verified Listings</div>
              </div>
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit' }}>98.6%</div>
                <div style={{ opacity: 0.85, fontSize: '0.95rem' }}>Tenant Satisfaction</div>
              </div>
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit' }}>$4.2M+</div>
                <div style={{ opacity: 0.85, fontSize: '0.95rem' }}>Processed Escrow</div>
              </div>
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit' }}>24/7</div>
                <div style={{ opacity: 0.85, fontSize: '0.95rem' }}>Dedicated Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        property={shareProperty}
        isOpen={!!shareProperty}
        onClose={() => setShareProperty(null)}
      />
    </div>
  );
};

export default Home;
