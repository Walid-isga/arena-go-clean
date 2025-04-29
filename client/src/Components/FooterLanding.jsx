import React from 'react';
import { Link } from 'react-router-dom';
import '../Assets/Landing.css';

export default function FooterLanding() {
  return (
    <footer className="footer-landing">
      <div className="footer-content">
        <h2>ArenaGo</h2>
        <div className="footer-links">
          <Link to="/landing">Accueil</Link>
          <Link to="/apropos">À propos</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p>© 2025 ArenaGo - Tous droits réservés</p>
      </div>
    </footer>
  );
}
