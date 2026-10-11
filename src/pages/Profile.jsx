import React, { useState } from 'react';
import { User, Mail, Shield, Camera, Check, Calendar, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // Basic Info Form State
  const [name, setName] = useState(user?.name || '');
  const [photo, setPhoto] = useState(user?.photo || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password Update Form State (Remontada Specification)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { data } = await API.put('/auth/profile', { name, photo });
      if (data.success) {
        updateUser(data.user);
        setMessage('Profile details updated successfully!');
        setTimeout(() => setMessage(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const { data } = await API.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (data.success) {
        setPasswordMessage(data.message || 'Password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMessage(''), 4000);
      } else {
        setPasswordError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Profile Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.25rem, 5vw, 2.5rem)',
          boxShadow: 'var(--shadow-xl)',
          marginBottom: '2rem',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
              <img
                src={photo || user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user?.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: 'var(--radius-full)',
                  objectFit: 'cover',
                  border: '4px solid var(--accent-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'var(--accent-primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem',
                display: 'flex',
              }}>
                <Camera size={14} />
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>{user?.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{user?.email}</p>
            <div style={{ marginTop: '0.75rem' }}>
              <span className="badge badge-role">System Role: {user?.role}</span>
            </div>
          </div>

          {message && (
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Avatar Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="form-input"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Email (Immutable)</label>
              <input
                type="email"
                disabled
                className="form-input"
                value={user?.email || ''}
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Password Update Card (Required by Remontada Specification) */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.25rem, 5vw, 2.5rem)',
          boxShadow: 'var(--shadow-xl)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <KeyRound size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Update Password</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Ensure your account is protected with a secure password containing at least 6 characters.
          </p>

          {passwordMessage && (
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} />
              <span>{passwordMessage}</span>
            </div>
          )}

          {passwordError && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword}>
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
                placeholder="At least 6 characters"
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
                placeholder="Repeat new password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {passwordSaving ? 'Updating Password...' : 'Update Account Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
