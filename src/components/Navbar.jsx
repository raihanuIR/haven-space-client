import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
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
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
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
            All Properties
          </NavLink>
          {isAuthenticated && (
            <NavLink to={getDashboardPath()} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Dashboard
            </NavLink>
          )}
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
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/dashboard/profile" title="View Profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.name}
                  className="user-avatar"
                />
                <span className="user-nav-name">
                  {user?.name?.split(' ')[0]}
                </span>
                <span className="badge badge-role user-nav-badge">{user?.role}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={16} />
                <span className="user-nav-btn-text">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
          <Link to="/properties" onClick={() => setMobileOpen(false)} className="nav-link">All Properties</Link>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="nav-link">Dashboard ({user?.role})</Link>
              <Link to="/dashboard/profile" onClick={() => setMobileOpen(false)} className="nav-link">My Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: 'fit-content' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
