import React from 'react';
import './spinner.css';

const MedievalSpinner = () => (
  <div className="medieval-spinner" title="Loading...">
    <svg
      width="50"
      height="50"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 4h32M16 60h32M16 4v12l16 16-16 16v12M48 4v12l-16 16 16 16v12"
        stroke="#a17c50"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 28v8" stroke="#a17c50" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

export default MedievalSpinner;