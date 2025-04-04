import React from 'react';

const Input = ({ type, name, placeholder, value, onChange, required, className, ...props }) => {
  return (
    <input
      type={type || 'text'}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`input ${className || ''}`}
      {...props}
    />
  );
};

export default Input;