import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Assets/images/Arenago.png';
import '../Assets/Landing.css';

export default function NavbarLanding() {
  return (
    <header className="navbar-landing">
      <div className="navbar-content">
        <img src={Logo} alt="ArenaGo Logo" className="logo" />
        <nav className="navbar-right">

          {/* 👉 Regroupe les liens "texte" dans un div spécial */}
          <div className="navbar-links">
            <Link to="/landing">Accueil</Link>
            <Link to="/apropos">À propos</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* 👉 Les deux boutons restent indépendants */}
          <Link to="/login" className="btn-login">Se connecter</Link>
          <Link to="/register" className="btn-register">Créer un compte</Link>
        </nav>
      </div>
    </header>
  );
}
