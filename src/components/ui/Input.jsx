import React from 'react';

const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  icon = null,
  className = '',
  style = {},
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`form-group ${className}`.trim()} style={{ marginBottom: '1.25rem', ...style }}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`form-input ${error ? 'input-error' : ''}`}
          style={{
            paddingLeft: icon ? '2.5rem' : '1rem',
            borderColor: error ? 'var(--danger)' : undefined,
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
