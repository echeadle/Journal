import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  fullWidth = false,
  multiline = false,
  rows = 3,
  className = ''
}) => {
  const inputClassNames = [
    'input',
    error && 'input--error',
    fullWidth && 'input--full-width',
    className
  ].filter(Boolean).join(' ');

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <InputComponent
        type={!multiline ? type : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={multiline ? rows : undefined}
        className={inputClassNames}
      />
      {error && (
        <span className="input-error-message">{error}</span>
      )}
    </div>
  );
};

export default Input;
