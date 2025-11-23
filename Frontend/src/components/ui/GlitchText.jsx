import React from 'react';
import './GlitchText.css'; // We'll need to ensure the CSS is available or inline it

const GlitchText = ({ text, className = '' }) => {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <span className="glitch" data-text={text}>
        {text}
      </span>
    </div>
  );
};

export default GlitchText;
