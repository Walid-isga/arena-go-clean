import React, { useState } from 'react';
import NavbarLanding from '../Components/NavbarLanding';
import FooterLanding from '../Components/FooterLanding';
import '../Assets/Landing.css';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/contact', formData);
      toast.success("✅ Votre message a été envoyé !");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'envoi.");
    }
  };

  return (
    <div className="landing-layout">
      <NavbarLanding />

      <section className="contact-hero">
        <h1>Contactez-nous</h1>
        <p className="contact-subtitle">Un besoin, une question ? Nous sommes là pour vous aider !</p>
      </section>

      <section className="contact-section">
        <div className="contact-container">

          {/* Formulaire */}
          <form className="contact-form animated-fade" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Votre message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="btn-send">Envoyer</button>
          </form>

          {/* Infos de contact rapide */}
          <div className="contact-info animated-fade">
            <h3>Informations</h3>
            <p><strong>✉️ Email:</strong>admin@arenago.ma</p>
            <p><strong>📞 Téléphone :</strong> 0650190927</p>
            <p><strong>📍 Adresse :</strong> Rabat, Maroc</p>
          </div>

        </div>
      </section>

      <FooterLanding />
    </div>
  );
}
