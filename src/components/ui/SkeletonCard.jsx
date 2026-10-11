import React from 'react';

const SkeletonCard = () => {
  return (
    <div
      className="property-card skeleton-card"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Cover Skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          width: '100%',
          height: '220px',
          backgroundColor: 'var(--bg-tertiary)',
        }}
      />

      <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.75rem' }}>
        {/* Title skeleton */}
        <div
          className="skeleton-pulse"
          style={{ width: '80%', height: '22px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
        />
        {/* Location skeleton */}
        <div
          className="skeleton-pulse"
          style={{ width: '55%', height: '16px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
        />
        {/* Description lines */}
        <div
          className="skeleton-pulse"
          style={{ width: '100%', height: '14px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
        />
        <div
          className="skeleton-pulse"
          style={{ width: '90%', height: '14px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
        />

        {/* Specs row skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: '100%',
            height: '36px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-tertiary)',
            marginTop: 'auto',
          }}
        />

        {/* Footer buttons skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
          <div
            className="skeleton-pulse"
            style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)' }}
          />
          <div
            className="skeleton-pulse"
            style={{ width: '110px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
