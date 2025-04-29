import React from 'react';
import NavbarLanding from '../Components/NavbarLanding';
import FooterLanding from '../Components/FooterLanding';
import '../Assets/Landing.css'; // Assure-toi que tu as bien ton CSS global ici

export default function Apropos() {
  return (
    <div className="landing-layout">
      <NavbarLanding />

      <section className="apropos-hero">
        <h1>Découvrez ArenaGo</h1>
        <p className="apropos-subtitle">RÉSERVEZ. JOUEZ. GAGNEZ.</p>
      </section>

      <section className="apropos-section">
        <h2>Qui sommes-nous ?</h2>
        <p>
          ArenaGo est une plateforme numérique marocaine spécialisée dans la réservation de terrains sportifs.
          Notre projet est né d’une idée claire : <strong>faciliter et moderniser l’accès</strong> à des espaces
          sportifs de qualité au Maroc.
        </p>
        <p>
          Nous sommes convaincus que le sport n’est pas seulement une activité physique, mais aussi
          un <strong>moyen de créer des liens</strong>, de se dépasser et de s’épanouir.
          C’est pourquoi nous travaillons chaque jour pour offrir à nos utilisateurs une expérience mêlant
          simplicité, rapidité et fiabilité.
        </p>
        <p>
          ArenaGo s’adresse aux sportifs amateurs, aux équipes, aux clubs et à toutes les personnes souhaitant
          trouver et réserver facilement, en toute sécurité, <strong>le terrain idéal</strong> adapté à leurs besoins.
        </p>
      </section>

      <section className="apropos-section">
        <h2>Que faisons-nous ?</h2>
        <p>
          ArenaGo connecte les sportifs aux meilleurs terrains disponibles à travers tout le Maroc.
          Grâce à notre plateforme intuitive, vous pouvez :
        </p>
        <ul className="apropos-list">
          <li>Consulter en temps réel la disponibilité des terrains,</li>
          <li>Comparer les caractéristiques de chaque installation,</li>
          <li>Réserver facilement sans appels ni déplacements inutiles.</li>
        </ul>
        <p>
          Nous élargissons continuellement notre réseau de partenaires pour offrir encore plus de choix
          et de proximité à nos utilisateurs.
        </p>
      </section>

      <section className="apropos-section">
        <h2>Où sommes-nous ?</h2>
        <p>
          ArenaGo est présent sur l’ensemble du territoire marocain : Casablanca, Rabat, Marrakech
          ainsi que dans d'autres villes en expansion sportive.
        </p>
        <p>
          Notre objectif est simple : <strong>rendre le sport accessible partout au Maroc</strong> grâce à un réseau
          toujours plus large de centres sportifs partenaires.
        </p>
      </section>

      <section className="apropos-section">
        <h2>Nos installations</h2>
        <p>
          Chaque terrain proposé sur ArenaGo est sélectionné rigoureusement pour garantir :
        </p>
        <ul className="apropos-list">
          <li>Des surfaces en excellent état (gazon naturel, synthétique, parquet...),</li>
          <li>Des équipements modernes (buts, paniers, filets, éclairage nocturne...),</li>
          <li>Des espaces sécurisés et accessibles à tous,</li>
          <li>Des services complémentaires : vestiaires, douches, zones de repos.</li>
        </ul>
      </section>

      <section className="apropos-section">
        <h2>Nos équipements sportifs</h2>
        <p>
          ArenaGo accorde une grande importance à la qualité du matériel sportif :
        </p>
        <ul className="apropos-list">
          <li>Ballons officiels (football, basketball, padel, rugby),</li>
          <li>Buts et filets homologués,</li>
          <li>Équipements complémentaires vérifiés régulièrement.</li>
        </ul>
        <p>
          Nous garantissons à nos utilisateurs un matériel fiable et de haute qualité pour chaque réservation.
        </p>
      </section>

      <section className="apropos-section">
        <h2>Notre engagement</h2>
        <p>
          ArenaGo n’est pas seulement une plateforme de réservation : c’est un projet engagé pour le développement
          du sport au Maroc.
        </p>
        <ul className="apropos-list">
          <li>Améliorer la qualité et l’accessibilité des terrains sportifs,</li>
          <li>Étendre notre réseau pour couvrir tout le pays,</li>
          <li>Moderniser l’expérience de réservation sportive,</li>
          <li>Promouvoir le sport comme vecteur de bien-être, d’inclusion et d’épanouissement.</li>
        </ul>
        <p>
          Chez ArenaGo, nous croyons que le sport transforme des vies. C’est pourquoi nous nous engageons
          chaque jour pour offrir une expérience sportive simple, rapide et de confiance à tous les passionnés au Maroc.
        </p>
      </section>

      <FooterLanding />
    </div>
  );
}
