import React from 'react';

export default function LotusWatermark({ opacity = 0.15, className = "" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <path d="M50 10 C50 10, 60 40, 90 50 C60 60, 50 90, 50 90 C50 90, 40 60, 10 50 C40 40, 50 10, 50 10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 20 C50 20, 55 45, 80 50 C55 55, 50 80, 50 80 C50 80, 45 55, 20 50 C45 45, 50 20, 50 20" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}