import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize2, Share2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PropertyCard = ({ property, onShare, onToggleFavorite, isFavorite = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    // Specification Rule:
    // If user is not logged in: View Details -> Redirect to Login
    // If logged in: View Details -> Property Details Page
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${property._id}` } } });
    } else {
      navigate(`/properties/${property._id}`);
    }
  };

  return (
    <motion.div
      className="property-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {/* Property Cover Image */}
      <div className="property-card-img-wrapper">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="property-card-img"
          loading="lazy"
        />
        <div className="property-card-badge">
          <span className="badge badge-approved">{property.propertyType}</span>
        </div>
        <div className="property-card-price">
          ${property.rentPrice.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/{property.rentType?.toLowerCase()}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="property-card-body">
        <h3 className="property-card-title" title={property.title}>
          {property.title}
        </h3>

        <div className="property-card-location">
          <MapPin size={15} color="var(--accent-primary)" />
          <span>{property.location}</span>
        </div>

        {/* Specifications */}
        <div className="property-specs-row">
          <div className="property-spec-item" title="Bedrooms">
            <Bed size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="property-spec-item" title="Bathrooms">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="property-spec-item" title="Living Area">
            <Maximize2 size={16} />
            <span>{property.propertySize} sqft</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="property-card-footer">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(property);
                }}
                className="theme-toggle-btn"
                style={{ width: '36px', height: '36px' }}
                title="Share Listing"
              >
                <Share2 size={16} />
              </button>
            )}
            {onToggleFavorite && isAuthenticated && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(property._id);
                }}
                className="theme-toggle-btn"
                style={{
                  width: '36px',
                  height: '36px',
                  color: isFavorite ? 'var(--danger)' : 'var(--text-secondary)',
                }}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          <button
            onClick={handleDetailsClick}
            className="btn btn-primary btn-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
