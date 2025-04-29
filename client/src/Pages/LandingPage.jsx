import React, { useState, useEffect } from 'react';
import NavbarLanding from '../Components/NavbarLanding';
import FooterLanding from '../Components/FooterLanding';
import '../Assets/Landing.css';
import axios from 'axios';

export default function LandingPage() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await axios.get('/fields');
        setFields(res.data);
      } catch (err) {
        console.error("Erreur récupération terrains :", err);
      }
    };
    fetchFields();
  }, []);

  return (
    <div className="landing-layout">
      <NavbarLanding />

      {/* HERO SECTION */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>Bienvenue sur ArenaGo</h1>
          <p>Réservez vos terrains sportifs en un clic !</p>
          <a href="#events" className="btn-hero">Découvrir les terrains</a>
        </div>
      </section>

      {/* LOGO SECTION */}
      <section className="logo-section">
        <img src="/images/arenalanding.png" alt="ArenaGo Logo" className="hero-logo animated-fade" />
      </section>

      {/* SLOGAN SECTION */}
      <section className="slogan-section">
        <h2 className="hero-slogan animated-fade">L'expérience ultime du sport au Maroc.</h2>
      </section>

      {/* PRESENTATION SECTION */}
      <section className="presentation-section">
        <p>Réservez facilement le meilleur espace pour votre sport, où que vous soyez au Maroc.</p>
        <p>Rapide, fiable, accessible : avec ArenaGo, le match commence avant même d’entrer sur le terrain.</p>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="events-section">
        <h2>Nos Événements Sportifs</h2>
        <div className="events-grid">
          {fields.length > 0 ? (
            fields.map((field) => (
              <div key={field._id} className="event-card">
                {field.photos && field.photos.length > 0 ? (
                  <img
                    src={`/${field.photos[0]}`}
                    alt={field.name}
                    className="event-image"
                  />
                ) : (
                  <div className="no-image">Pas d'image</div>
                )}
                <h3>{field.name}</h3>
                <p>{field.location?.city || "Ville inconnue"}</p>
              </div>
            ))
          ) : (
            <p>Chargement des terrains...</p>
          )}
        </div>
      </section>

      <FooterLanding />
    </div>
  );
}
