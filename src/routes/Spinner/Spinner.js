import React from 'react';
import './Spinner.css';
import spinnerGif from '../Spinner/logo_animated.gif';

function Spinner() {
  return (
    <div className="spinner-container">
      <img src={spinnerGif} alt="Loading..." className="spinner-gif" />
    </div>
  );
}

export default Spinner;
