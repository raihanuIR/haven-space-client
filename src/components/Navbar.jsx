import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Settings,
  ChevronDown,
  ShieldCheck,
  Compass,
  Info,
  PhoneCall,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'Admin') return '/dashboard/admin';
    if (user?.role === 'Owner') return '/dashboard/owner';
    return '/dashboard/tenant';
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Logo & Brand Name */}
        <Link to="/" className="nav-brand" onClick={() => setMobileOpen(false)}>
          <div className="nav-brand-icon">
            <Building2 size={22} />
          </div>
          <span>Rental<span className="gradient-text">Hub</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/properties" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Explore
          </NavLink>
          {isAuthenticated && (
            <NavLink to={getDashboardPath()} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            About
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Blog
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Contact
          </NavLink>
        </nav>

        {/* Actions & Profile */}
        <div className="nav-actions">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            /* Advanced Profile Dropdown Menu */
            <div className="dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="profile-dropdown-trigger"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.65rem 0.25rem 0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <img
                  src={user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.name}
                  className="user-avatar"
                  style={{ width: '32px', height: '32px', border: '2px solid var(--accent-primary)' }}
                />
                <span className="user-nav-name" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: profileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {profileDropdownOpen && (
                <div
                  className="profile-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '0.75rem 0',
                    zIndex: 1000,
                    animation: 'fadeIn 0.15s ease-out',
                  }}
                >
                  {/* User Profile Summary Header */}
                  <div style={{ padding: '0.5rem 1rem 0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{user?.email}</div>
                    <span className="badge badge-role" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                      {user?.role} Account
                    </span>
                  </div>

                  {/* Dropdown Menu Links */}
                  <div style={{ padding: '0.4rem 0' }}>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LayoutDashboard size={16} color="var(--accent-primary)" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User size={16} color="var(--accent-primary)" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to={`${getDashboardPath()}?tab=settings`}
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Settings size={16} color="var(--accent-primary)" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />

                  {/* Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-desktop">
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/" onClick={() => setMobileOpen(false)} className="nav-link">Home</Link>
          <Link to="/properties" onClick={() => setMobileOpen(false)} className="nav-link">Explore Properties</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="nav-link">About Us</Link>
          <Link to="/blog" onClick={() => setMobileOpen(false)} className="nav-link">Rental Blog</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="nav-link">Contact Support</Link>

          {isAuthenticated ? (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Signed in as: <strong>{user?.name}</strong> ({user?.role})</div>
              <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="nav-link">Dashboard</Link>
              <Link to="/dashboard/profile" onClick={() => setMobileOpen(false)} className="nav-link">My Profile</Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                style={{
                  width: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  marginTop: '0.25rem',
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
