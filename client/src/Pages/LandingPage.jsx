import React, { useState, useEffect } from 'react';
import NavbarLanding from '../Components/NavbarLanding';
import FooterLanding from '../Components/FooterLanding';
import '../Assets/Landing.css';
import axios from '../axiosConfig'; // ✅ utilise la config avec baseURL dynamique
import { getImageUrl } from "../utils/getImageUrl";

export default function LandingPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await axios.get('/fields');
        const data = res.data;

        // ✅ Sécurité : si data n’est pas un tableau, on ignore
        setFields(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur récupération terrains :", err.message);
        setFields([]); // fallback vide en cas d’erreur
      } finally {
        setLoading(false);
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
    {loading ? (
      <p>Chargement des terrains...</p>
    ) : fields.length > 0 ? (
      fields.map((field) => {
        console.log("🧩 Field complet reçu :", field); // <= ici
      
        return (
          <div key={field._id} className="event-card">
            {field.photos?.length > 0 && field.photos[0] ? (
              <img
                src={`https://arena-go-clean-production.up.railway.app/uploads/${field.photos[0].replace(/^uploads[\\/]+/, "")}`}
                alt={field.name}
                className="event-image"
              />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}
            <h3>{field.name}</h3>
            <p>{field.location?.city || "Ville inconnue"}</p>
          </div>
        );
      })
      
    ) : (
      <p>Aucun terrain disponible pour le moment.</p>
    )}
  </div>
</section>


      <FooterLanding />
    </div>
  );
}
