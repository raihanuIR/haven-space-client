import React from 'react';

const Badge = ({
  children,
  variant = 'approved', // 'approved' | 'pending' | 'rejected' | 'role' | 'primary' | 'warning' | 'info'
  icon = null,
  className = '',
  style = {},
  ...props
}) => {
  const variantClass = `badge-${variant}`;

  return (
    <span
      className={`badge ${variantClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
