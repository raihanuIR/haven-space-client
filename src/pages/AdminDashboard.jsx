import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Building,
  ClipboardList,
  Receipt,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import API from '../services/api';
import RejectionFeedbackModal from '../components/RejectionFeedbackModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'users';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Data states
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);


  // Pagination for Bookings and Transactions (Challenge requirement: Pagination on >= 2 pages)
  const [bookingPage, setBookingPage] = useState(1);
  const [totalBookingPages, setTotalBookingPages] = useState(1);

  const [transactionPage, setTransactionPage] = useState(1);
  const [totalTransactionPages, setTotalTransactionPages] = useState(1);

  // Moderation state
  const [moderatingProperty, setModeratingProperty] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab, bookingPage, transactionPage]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const { data } = await API.get('/admin/users');
        if (data.success) setUsers(data.users);
      } else if (activeTab === 'properties') {
        const { data } = await API.get('/admin/properties');
        if (data.success) setProperties(data.properties);
      } else if (activeTab === 'bookings') {
        const { data } = await API.get(`/admin/bookings?page=${bookingPage}&limit=4`);
        if (data.success) {
          setBookings(data.bookings);
          setTotalBookingPages(data.totalPages || 1);
        }
      } else if (activeTab === 'transactions') {
        const { data } = await API.get(`/admin/transactions?page=${transactionPage}&limit=4`);
        if (data.success) {
          setTransactions(data.transactions);
          setTotalTransactionPages(data.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Change user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await API.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (data.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      console.error('Change role error:', err);
    }
  };

  // 2. Approve Property
  const handleApproveProperty = async (propId) => {
    try {
      const { data } = await API.patch(`/admin/properties/${propId}/moderate`, {
        status: 'Approved',
      });
      if (data.success) {
        setProperties(properties.map((p) => (p._id === propId ? { ...p, status: 'Approved' } : p)));
      }
    } catch (err) {
      console.error('Approve property error:', err);
    }
  };

  // 3. Trigger Reject Modal (Mandatory feedback collection per requirement)
  const handleOpenRejectModal = (prop) => {
    setModeratingProperty(prop);
    setRejectModalOpen(true);
  };

  // 4. Submit Rejection Feedback
  const handleSubmitRejectionFeedback = async (propId, feedback) => {
    const { data } = await API.patch(`/admin/properties/${propId}/moderate`, {
      status: 'Rejected',
      rejectionFeedback: feedback,
    });
    if (data.success) {
      setProperties(properties.map((p) => (p._id === propId ? { ...p, status: 'Rejected', rejectionFeedback: feedback } : p)));
    }
  };

  // 5. Delete Property
  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Delete this property permanently from the database?')) return;
    try {
      await API.delete(`/properties/${propId}`);
      setProperties(properties.filter((p) => p._id !== propId));
    } catch (err) {
      console.error('Delete property error:', err);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-approved" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
              Super Admin Area
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Platform Administration</h1>
          <p style={{ color: 'var(--text-muted)' }}>Moderate listings, update user roles, audit bookings, and view financial transactions.</p>
        </div>

        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`dashboard-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>All Users</span>
              {users.length > 0 && (
                <span className="badge" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: activeTab === 'users' ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)', color: activeTab === 'users' ? '#ffffff' : 'var(--text-muted)' }}>
                  {users.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('properties')}
              className={`dashboard-nav-item ${activeTab === 'properties' ? 'active' : ''}`}
            >
              <Building size={18} />
              <span>All Properties</span>
              {properties.length > 0 && (
                <span className="badge" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: activeTab === 'properties' ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)', color: activeTab === 'properties' ? '#ffffff' : 'var(--text-muted)' }}>
                  {properties.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              <ClipboardList size={18} />
              <span>All Bookings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={`dashboard-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            >
              <Receipt size={18} />
              <span>Transactions</span>
            </button>
          </aside>

          {/* Content */}
          <main className="dashboard-content">
            {/* 1. All Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Platform Users Directory</h2>
                {loading ? (
                  <LoadingSpinner text="Fetching platform accounts..." />
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>User Profile</th>
                          <th>Email Address</th>
                          <th>Current Role</th>
                          <th>Change Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={u.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                  alt={u.name}
                                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <strong>{u.name}</strong>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`badge ${u.role === 'Admin' ? 'badge-rejected' : u.role === 'Owner' ? 'badge-pending' : 'badge-approved'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select"
                                style={{ width: '140px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              >
                                <option value="Tenant">Tenant</option>
                                <option value="Owner">Owner</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. All Properties Tab (Moderation) */}
            {activeTab === 'properties' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Property Listings Moderation</h2>
                {loading ? (
                  <LoadingSpinner text="Loading all properties..." />
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Property Title</th>
                          <th>Owner</th>
                          <th>Rent Price</th>
                          <th>Status</th>
                          <th>Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((prop) => (
                          <tr key={prop._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80'}
                                  alt={prop.title}
                                  style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{prop.title}</strong>
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.location}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{prop.owner?.name}</strong>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.owner?.email}</span>
                            </td>
                            <td><strong>${prop.rentPrice?.toLocaleString()}</strong></td>
                            <td>
                              <span className={`badge ${
                                prop.status === 'Approved' ? 'badge-approved' :
                                prop.status === 'Pending' ? 'badge-pending' : 'badge-rejected'
                              }`}>
                                {prop.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                {prop.status !== 'Approved' && (
                                  <button
                                    onClick={() => handleApproveProperty(prop._id)}
                                    className="btn btn-primary btn-sm"
                                    title="Approve Property"
                                  >
                                    Approve
                                  </button>
                                )}
                                {prop.status !== 'Rejected' && (
                                  <button
                                    onClick={() => handleOpenRejectModal(prop)}
                                    className="btn btn-secondary btn-sm"
                                    title="Reject with Feedback"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteProperty(prop._id)}
                                  className="btn btn-danger btn-sm"
                                  title="Delete Property"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. All Bookings Tab (Paginated) */}
            {activeTab === 'bookings' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>All System Bookings</h2>
                {loading ? (
                  <LoadingSpinner text="Fetching bookings records..." />
                ) : (
                  <>
                    <div className="table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Property</th>
                            <th>Tenant</th>
                            <th>Owner</th>
                            <th>Move-in Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((b) => (
                            <tr key={b._id}>
                              <td><strong>{b.propertyName}</strong></td>
                              <td>
                                {b.tenantName}
                                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.tenantEmail}</span>
                              </td>
                              <td>{b.ownerEmail}</td>
                              <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                              <td><strong>${b.amountPaid?.toLocaleString()}</strong></td>
                              <td>
                                <span className={`badge ${
                                  b.bookingStatus === 'Approved' ? 'badge-approved' :
                                  b.bookingStatus === 'Pending' ? 'badge-pending' : 'badge-rejected'
                                }`}>
                                  {b.bookingStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalBookingPages > 1 && (
                      <div className="pagination-container">
                        <button
                          className="page-btn"
                          disabled={bookingPage <= 1}
                          onClick={() => setBookingPage(bookingPage - 1)}
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <span>Page {bookingPage} of {totalBookingPages}</span>
                        <button
                          className="page-btn"
                          disabled={bookingPage >= totalBookingPages}
                          onClick={() => setBookingPage(bookingPage + 1)}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 4. Transactions Tab (Paginated) */}
            {activeTab === 'transactions' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Payment Transactions Audit</h2>
                {loading ? (
                  <LoadingSpinner text="Fetching payment audit records..." />
                ) : (
                  <>
                    <div className="table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Transaction ID</th>
                            <th>Property Name</th>
                            <th>Tenant Name</th>
                            <th>Owner Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => (
                            <tr key={tx._id}>
                              <td>
                                <code style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                                  {tx.transactionId}
                                </code>
                              </td>
                              <td><strong>{tx.propertyName}</strong></td>
                              <td>{tx.tenantName}</td>
                              <td>{tx.ownerName}</td>
                              <td><strong style={{ color: 'var(--success)' }}>${tx.amount?.toLocaleString()}</strong></td>
                              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalTransactionPages > 1 && (
                      <div className="pagination-container">
                        <button
                          className="page-btn"
                          disabled={transactionPage <= 1}
                          onClick={() => setTransactionPage(transactionPage - 1)}
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <span>Page {transactionPage} of {totalTransactionPages}</span>
                        <button
                          className="page-btn"
                          disabled={transactionPage >= totalTransactionPages}
                          onClick={() => setTransactionPage(transactionPage + 1)}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Admin Rejection Modal (Collects Rejection Feedback) */}
      <RejectionFeedbackModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        mode="create"
        property={moderatingProperty}
        onSubmitFeedback={handleSubmitRejectionFeedback}
      />
    </div>
  );
};

export default AdminDashboard;
