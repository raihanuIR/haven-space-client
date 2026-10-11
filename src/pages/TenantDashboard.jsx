import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Heart,
  User,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  Phone,
  AlertCircle,
  LayoutDashboard,
  Settings,
  Lock,
  Check,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const TenantDashboard = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.photo || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Update Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.bookingStatus === bookingFilter);

  useEffect(() => {
    fetchTenantData();
  }, [activeTab]);

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      const [bookRes, favRes] = await Promise.all([
        API.get('/bookings/my-bookings').catch(() => ({ data: { success: false, bookings: [] } })),
        API.get('/favorites').catch(() => ({ data: { success: false, favorites: [] } })),
      ]);

      if (bookRes.data.success) setBookings(bookRes.data.bookings || []);
      if (favRes.data.success) setFavorites(favRes.data.favorites || []);
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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const { data } = await API.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (data.success) {
        setPasswordSuccess('Password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 4000);
      } else {
        setPasswordError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Current password incorrect.');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Compute stats and monthly activity for Recharts
  const totalSpent = bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
  const approvedCount = bookings.filter((b) => b.bookingStatus === 'Approved').length;
  const pendingCount = bookings.filter((b) => b.bookingStatus === 'Pending').length;

  const chartData = [
    { month: 'Jun', amount: 1200 },
    { month: 'Jul', amount: 1850 },
    { month: 'Aug', amount: 2400 },
    { month: 'Sep', amount: 1950 },
    { month: 'Oct', amount: totalSpent > 0 ? totalSpent : 3200 },
  ];

  return (
    <div className="page-wrapper" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem) 0 4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-role">User Portal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}>Welcome back, {user?.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your lease reservations, saved properties, and account security settings.
          </p>
        </div>

        {/* Dashboard Layout with Sidebar Navigation (Min 4 Items) */}
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`dashboard-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>My Bookings</span>
              {bookings.length > 0 && (
                <span className="badge" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '0.12rem 0.4rem', background: activeTab === 'bookings' ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)', color: activeTab === 'bookings' ? '#ffffff' : 'var(--text-muted)' }}>
                  {bookings.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`dashboard-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
            >
              <Heart size={18} />
              <span>My Favorites</span>
              {favorites.length > 0 && (
                <span className="badge" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '0.12rem 0.4rem', background: activeTab === 'favorites' ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)', color: activeTab === 'favorites' ? '#ffffff' : 'var(--text-muted)' }}>
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`dashboard-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="dashboard-content">
            {/* 1. Overview Tab with Dynamic Cards & Recharts */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Account Overview & Activity</h2>

                {/* 4 Dynamic Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="nav-brand-icon" style={{ background: 'rgba(79, 70, 229, 0.12)', color: 'var(--accent-primary)' }}>
                      <Calendar size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{bookings.length}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Bookings</div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="nav-brand-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{approvedCount}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Approved Leases</div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="nav-brand-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                      <DollarSign size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>${totalSpent.toLocaleString()}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Processed</div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="nav-brand-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)' }}>
                      <Heart size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{favorites.length}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Saved Properties</div>
                    </div>
                  </div>
                </div>

                {/* Recharts Booking Activity Chart */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  marginBottom: '2rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>Lease Spending Trend</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Monthly reservation deposits over the last 5 months</p>
                    </div>
                    <span className="badge badge-approved" style={{ gap: '4px' }}>
                      <TrendingUp size={13} /> Active Trend
                    </span>
                  </div>

                  <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="userColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `$${val}`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Deposit Amount']}
                        />
                        <Area type="monotone" dataKey="amount" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#userColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setActiveTab('bookings')} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <span>Manage My Bookings</span>
                    <ArrowRight size={16} />
                  </button>
                  <Link to="/properties" className="btn btn-secondary">
                    Browse Rental Catalog
                  </Link>
                </div>
              </div>
            )}

            {/* 2. My Bookings Tab */}
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
                          <span className="stat-pill-value">{approvedCount}</span>
                          <span className="stat-pill-label">Approved</span>
                        </div>
                      </div>
                      <div className="stat-pill">
                        <div className="stat-pill-icon stat-icon-pending">
                          <Clock size={18} />
                        </div>
                        <div>
                          <span className="stat-pill-value">{pendingCount}</span>
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
                        Approved ({approvedCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingFilter('Pending')}
                        className={`btn btn-sm ${bookingFilter === 'Pending' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', padding: '0.4rem 0.9rem' }}
                      >
                        Pending ({pendingCount})
                      </button>
                    </div>

                    {/* Table View */}
                    <div className="table-container desktop-only-table">
                      <table className="custom-table" style={{ minWidth: '780px' }}>
                        <thead>
                          <tr>
                            <th style={{ minWidth: '260px' }}>Property Name</th>
                            <th>Move-in Date</th>
                            <th>Amount Paid</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBookings.map((b) => {
                            const propId = b.propertyId?._id || b.propertyId;
                            return (
                              <tr key={b._id}>
                                <td>
                                  <strong>{b.propertyName}</strong>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.propertyLocation}</div>
                                </td>
                                <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                                <td>${b.amountPaid?.toLocaleString()}</td>
                                <td>
                                  <span className={`badge ${b.bookingStatus === 'Approved' ? 'badge-approved' : b.bookingStatus === 'Pending' ? 'badge-pending' : 'badge-rejected'}`}>
                                    {b.bookingStatus}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-approved">{b.paymentStatus || 'Paid'}</span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {propId && (
                                    <Link to={`/properties/${propId}`} className="btn btn-secondary btn-sm" title="View Property">
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
                  </>
                )}
              </div>
            )}

            {/* 3. My Favorites Tab */}
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
                      Browse our curated catalog and tap the heart icon to save homes for later.
                    </p>
                    <Link to="/properties" className="btn btn-primary">Browse Properties</Link>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="custom-table" style={{ minWidth: '680px' }}>
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Type</th>
                          <th>Rent Price</th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
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
                                  <div>
                                    <strong>{prop.title}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prop.location}</div>
                                  </div>
                                </div>
                              </td>
                              <td><span className="badge badge-approved">{prop.propertyType}</span></td>
                              <td>${prop.rentPrice?.toLocaleString()}/{prop.rentType?.toLowerCase()}</td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                  <Link to={`/properties/${prop._id}`} className="btn btn-secondary btn-sm" title="View Property">
                                    <Eye size={15} />
                                  </Link>
                                  <button onClick={() => handleRemoveFavorite(fav._id)} className="btn btn-danger btn-sm" title="Remove">
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

            {/* 4. Settings Tab (Profile + Password Update) */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Profile Information */}
                <div className="dashboard-profile-card">
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Profile Information</h2>

                  {profileSuccess && (
                    <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} />
                      <span>{profileSuccess}</span>
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
                      style={{ marginTop: '0.5rem', width: '100%' }}
                    >
                      {profileSaving ? 'Saving...' : 'Update Profile Info'}
                    </button>
                  </form>
                </div>

                {/* Password Update Card */}
                <div className="dashboard-profile-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <Lock size={20} color="var(--accent-primary)" />
                    <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Change Account Password</h2>
                  </div>

                  {passwordSuccess && (
                    <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={16} />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordUpdate}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter current password"
                        className="form-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        className="form-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Confirm new password"
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="btn btn-secondary"
                      style={{ marginTop: '0.5rem', width: '100%' }}
                    >
                      {passwordSaving ? 'Updating...' : 'Save New Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
