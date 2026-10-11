import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize2, Share2, Heart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PropertyCard = ({ property, onShare, onToggleFavorite, isFavorite = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    // Remontada Rule: Details Page must be publicly accessible!
    navigate(`/properties/${property._id}`);
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
          ${property.rentPrice?.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/{property.rentType?.toLowerCase()}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="property-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <div className="property-card-location" style={{ marginBottom: 0 }}>
            <MapPin size={14} color="var(--accent-primary)" />
            <span>{property.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>4.9</span>
          </div>
        </div>

        <h3 className="property-card-title" title={property.title} onClick={handleDetailsClick} style={{ cursor: 'pointer' }}>
          {property.title}
        </h3>

        {/* Short Description */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.45',
          minHeight: '2.5rem',
        }}>
          {property.description || 'Premium rental property equipped with modern finishes and prime location.'}
        </p>

        {/* Specifications */}
        <div className="property-specs-row">
          <div className="property-spec-item" title="Bedrooms">
            <Bed size={15} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="property-spec-item" title="Bathrooms">
            <Bath size={15} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="property-spec-item" title="Living Area">
            <Maximize2 size={15} />
            <span>{property.propertySize} sqft</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="property-card-footer">
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(property);
                }}
                className="theme-toggle-btn"
                style={{ width: '34px', height: '34px' }}
                title="Share Listing"
              >
                <Share2 size={15} />
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
                  width: '34px',
                  height: '34px',
                  color: isFavorite ? 'var(--danger)' : 'var(--text-secondary)',
                }}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
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
