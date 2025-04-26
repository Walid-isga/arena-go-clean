import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const message = req.body.message?.toLowerCase() || "";

  const responses = [
    {
      keywords: ["réserver", "terrain"],
      reply: "Pour réserver, clique sur 'Réserver' dans le menu et choisis ton créneau 🕒.",
    },
    {
      keywords: ["disponible", "créneau", "horaire"],
      reply: "Les créneaux disponibles s'affichent automatiquement dans le calendrier 📅.",
    },
    {
      keywords: ["annuler", "supprimer", "réservation"],
      reply: "Tu peux annuler ta réservation depuis ton profil > mes réservations ❌.",
    },
    {
      keywords: ["aide", "support"],
      reply: "Besoin d'aide ? Contacte notre support via la section 'Contact' 📞.",
    },
  ];

  const found = responses.find(r =>
    r.keywords.some(keyword => message.includes(keyword))
  );

  res.json({
    response: found?.reply || "Je ne suis pas sûr de comprendre 😅. Tu peux reformuler ?",
  });
});

export default router;
