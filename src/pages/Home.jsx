import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Building,
  KeyRound,
  DollarSign,
  HelpCircle,
  ChevronDown,
  Mail,
  Check,
} from 'lucide-react';
import API from '../services/api';
import PropertyCard from '../components/PropertyCard';
import ShareModal from '../components/ShareModal';
import SkeletonCard from '../components/ui/SkeletonCard';
import Button from '../components/ui/Button';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareProperty, setShareProperty] = useState(null);

  // How it works active tab (Tenant vs Owner)
  const [howItWorksTab, setHowItWorksTab] = useState('tenant');

  // FAQ Accordion open index
  const [openFaq, setOpenFaq] = useState(0);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
        const [propRes, reviewRes, statsRes] = await Promise.all([
          API.get('/properties/featured'),
          API.get('/reviews/featured'),
          API.get('/properties/stats/summary'),
        ]);

        if (propRes.data.success) {
          setFeaturedProperties(propRes.data.properties);
        }
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
        if (statsRes.data.success) {
          setPlatformStats(statsRes.data.stats);
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  const categories = [
    { title: 'Apartments', type: 'Apartment', count: '120+ Listings', icon: '🏢', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
    { title: 'Luxury Villas', type: 'Villa', count: '45+ Listings', icon: '🏡', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80' },
    { title: 'Penthouses', type: 'Penthouse', count: '30+ Listings', icon: '✨', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
    { title: 'Urban Studios', type: 'Studio', count: '85+ Listings', icon: '🌆', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80' },
  ];

  const topLocations = [
    { city: 'Miami, FL', properties: '320+ Properties', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=600&q=80' },
    { city: 'Austin, TX', properties: '240+ Properties', image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=600&q=80' },
    { city: 'San Francisco, CA', properties: '180+ Properties', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80' },
    { city: 'New York, NY', properties: '450+ Properties', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
  ];

  const faqs = [
    {
      q: 'How does the Stripe reservation deposit work?',
      a: 'When you submit a reservation, your funds are safely tokenized using Stripe escrow. The property owner has 48 hours to confirm your digital booking. If accepted, your deposit secures the lease; if declined, the full amount is immediately refunded.',
    },
    {
      q: 'Are all property listings verified before being published?',
      a: 'Yes. Every property undergoes human administrative moderation. We inspect deed ownership credentials, accurate photo representations, and pricing compliance before allowing a listing to go live.',
    },
    {
      q: 'Can I tour properties digitally before booking?',
      a: 'Absolutely. Detailed listings include high-resolution photography, architectural specs, and direct contact options with verified property owners to schedule virtual or in-person walk-throughs.',
    },
    {
      q: 'What fees are charged to tenants and owners?',
      a: 'RentalHub charges zero hidden broker commissions. Tenants pay only the agreed rent price and standard payment gateway fees. Owners retain 100% of their published lease earnings without deduction.',
    },
  ];

  return (
    <div className="page-wrapper">
      {/* 1. Hero Section (Bounded 65vh Height with Interactive Live Search & Counter) */}
      <section
        className="hero-banner"
        style={{
          minHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          padding: '3.5rem 0',
        }}
      >
        <div className="container">
          <div className="hero-grid" style={{ alignItems: 'center' }}>
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-approved" style={{ marginBottom: '1rem' }}>
                <Sparkles size={14} /> Next-Gen Escrow Rental Marketplace
              </span>
              <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)', lineHeight: 1.15, marginBottom: '1rem' }}>
                Find Your Ideal Rental Sanctuary with <span className="gradient-text">Complete Peace of Mind</span>
              </h1>
              <p className="hero-description" style={{ marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                Explore verified luxury apartments, schedule digital tours, and execute secure reservation deposits powered by Stripe. Zero broker markups.
              </p>

              {/* Banner Search Box */}
              <div className="banner-search-box">
                <form onSubmit={handleSearchSubmit} className="search-inputs-grid">
                  <div className="form-group search-group-location" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '3px' }} /> Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Miami, Austin, New York..."
                      className="form-input"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group search-group-type" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Property Type</label>
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

                  <div className="form-group search-group-min-price" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Min Price</label>
                    <input
                      type="number"
                      placeholder="$ Min"
                      className="form-input"
                      value={searchParams.minPrice}
                      onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                    />
                  </div>

                  <div className="form-group search-group-max-price" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Price</label>
                    <input
                      type="number"
                      placeholder="$ Max"
                      className="form-input"
                      value={searchParams.maxPrice}
                      onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg search-submit-btn">
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Hero Image & Interactive Floating Trust Metrics */}
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
                style={{ height: '420px', objectFit: 'cover' }}
              />
              <div className="hero-floating-card">
                <div className="nav-brand-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>100% Verified Escrow</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {platformStats?.totalProperties || '120+'} Live Verified Residences
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Platform Statistics Section (Real Backend Data) */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="market-stats-grid">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'Outfit' }}>
                {platformStats ? `${platformStats.totalProperties}+` : '150+'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Verified Listings</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-secondary)', fontFamily: 'Outfit' }}>
                {platformStats ? `${platformStats.satisfactionRate}%` : '99.2%'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Tenant Satisfaction</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'Outfit' }}>
                {platformStats ? `$${(platformStats.escrowVolume / 1000).toFixed(0)}k+` : '$85k+'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Stripe Escrow Protected</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'Outfit' }}>
                {platformStats ? `${platformStats.totalBookings}+` : '60+'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Successful Leases</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Featured Items (4 Cards per row on Desktop + Skeleton Loaders) */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>Curated Portfolios</span>
            <h2 className="section-title">Featured Approved Properties</h2>
            <p className="section-subtitle">
              Verified homes available for immediate reservation with transparent monthly leasing.
            </p>
          </div>

          {loading ? (
            <div className="properties-grid">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No featured properties available at this time.
            </div>
          ) : (
            <motion.div
              className="properties-grid"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {featuredProperties.slice(0, 8).map((prop) => (
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
              <span>Browse All Listings in Catalog</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Categories & Architectural Typology */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>Classifications</span>
            <h2 className="section-title">Explore by Property Architecture</h2>
            <p className="section-subtitle">Choose from luxury penthouses, boutique studios, and high-amenity residences.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <div
                key={i}
                onClick={() => navigate(`/properties?propertyType=${cat.type}`)}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.15) 70%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                  color: '#ffffff',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                  <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '0.2rem' }}>{cat.title}</h3>
                  <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Platform Features & Why Choose Us */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>Built for Trust</span>
            <h2 className="section-title">Engineered for Frictionless Rentals</h2>
            <p className="section-subtitle">
              We eliminate traditional leasing headaches with verified identity records, instant digital escrow, and guaranteed clarity.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Strict Identity Verification</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Every single property must pass administrative moderation before appearing on our catalog.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant Stripe Escrow</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Reservation deposits are processed with cryptographic security and held safely until booking approval.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Zero Hidden Surcharges</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No surprise broker commissions or hidden fees. What you see is what you pay.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Authentic Tenant Reviews</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Star ratings and qualitative feedback submitted exclusively by verified residents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works (Interactive Dual Tab: Renters vs Owners) */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '940px' }}>
          <div className="section-header">
            <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>Transparent Process</span>
            <h2 className="section-title">How RentalHub Works</h2>
            <p className="section-subtitle">Streamlined digital leasing in three simple steps.</p>

            <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '0.35rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setHowItWorksTab('tenant')}
                className={`btn btn-sm ${howItWorksTab === 'tenant' ? 'btn-primary' : ''}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1.4rem', border: 'none', background: howItWorksTab === 'tenant' ? undefined : 'transparent' }}
              >
                For Tenants
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('owner')}
                className={`btn btn-sm ${howItWorksTab === 'owner' ? 'btn-primary' : ''}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1.4rem', border: 'none', background: howItWorksTab === 'owner' ? undefined : 'transparent' }}
              >
                For Property Owners
              </button>
            </div>
          </div>

          {howItWorksTab === 'tenant' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontWeight: 800, fontSize: '1.2rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Discover & Filter</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Search by location, price range, and typology. Inspect verified images, amenities, and authentic tenant reviews.
                </p>
              </div>

              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontWeight: 800, fontSize: '1.2rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Reserve with Stripe</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Pick move-in dates and execute your reservation deposit via Stripe escrow with instantaneous receipts.
                </p>
              </div>

              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontWeight: 800, fontSize: '1.2rem' }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Get Keys & Settle In</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Connect with the verified owner, coordinate digital lockbox access, and enjoy your new home.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontWeight: 800, fontSize: '1.2rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Publish Your Property</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Submit high-resolution photography, property specs, pricing, and available lease terms from your Owner portal.
                </p>
              </div>

              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontWeight: 800, fontSize: '1.2rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Quick Admin Audit</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Our administrative moderation team verifies your listing within hours to ensure instant marketplace credibility.
                </p>
              </div>

              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontWeight: 800, fontSize: '1.2rem' }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Accept Bookings & Earn</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Review tenant profiles, approve reservation requests, and receive automated payouts directly to your bank.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. Top Metropolitan Destinations */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>Prime Locations</span>
            <h2 className="section-title">Top Rental Metros</h2>
            <p className="section-subtitle">
              Discover verified sanctuaries across the country's fastest growing tech and residential hubs.
            </p>
          </div>

          <div className="locations-grid">
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

      {/* 8. Customer Testimonials & Reviews (Real Backend Data) */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>Tenant Testimonials</span>
            <h2 className="section-title">Loved by Discerning Renters</h2>
            <p className="section-subtitle">
              Read authentic feedback from tenants who secured their homes through our platform.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.slice(0, 4).map((rev, index) => (
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
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6, flexGrow: 1 }}>
                  "{rev.comment}"
                </p>
                <div className="review-user-info" style={{ marginTop: 'auto' }}>
                  <img
                    src={rev.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={rev.name}
                    className="review-avatar"
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{rev.name}</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Verified Resident</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion & Newsletter Subscription CTA */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="section-header">
            <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>
              <HelpCircle size={14} /> Clear Answers
            </span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about payments, verifications, and leases.</p>
          </div>

          {/* Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '1.05rem',
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                        color: 'var(--text-muted)',
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Newsletter Box */}
          <div style={{
            background: 'var(--accent-gradient)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h3 style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.75rem' }}>
              Join 12,000+ Modern Renters
            </h3>
            <p style={{ maxWidth: '540px', margin: '0 auto 1.75rem auto', opacity: 0.9, fontSize: '0.975rem' }}>
              Get weekly alerts on newly approved listings, rent price drops, and off-market opportunities.
            </p>

            {subscribed ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '0.85rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
              }}>
                <Check size={18} />
                <span>You're subscribed! Welcome to the RentalHub community.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: '1 1 240px',
                    padding: '0.85rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: '#ffffff',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    padding: '0.85rem 1.5rem',
                    border: 'none',
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
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
