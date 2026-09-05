import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

const ShareModal = ({ property, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !property) return null;

  const shareUrl = `${window.location.origin}/properties/${property._id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Check out this property: ${property.title} on RentalHub!`);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>Share Property</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Share <strong>{property.title}</strong> with friends or across your social networks:
        </p>

        {/* Copy Link Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="form-input"
            style={{ fontSize: '0.85rem' }}
          />
          <button onClick={handleCopy} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="form-grid-3">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            X (Twitter)
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
