import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '5rem 1rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '540px' }}>
        <div style={{
          fontSize: '6rem',
          fontWeight: 900,
          fontFamily: 'Outfit',
          lineHeight: 1,
          marginBottom: '1rem',
        }}>
          <span className="gradient-text">404</span>
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          The rental listing or directory page you are looking for may have been relocated, renamed, or is temporarily offline.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link to="/properties" className="btn btn-secondary">
            <Compass size={18} />
            <span>Browse All Listings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
