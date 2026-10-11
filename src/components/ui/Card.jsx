import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = '1.5rem',
  style = {},
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`custom-card ${hoverEffect ? 'custom-card-hover' : ''} ${className}`.trim()}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding,
        boxShadow: 'var(--shadow-md)',
        transition: hoverEffect ? 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
