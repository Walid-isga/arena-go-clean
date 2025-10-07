import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarLanding from '../Components/NavbarLanding';
import FooterLanding from '../Components/FooterLanding';
import '../Assets/Landing.css';
import axios from '../axiosConfig';
import { useTheme, useMediaQuery } from '@mui/material';

export default function LandingPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await axios.get('/fields');
        const data = Array.isArray(res.data) ? res.data : [];
        setFields(data);
      } catch (err) {
        console.error("Erreur récupération terrains :", err.message);
        setFields([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".slide-in");
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

      {/* LOGO + SLOGAN */}
      <section className="logo-section">
        <img src="/images/arenalanding.png" alt="ArenaGo Logo" className="hero-logo animated-fade" />
      </section>
      <section className="slogan-section">
        <h2 className="hero-slogan animated-fade">L'expérience ultime du sport au Maroc.</h2>
      </section>

      {/* PRESENTATION */}
      <section className="presentation-section">
        <p>Réservez facilement le meilleur espace pour votre sport, où que vous soyez au Maroc.</p>
        <p>Rapide, fiable, accessible : avec ArenaGo, le match commence avant même d’entrer sur le terrain.</p>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="events-section">
        <h2>Nos Espaces Sportifs</h2>

        {loading ? (
          <p>Chargement des terrains...</p>
        ) : fields.length > 0 ? (
          fields.map((field, index) => {
            const isEven = index % 2 === 0;
            const photoPath = field.photos?.[0];
            const imageUrl = photoPath
              ? `http://205.209.106.203:5001/uploads/${photoPath.replace(/^uploads[\\/]+/, "")}`
              : null;

            return (
              <div key={field._id} className={`event-block slide-in ${isEven ? 'left' : 'right'}`}>
                {isEven ? (
                  <>
                    <div className="event-image-wrapper">
                      {imageUrl ? (
                        <img src={imageUrl} alt={field.name} className="event-block-image" />
                      ) : (
                        <div className="no-image">Image non disponible</div>
                      )}
                    </div>
                    <div className="event-description">
                      <h3>{field.name}</h3>
                      <p className="event-city">📍 {field.location?.city || "Ville inconnue"}</p>
                      <p className="event-text">{field.publicDescription || "Aucune description publique disponible."}</p>
                      <button className="btn-hero" onClick={() => navigate(`/field/${field._id}`)}>En savoir plus</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="event-description">
                      <h3>{field.name}</h3>
                      <p className="event-city">📍 {field.location?.city || "Ville inconnue"}</p>
                      <p className="event-text">{field.publicDescription || "Aucune description publique disponible."}</p>
                      <button className="btn-hero" onClick={() => navigate(`/field/${field._id}`)}>En savoir plus</button>
                    </div>
                    <div className="event-image-wrapper">
                      {imageUrl ? (
                        <img src={imageUrl} alt={field.name} className="event-block-image" />
                      ) : (
                        <div className="no-image">Image non disponible</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>Aucun terrain disponible pour le moment.</p>
        )}
      </section>

      <FooterLanding />
    </div>
  );
}
