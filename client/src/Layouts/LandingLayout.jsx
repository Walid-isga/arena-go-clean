import React from 'react';
import "../Assets/Landing.css"; // on applique le CSS spécial Landing seulement ici

export default function LandingLayout({ children }) {
  return (
    <div className="landing-layout">
      {children}
    </div>
  );
}
