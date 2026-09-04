import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Heart, User, Trash2, Eye, ExternalLink, Clock, DollarSign } from 'lucide-react';
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
    <div className="page-wrapper" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-role">Tenant Dashboard</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Welcome back, {user?.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your property reservations, bookmarked homes, and personal profile.</p>
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
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Property Name</th>
                          <th>Booking Date</th>
                          <th>Move-in Date</th>
                          <th>Amount Paid</th>
                          <th>Booking Status</th>
                          <th>Payment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={booking.propertyImage}
                                  alt={booking.propertyName}
                                  style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong style={{ display: 'block' }}>{booking.propertyName}</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.propertyLocation}</span>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                            <td>{new Date(booking.moveInDate).toLocaleDateString()}</td>
                            <td><strong>${booking.amountPaid?.toLocaleString()}</strong></td>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Type</th>
                          <th>Rent Price</th>
                          <th>Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {favorites.map((fav) => {
                          const prop = fav.propertyId;
                          if (!prop) return null;
                          return (
                            <tr key={fav._id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <img
                                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80'}
                                    alt={prop.title}
                                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                  />
                                  <strong>{prop.title}</strong>
                                </div>
                              </td>
                              <td><span className="badge badge-approved">{prop.propertyType}</span></td>
                              <td><strong>${prop.rentPrice?.toLocaleString()}</strong>/{prop.rentType?.toLowerCase()}</td>
                              <td>{prop.location}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                )}
              </div>
            )}

            {/* 3. Profile Tab */}
            {activeTab === 'profile' && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                maxWidth: '650px',
              }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>My Profile Details</h2>

                {profileSuccess && (
                  <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    {profileSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
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
                    style={{ marginTop: '1rem' }}
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
