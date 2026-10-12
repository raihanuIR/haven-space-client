import React, { useState, useEffect } from 'react';
import { Edit3, CheckCircle2, AlertCircle, Image, Building2 } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import API from '../services/api';

const ALL_AMENITIES = [
  'WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Air Conditioning',
  'Pets Allowed', 'Furnished', 'Balcony', 'Garden', 'Elevator', 'Security System'
];

const EditPropertyModal = ({ isOpen, onClose, property, onPropertyUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    propertyType: 'Apartment',
    rentPrice: '',
    rentType: 'Monthly',
    bedrooms: '1',
    bathrooms: '1',
    propertySize: '750',
    amenities: [],
    imagesText: '',
    extraFeatures: '',
    ownerPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        location: property.location || '',
        propertyType: property.propertyType || 'Apartment',
        rentPrice: property.rentPrice || '',
        rentType: property.rentType || 'Monthly',
        bedrooms: property.bedrooms || '1',
        bathrooms: property.bathrooms || '1',
        propertySize: property.propertySize || '750',
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        imagesText: Array.isArray(property.images) ? property.images.join('\n') : (property.images || ''),
        extraFeatures: property.extraFeatures || '',
        ownerPhone: property.owner?.phone || '',
      });
      setError('');
      setSuccess('');
    }
  }, [property, isOpen]);

  const toggleAmenity = (name) => {
    if (formData.amenities.includes(name)) {
      setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== name) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, name] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a property title.');
      return;
    }
    if (!formData.rentPrice || Number(formData.rentPrice) <= 0) {
      setError('Please provide a valid rent price.');
      return;
    }

    const imagesArray = formData.imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    if (imagesArray.length === 0) {
      setError('Please include at least one property image URL.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        propertyType: formData.propertyType,
        rentPrice: Number(formData.rentPrice),
        rentType: formData.rentType,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        propertySize: Number(formData.propertySize),
        amenities: formData.amenities,
        images: imagesArray,
        extraFeatures: formData.extraFeatures,
        'owner.phone': formData.ownerPhone,
      };

      const { data } = await API.put(`/properties/${property._id}`, payload);
      if (data.success) {
        setSuccess('Property successfully updated!');
        if (onPropertyUpdated) {
          onPropertyUpdated(data.property || { ...property, ...payload });
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(data.message || 'Failed to update property');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating property');
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Property Listing"
      maxWidth="680px"
    >
      <div style={{ maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: 'var(--success-bg)',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              required
              rows="3"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Property Type *</label>
              <select
                className="form-select"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
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

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Rent Price (USD) *</label>
              <input
                type="number"
                required
                min="1"
                className="form-input"
                value={formData.rentPrice}
                onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Cycle *</label>
              <select
                className="form-select"
                value={formData.rentType}
                onChange={(e) => setFormData({ ...formData, rentType: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Bedrooms *</label>
              <input
                type="number"
                min="1"
                required
                className="form-input"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bathrooms *</label>
              <input
                type="number"
                min="1"
                required
                className="form-input"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Size (sqft) *</label>
              <input
                type="number"
                min="50"
                required
                className="form-input"
                value={formData.propertySize}
                onChange={(e) => setFormData({ ...formData, propertySize: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amenities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ALL_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Images (One URL per line) *</label>
            <textarea
              required
              rows="3"
              className="form-textarea"
              value={formData.imagesText}
              onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Extra Features</label>
            <input
              type="text"
              className="form-input"
              value={formData.extraFeatures}
              onChange={(e) => setFormData({ ...formData, extraFeatures: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ flex: 1 }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditPropertyModal;
