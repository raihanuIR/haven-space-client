import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Heart,
  User,
  Trash2,
  Eye,
  ExternalLink,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  Phone,
  AlertCircle,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const TenantDashboard = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'bookings';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('all');

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.bookingStatus === bookingFilter);

  // Profile Form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.photo || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    fetchTenantData();
  }, [activeTab]);

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const { data } = await API.get('/bookings/my-bookings');
        if (data.success) setBookings(data.bookings);
      } else if (activeTab === 'favorites') {
        const { data } = await API.get('/favorites');
        if (data.success) setFavorites(data.favorites);
      }
    } catch (err) {
      console.error('Tenant dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favId) => {
    try {
      await API.delete(`/favorites/${favId}`);
      setFavorites(favorites.filter((f) => f._id !== favId && f.propertyId?._id !== favId));
    } catch (err) {
      console.error('Remove favorite error:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const { data } = await API.put('/auth/profile', {
        name: profileName,
        photo: profilePhoto,
      });
      if (data.success) {
        updateUser(data.user);
        setProfileSuccess('Profile successfully updated!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem) 0 4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-role">Tenant Dashboard</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}>Welcome back, {user?.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your property reservations, bookmarked homes, and personal profile.
          </p>
        </div>

        {/* Dashboard Layout with Sidebar Navigation */}
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>My Bookings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`dashboard-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
            >
              <Heart size={18} />
              <span>My Favorites</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="dashboard-content">
            {/* 1. My Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>My Reservation Bookings</h2>
                {loading ? (
                  <LoadingSpinner text="Loading your bookings..." />
                ) : bookings.length === 0 ? (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                  }}>
                    <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No Bookings Yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      You haven't reserved any properties yet. Browse our curated listings to find your next home.
                    </p>
                    <Link to="/properties" className="btn btn-primary">Browse Properties</Link>
                  </div>
                ) : (
                  <>
                    {/* Booking Stats Summary Strip */}
                    <div className="dashboard-stats-strip">
                      <div className="stat-pill">
                        <div className="stat-pill-icon stat-icon-total">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <span className="stat-pill-value">{bookings.length}</span>
                          <span className="stat-pill-label">Total Bookings</span>
                        </div>
                      </div>
                      <div className="stat-pill">
                        <div className="stat-pill-icon stat-icon-approved">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <span className="stat-pill-value">
                            {bookings.filter((b) => b.bookingStatus === 'Approved').length}
                          </span>
                          <span className="stat-pill-label">Approved</span>
                        </div>
                      </div>
                      <div className="stat-pill">
                        <div className="stat-pill-icon stat-icon-pending">
                          <Clock size={18} />
                        </div>
                        <div>
                          <span className="stat-pill-value">
                            {bookings.filter((b) => b.bookingStatus === 'Pending').length}
                          </span>
                          <span className="stat-pill-label">Pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Filter Pills */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1.25rem',
                      overflowX: 'auto',
                      paddingBottom: '0.25rem',
                    }}>
                      <button
                        type="button"
                        onClick={() => setBookingFilter('all')}
                        className={`btn btn-sm ${bookingFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', padding: '0.4rem 0.9rem' }}
                      >
                        All ({bookings.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingFilter('Approved')}
                        className={`btn btn-sm ${bookingFilter === 'Approved' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', padding: '0.4rem 0.9rem' }}
                      >
                        Approved ({bookings.filter((b) => b.bookingStatus === 'Approved').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingFilter('Pending')}
                        className={`btn btn-sm ${bookingFilter === 'Pending' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', padding: '0.4rem 0.9rem' }}
                      >
                        Pending ({bookings.filter((b) => b.bookingStatus === 'Pending').length})
                      </button>
                    </div>

                    {/* Desktop Table View */}
                    <div className="table-container desktop-only-table">
                      <table className="custom-table" style={{ minWidth: '780px' }}>
                        <thead>
                          <tr>
                            <th style={{ minWidth: '260px', width: '36%' }}>Property Name</th>
                            <th style={{ minWidth: '120px' }}>Booking Date</th>
                            <th style={{ minWidth: '120px' }}>Move-in Date</th>
                            <th style={{ minWidth: '110px' }}>Amount Paid</th>
                            <th style={{ minWidth: '130px' }}>Booking Status</th>
                            <th style={{ minWidth: '120px' }}>Payment Status</th>
                            <th style={{ minWidth: '80px', textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBookings.map((booking) => {
                            const propId = typeof booking.propertyId === 'object' ? booking.propertyId?._id : booking.propertyId;
                            return (
                              <tr key={booking._id}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <img
                                      src={booking.propertyImage}
                                      alt={booking.propertyName}
                                      style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                      {propId ? (
                                        <Link to={`/properties/${propId}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', lineHeight: '1.35' }}>
                                          {booking.propertyName}
                                        </Link>
                                      ) : (
                                        <strong style={{ display: 'block', fontSize: '0.95rem', lineHeight: '1.35' }}>{booking.propertyName}</strong>
                                      )}
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        <MapPin size={13} />
                                        {booking.propertyLocation}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ whiteSpace: 'nowrap' }}>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{new Date(booking.moveInDate).toLocaleDateString()}</td>
                                <td style={{ whiteSpace: 'nowrap' }}><strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>${booking.amountPaid?.toLocaleString()}</strong></td>
                                <td>
                                  <span className={`badge ${
                                    booking.bookingStatus === 'Approved' ? 'badge-approved' :
                                    booking.bookingStatus === 'Pending' ? 'badge-pending' : 'badge-rejected'
                                  }`}>
                                    {booking.bookingStatus}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-paid">
                                    {booking.paymentStatus}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {propId && (
                                    <Link
                                      to={`/properties/${propId}`}
                                      className="btn btn-secondary btn-sm"
                                      title="View Property Details"
                                      style={{ padding: '0.4rem 0.6rem' }}
                                    >
                                      <Eye size={15} />
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="mobile-only-cards">
                      {filteredBookings.map((booking) => {
                        const propId = typeof booking.propertyId === 'object' ? booking.propertyId?._id : booking.propertyId;
                        return (
                          <div key={booking._id} className="mobile-booking-card">
                            {/* Property Cover Hero Banner */}
                            <div className="mobile-booking-hero">
                              <img
                                src={booking.propertyImage}
                                alt={booking.propertyName}
                                loading="lazy"
                              />
                              <div className="mobile-hero-badge-left">
                                <span className="badge badge-paid">
                                  {booking.paymentStatus}
                                </span>
                              </div>
                              <div className="mobile-hero-badge-right">
                                <span className={`badge ${
                                  booking.bookingStatus === 'Approved' ? 'badge-approved' :
                                  booking.bookingStatus === 'Pending' ? 'badge-pending' : 'badge-rejected'
                                }`}>
                                  {booking.bookingStatus}
                                </span>
                              </div>
                              <div className="mobile-hero-price-chip">
                                ${booking.amountPaid?.toLocaleString()} Paid
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="mobile-booking-body">
                              <div>
                                {propId ? (
                                  <Link to={`/properties/${propId}`} className="mobile-booking-title">
                                    {booking.propertyName}
                                  </Link>
                                ) : (
                                  <span className="mobile-booking-title">{booking.propertyName}</span>
                                )}
                                {booking.propertyLocation && (
                                  <div className="mobile-booking-location" style={{ marginTop: '0.3rem' }}>
                                    <MapPin size={14} />
                                    <span>{booking.propertyLocation}</span>
                                  </div>
                                )}
                              </div>

                              {/* Dates & Financial Info Grid */}
                              <div className="mobile-booking-info-box">
                                <div className="mobile-booking-info-item">
                                  <span className="info-item-label">
                                    <Calendar size={12} /> Move-in Date
                                  </span>
                                  <span className="info-item-value">
                                    {new Date(booking.moveInDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                <div className="mobile-booking-info-item">
                                  <span className="info-item-label">
                                    <Clock size={12} /> Booked On
                                  </span>
                                  <span className="info-item-value">
                                    {new Date(booking.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                {booking.contactNumber && (
                                  <div className="mobile-booking-info-item">
                                    <span className="info-item-label">
                                      <Phone size={12} /> Contact Tel
                                    </span>
                                    <span className="info-item-value" style={{ fontSize: '0.85rem' }}>
                                      {booking.contactNumber}
                                    </span>
                                  </div>
                                )}
                                <div className="mobile-booking-info-item">
                                  <span className="info-item-label">
                                    <DollarSign size={12} /> Total Rent
                                  </span>
                                  <span className="info-item-value" style={{ color: 'var(--accent-primary)' }}>
                                    ${booking.amountPaid?.toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              {/* Status Alert Banner */}
                              {booking.bookingStatus === 'Approved' ? (
                                <div className="mobile-status-banner mobile-status-approved">
                                  <CheckCircle2 size={16} />
                                  <span>Reservation Confirmed by Property Owner</span>
                                </div>
                              ) : booking.bookingStatus === 'Pending' ? (
                                <div className="mobile-status-banner mobile-status-pending">
                                  <Clock size={16} />
                                  <span>Awaiting Owner Confirmation Review</span>
                                </div>
                              ) : (
                                <div className="mobile-status-banner mobile-status-rejected">
                                  <AlertCircle size={16} />
                                  <span>Reservation Declined by Owner</span>
                                </div>
                              )}

                              {booking.additionalNotes && (
                                <div className="mobile-booking-notes">
                                  <strong>Special Note:</strong> {booking.additionalNotes}
                                </div>
                              )}

                              {propId && (
                                <Link
                                  to={`/properties/${propId}`}
                                  className="btn btn-secondary btn-sm"
                                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', gap: '0.5rem' }}
                                >
                                  <Eye size={16} />
                                  <span>View Property Listing</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 2. My Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>My Saved Favorites</h2>
                {loading ? (
                  <LoadingSpinner text="Loading saved properties..." />
                ) : favorites.length === 0 ? (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                  }}>
                    <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No Saved Favorites</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Click the heart icon on any property to save it here for fast access.
                    </p>
                    <Link to="/properties" className="btn btn-primary">Discover Properties</Link>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="table-container desktop-only-table">
                      <table className="custom-table" style={{ minWidth: '760px' }}>
                        <thead>
                          <tr>
                            <th style={{ minWidth: '260px', width: '36%' }}>Property</th>
                            <th style={{ minWidth: '120px' }}>Type</th>
                            <th style={{ minWidth: '130px' }}>Rent Price</th>
                            <th style={{ minWidth: '160px' }}>Location</th>
                            <th style={{ minWidth: '100px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {favorites.map((fav) => {
                            const prop = fav.propertyId;
                            if (!prop) return null;
                            return (
                              <tr key={fav._id}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <img
                                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80'}
                                      alt={prop.title}
                                      style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <strong style={{ fontSize: '0.95rem', lineHeight: '1.35' }}>{prop.title}</strong>
                                  </div>
                                </td>
                                <td><span className="badge badge-approved">{prop.propertyType}</span></td>
                                <td style={{ whiteSpace: 'nowrap' }}><strong>${prop.rentPrice?.toLocaleString()}</strong>/{prop.rentType?.toLowerCase()}</td>
                                <td>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}>
                                    <MapPin size={13} color="var(--text-muted)" />
                                    {prop.location}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                    <Link to={`/properties/${prop._id}`} className="btn btn-secondary btn-sm" title="View Property Details">
                                      <Eye size={15} />
                                    </Link>
                                    <button
                                      onClick={() => handleRemoveFavorite(fav._id)}
                                      className="btn btn-danger btn-sm"
                                      title="Remove Favorite"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="mobile-only-cards">
                      {favorites.map((fav) => {
                        const prop = fav.propertyId;
                        if (!prop) return null;
                        return (
                          <div key={fav._id} className="mobile-favorite-card">
                            <div className="mobile-fav-header">
                              <img
                                src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80'}
                                alt={prop.title}
                                className="mobile-fav-img"
                              />
                              <div className="mobile-fav-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                  <span className="badge badge-approved">{prop.propertyType}</span>
                                  <span className="cell-price">${prop.rentPrice?.toLocaleString()}/{prop.rentType?.toLowerCase()}</span>
                                </div>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.25rem', lineHeight: '1.3' }}>
                                  {prop.title}
                                </h4>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <MapPin size={13} /> {prop.location}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <Link to={`/properties/${prop._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                                <Eye size={15} /> View
                              </Link>
                              <button
                                onClick={() => handleRemoveFavorite(fav._id)}
                                className="btn btn-danger btn-sm"
                                style={{ flex: 1 }}
                              >
                                <Trash2 size={15} /> Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 3. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="dashboard-profile-card">
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>My Profile Details</h2>

                {profileSuccess && (
                  <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    {profileSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <img
                    src={profilePhoto || user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user?.name}
                    style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{user?.name}</h3>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</span>
                    <div style={{ marginTop: '0.4rem' }}>
                      <span className="badge badge-role">Role: {user?.role}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Photo URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      className="form-input"
                      value={profilePhoto}
                      onChange={(e) => setProfilePhoto(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email (Read Only)</label>
                    <input
                      type="email"
                      disabled
                      className="form-input"
                      value={user?.email || ''}
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    {profileSaving ? 'Saving...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
