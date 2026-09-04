import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Instagram, Linkedin, Github } from 'lucide-react';

// Custom SVG for new X (formerly Twitter) logo
const XIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="nav-brand" style={{ marginBottom: '1rem' }}>
              <div className="nav-brand-icon">
                <Building2 size={22} />
              </div>
              <span>Rental<span className="gradient-text">Hub</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              The premier marketplace connecting discerning tenants with verified property owners. Experience seamless digital leasing, secure Stripe payments, and transparent reviews.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="theme-toggle-btn" title="Follow us on X">
                <XIcon size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="theme-toggle-btn" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="theme-toggle-btn" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="theme-toggle-btn" title="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem', color: 'var(--text-muted)' }}>
              <li><Link to="/" style={{ transition: 'color 0.2s' }}>Home</Link></li>
              <li><Link to="/properties" style={{ transition: 'color 0.2s' }}>All Properties</Link></li>
              <li><Link to="/properties?propertyType=Apartment" style={{ transition: 'color 0.2s' }}>Apartments</Link></li>
              <li><Link to="/properties?propertyType=Villa" style={{ transition: 'color 0.2s' }}>Luxury Villas</Link></li>
              <li><Link to="/properties?propertyType=Studio" style={{ transition: 'color 0.2s' }}>Urban Studios</Link></li>
            </ul>
          </div>

          {/* Dashboards & Account */}
          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem', color: 'var(--text-muted)' }}>
              <li><Link to="/dashboard/tenant">Tenant Dashboard</Link></li>
              <li><Link to="/dashboard/owner">Owner Dashboard</Link></li>
              <li><Link to="/dashboard/admin">Admin Portal</Link></li>
              <li><Link to="/login">Account Sign In</Link></li>
              <li><Link to="/register">Register Listing</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--accent-primary)" />
                <span>100 Ocean Drive, Miami, FL 33139</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} color="var(--accent-primary)" />
                <span>+1 (800) 555-RENT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--accent-primary)" />
                <span>support@rentalhub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RentalHub Marketplace Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#cookies" style={{ color: 'var(--text-muted)' }}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
