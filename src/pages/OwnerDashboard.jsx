import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  PlusCircle,
  Building,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Check,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import RejectionFeedbackModal from '../components/RejectionFeedbackModal';
import LoadingSpinner from '../components/LoadingSpinner';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analytics';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Feedback View
  const [selectedRejectedProperty, setSelectedRejectedProperty] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Add Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    description: '',
    location: '',
    propertyType: 'Apartment',
    rentPrice: '',
    rentType: 'Monthly',
    bedrooms: '1',
    bathrooms: '1',
    propertySize: '750',
    amenities: ['WiFi', 'Air Conditioning'],
    imagesText: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    extraFeatures: '',
    ownerPhone: '+1 (555) 019-2834',
  });
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [submittingProp, setSubmittingProp] = useState(false);

  useEffect(() => {
    fetchOwnerData();
  }, [activeTab]);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const { data } = await API.get('/owner/analytics');
        if (data.success) setAnalytics(data.analytics);
      } else if (activeTab === 'properties') {
        const { data } = await API.get('/properties/my-properties');
        if (data.success) setMyProperties(data.properties);
      } else if (activeTab === 'requests') {
        const { data } = await API.get('/bookings/owner-requests');
        if (data.success) setBookingRequests(data.requests);
      }
    } catch (err) {
      console.error('Owner dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Optional Requirement: Download Monthly Earnings Report as PDF
  const handleDownloadPDF = () => {
    if (!analytics || !analytics.monthlyData) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('RentalHub - Owner Earnings & Performance Report', 14, 20);

    doc.setFontSize(11);
    doc.text(`Owner: ${user?.name} (${user?.email})`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);
    doc.text(`Total Lifetime Earnings: $${analytics.totalEarnings?.toLocaleString()}`, 14, 44);
    doc.text(`Total Properties Listed: ${analytics.totalProperties}`, 14, 50);
    doc.text(`Total Confirmed Bookings: ${analytics.totalBookings}`, 14, 56);

    const tableRows = analytics.monthlyData.map((item) => [
      item.month,
      `$${item.earnings?.toLocaleString()}`,
      item.bookings || 0,
    ]);

    doc.autoTable({
      startY: 64,
      head: [['Month', 'Earnings (USD)', 'Bookings']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save(`Monthly_Earnings_Report_${user?.name?.replace(/\s+/g, '_')}.pdf`);
  };

  const handleAddPropertySubmit = async (e) => {
    e.preventDefault();
    setSubmittingProp(true);
    setFormError('');
    setFormSuccess('');

    try {
      const imagesArray = newProp.imagesText
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      if (imagesArray.length === 0) {
        throw new Error('Please provide at least one valid image URL');
      }

      const payload = {
        ...newProp,
        rentPrice: Number(newProp.rentPrice),
        bedrooms: Number(newProp.bedrooms),
        bathrooms: Number(newProp.bathrooms),
        propertySize: Number(newProp.propertySize),
        images: imagesArray,
      };

      const { data } = await API.post('/properties', payload);
      if (data.success) {
        setFormSuccess('Property submitted successfully! Admin will review it shortly.');
        setNewProp({
          title: '',
          description: '',
          location: '',
          propertyType: 'Apartment',
          rentPrice: '',
          rentType: 'Monthly',
          bedrooms: '1',
          bathrooms: '1',
          propertySize: '750',
          amenities: ['WiFi', 'Air Conditioning'],
          imagesText: '',
          extraFeatures: '',
          ownerPhone: '',
        });
        setTimeout(() => setFormSuccess(''), 5000);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to submit property listing');
    } finally {
      setSubmittingProp(false);
    }
  };

  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/properties/${propId}`);
      setMyProperties(myProperties.filter((p) => p._id !== propId));
    } catch (err) {
      console.error('Delete property error:', err);
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    try {
      const { data } = await API.patch(`/bookings/${bookingId}/status`, { status });
      if (data.success) {
        setBookingRequests(
          bookingRequests.map((b) => (b._id === bookingId ? { ...b, bookingStatus: status } : b))
        );
      }
    } catch (err) {
      console.error('Booking action error:', err);
    }
  };

  const allAmenitiesList = [
    'WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Air Conditioning',
    'Pets Allowed', 'Furnished', 'Balcony', 'Garden', 'Elevator', 'Security System'
  ];

  const toggleAmenity = (name) => {
    if (newProp.amenities.includes(name)) {
      setNewProp({ ...newProp, amenities: newProp.amenities.filter((a) => a !== name) });
    } else {
      setNewProp({ ...newProp, amenities: [...newProp.amenities, name] });
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-role">Owner Portal</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Property Owner Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor revenue analytics, publish rental listings, and approve booking requests.</p>
        </div>

        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`dashboard-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              <BarChart3 size={18} />
              <span>Earnings Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('properties')}
              className={`dashboard-nav-item ${activeTab === 'properties' ? 'active' : ''}`}
            >
              <Building size={18} />
              <span>My Properties</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`dashboard-nav-item ${activeTab === 'add' ? 'active' : ''}`}
            >
              <PlusCircle size={18} />
              <span>Add Property</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`dashboard-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            >
              <ClipboardList size={18} />
              <span>Booking Requests</span>
            </button>
          </aside>

          {/* Main Area */}
          <main className="dashboard-content">
            {/* 1. Analytics Home */}
            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>Performance & Monthly Earnings</h2>
                  <button onClick={handleDownloadPDF} className="btn btn-secondary btn-sm" style={{ gap: '0.5rem' }}>
                    <Download size={16} />
                    <span>Download Earnings PDF</span>
                  </button>
                </div>

                {loading ? (
                  <LoadingSpinner text="Computing performance analytics..." />
                ) : (
                  <>
                    {/* 3 Summary Cards */}
                    <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                      <div className="stat-card">
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Earnings</span>
                          <div className="stat-value" style={{ color: 'var(--accent-primary)' }}>
                            ${analytics?.totalEarnings?.toLocaleString() || '0'}
                          </div>
                        </div>
                        <div className="nav-brand-icon" style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#4f46e5' }}>
                          <DollarSign size={24} />
                        </div>
                      </div>

                      <div className="stat-card">
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Properties</span>
                          <div className="stat-value">
                            {analytics?.totalProperties || 0}
                          </div>
                        </div>
                        <div className="nav-brand-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                          <Building size={24} />
                        </div>
                      </div>

                      <div className="stat-card">
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Bookings</span>
                          <div className="stat-value" style={{ color: 'var(--success)' }}>
                            {analytics?.totalBookings || 0}
                          </div>
                        </div>
                        <div className="nav-brand-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                          <ClipboardList size={24} />
                        </div>
                      </div>
                    </div>

                    {/* Monthly Earnings Chart: Line Chart via Recharts */}
                    <div style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '2rem',
                      boxShadow: 'var(--shadow-md)',
                    }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Monthly Earnings Overview (Last 12 Months)</h3>
                      <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                          <AreaChart data={analytics?.monthlyData || []}>
                            <defs>
                              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `$${val}`} />
                            <Tooltip
                              formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']}
                              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="earnings"
                              stroke="#4f46e5"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#earningsGrad)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 2. My Properties Tab */}
            {activeTab === 'properties' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>My Listed Properties</h2>
                  <button onClick={() => setActiveTab('add')} className="btn btn-primary btn-sm" style={{ gap: '0.5rem' }}>
                    <PlusCircle size={16} />
                    <span>Add New</span>
                  </button>
                </div>

                {loading ? (
                  <LoadingSpinner text="Loading property listings..." />
                ) : myProperties.length === 0 ? (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                  }}>
                    <Building size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No Listings Created</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Publish your first property to start receiving tenant reservations.
                    </p>
                    <button onClick={() => setActiveTab('add')} className="btn btn-primary">Add Property</button>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Property Title</th>
                          <th>Type</th>
                          <th>Rent Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myProperties.map((prop) => (
                          <tr key={prop._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80'}
                                  alt={prop.title}
                                  style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{prop.title}</strong>
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.location}</span>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge badge-approved">{prop.propertyType}</span></td>
                            <td><strong>${prop.rentPrice?.toLocaleString()}</strong>/{prop.rentType?.toLowerCase()}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className={`badge ${
                                  prop.status === 'Approved' ? 'badge-approved' :
                                  prop.status === 'Pending' ? 'badge-pending' : 'badge-rejected'
                                }`}>
                                  {prop.status}
                                </span>

                                {/* Challenge Requirement 4: Owner can view rejection feedback on rejected property via 👁️ button */}
                                {prop.status === 'Rejected' && (
                                  <button
                                    onClick={() => {
                                      setSelectedRejectedProperty(prop);
                                      setFeedbackModalOpen(true);
                                    }}
                                    className="theme-toggle-btn"
                                    style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                                    title="View Rejection Reason & Feedback"
                                  >
                                    <Eye size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteProperty(prop._id)}
                                className="btn btn-danger btn-sm"
                                title="Delete Property"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. Add Property Tab */}
            {activeTab === 'add' && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
              }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Create New Property Listing</h2>

                {formSuccess && (
                  <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    {formSuccess}
                  </div>
                )}
                {formError && (
                  <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleAddPropertySubmit}>
                  <div className="form-group">
                    <label className="form-label">Property Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Modern Sunset Penthouse with Marina Views"
                      className="form-input"
                      value={newProp.title}
                      onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Description *</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Describe architectural features, room configuration, view, lighting..."
                      className="form-textarea"
                      value={newProp.description}
                      onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Location (City, State / Full Address) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Brickell, Miami, FL"
                        className="form-input"
                        value={newProp.location}
                        onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Property Type *</label>
                      <select
                        className="form-select"
                        value={newProp.propertyType}
                        onChange={(e) => setNewProp({ ...newProp, propertyType: e.target.value })}
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                        <option value="Studio">Studio</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Condo">Condo</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Rent (Price in USD) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="3500"
                        className="form-input"
                        value={newProp.rentPrice}
                        onChange={(e) => setNewProp({ ...newProp, rentPrice: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rent Billing Cycle *</label>
                      <select
                        className="form-select"
                        value={newProp.rentType}
                        onChange={(e) => setNewProp({ ...newProp, rentType: e.target.value })}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Daily">Daily</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Bedrooms *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="form-input"
                        value={newProp.bedrooms}
                        onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bathrooms *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="form-input"
                        value={newProp.bathrooms}
                        onChange={(e) => setNewProp({ ...newProp, bathrooms: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Property Size (sq ft) *</label>
                      <input
                        type="number"
                        min="50"
                        required
                        className="form-input"
                        value={newProp.propertySize}
                        onChange={(e) => setNewProp({ ...newProp, propertySize: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="form-group">
                    <label className="form-label">Amenities Included</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                      {allAmenitiesList.map((amenity) => {
                        const isChecked = newProp.amenities.includes(amenity);
                        return (
                          <button
                            type="button"
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ borderRadius: 'var(--radius-full)' }}
                          >
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Images URL list */}
                  <div className="form-group">
                    <label className="form-label">Property Images (One direct URL per line) *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                      className="form-textarea"
                      value={newProp.imagesText}
                      onChange={(e) => setNewProp({ ...newProp, imagesText: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Extra Features (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Electric vehicle charging station, wine cellar, smart lock"
                      className="form-input"
                      value={newProp.extraFeatures}
                      onChange={(e) => setNewProp({ ...newProp, extraFeatures: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Owner Contact Telephone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 012-3456"
                      className="form-input"
                      value={newProp.ownerPhone}
                      onChange={(e) => setNewProp({ ...newProp, ownerPhone: e.target.value })}
                    />
                  </div>

                  <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    margin: '1.5rem 0',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                  }}>
                    Listing status will be set to <strong style={{ color: 'var(--warning)' }}>Pending</strong> upon submission. Administrators will review and approve it.
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProp}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                  >
                    {submittingProp ? 'Submitting Property Listing...' : 'Publish Listing for Review'}
                  </button>
                </form>
              </div>
            )}

            {/* 4. Booking Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Incoming Booking Requests</h2>
                {loading ? (
                  <LoadingSpinner text="Loading booking requests..." />
                ) : bookingRequests.length === 0 ? (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                  }}>
                    <ClipboardList size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No Requests</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                      You have no pending tenant booking requests at this moment.
                    </p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Tenant Information</th>
                          <th>Property</th>
                          <th>Move-in Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingRequests.map((req) => (
                          <tr key={req._id}>
                            <td>
                              <div>
                                <strong>{req.tenantName}</strong>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.tenantEmail}</span>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tel: {req.contactNumber}</span>
                              </div>
                            </td>
                            <td>
                              <strong>{req.propertyName}</strong>
                            </td>
                            <td>{new Date(req.moveInDate).toLocaleDateString()}</td>
                            <td><strong>${req.amountPaid?.toLocaleString()}</strong></td>
                            <td>
                              <span className={`badge ${
                                req.bookingStatus === 'Approved' ? 'badge-approved' :
                                req.bookingStatus === 'Pending' ? 'badge-pending' : 'badge-rejected'
                              }`}>
                                {req.bookingStatus}
                              </span>
                            </td>
                            <td>
                              {req.bookingStatus === 'Pending' ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => handleBookingAction(req._id, 'Approved')}
                                    className="btn btn-primary btn-sm"
                                    title="Approve Booking"
                                  >
                                    <Check size={16} />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleBookingAction(req._id, 'Rejected')}
                                    className="btn btn-danger btn-sm"
                                    title="Reject Booking"
                                  >
                                    <X size={16} />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resolved</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Owner View Rejection Feedback Modal */}
      <RejectionFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        mode="view"
        property={selectedRejectedProperty}
      />
    </div>
  );
};

export default OwnerDashboard;
