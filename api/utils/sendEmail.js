import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ Fonction : email de confirmation
export const sendBookingConfirmation = async ({ to, teamName, date, starttime, endtime, field }) => {
  console.log("📩 Envoi de l'email de confirmation à :", to);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "✅ Confirmation de votre réservation - Sportify",
    html: `
      <h2>✅ Réservation confirmée !</h2>
      <p>Bonjour ${teamName},</p>
      <p>Votre réservation a bien été enregistrée :</p>
      <ul>
        <li><strong>Terrain :</strong> ${field}</li>
        <li><strong>Date :</strong> ${date}</li>
        <li><strong>Heure :</strong> de ${starttime} à ${endtime}</li>
      </ul>
      <p>Merci de votre confiance 🙌<br>— L’équipe Sportify</p>
    `,
  });

  console.log("📧 E-mail envoyé avec succès : %s", info.messageId);
};

// ❌ Fonction : email de refus
export const sendBookingRefusal = async ({ to, teamName, date, starttime, endtime, field }) => {
  console.log("📩 Envoi de l'email de refus à :", to);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "❌ Réservation refusée - Sportify",
    html: `
      <h2>❌ Réservation refusée</h2>
      <p>Bonjour ${teamName},</p>
      <p>Nous sommes désolés de vous informer que votre demande de réservation a été refusée :</p>
      <ul>
        <li><strong>Terrain :</strong> ${field}</li>
        <li><strong>Date :</strong> ${date}</li>
        <li><strong>Heure :</strong> de ${starttime} à ${endtime}</li>
      </ul>
      <p>N’hésitez pas à réserver à un autre créneau disponible.<br>— L’équipe Sportify</p>
    `,
  });

  console.log("📧 E-mail de refus envoyé : %s", info.messageId);
};

export const sendWelcomeEmail = async ({ to, username }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "🎉 Bienvenue sur Sportify !",
    html: `
      <h2>Bienvenue ${username} 👋</h2>
      <p>Ton compte a bien été vérifié.</p>
      <p>Tu peux maintenant réserver un terrain !</p>
      <a href="http://localhost:3000/home" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réserver maintenant</a>
      <p>— L’équipe Sportify</p>
    `,
  });

  console.log("📧 E-mail de bienvenue envoyé à :", to);
};
