import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Assets/images/Arenago.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../Assets/Landing.css';

export default function NavbarLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar-landing">
      <div className="navbar-content">
        <img src={Logo} alt="ArenaGo Logo" className="logo" />

        {/* 🔽 Icone burger mobile */}
        <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </div>

        {/* 🔽 Navigation - Desktop + Mobile */}
        <nav className={`navbar-right ${menuOpen ? "open" : ""}`}>
          <div className="navbar-links">
            <Link to="/landing" onClick={() => setMenuOpen(false)}>Accueil</Link>
            <Link to="/apropos" onClick={() => setMenuOpen(false)}>À propos</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
          <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Se connecter</Link>
          <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Créer un compte</Link>
        </nav>
      </div>
    </header>
  );
}
