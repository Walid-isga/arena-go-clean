import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// HTML Wrapper
const wrapHtml = (title, content) => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f6f6f6; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color: #003566; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">${title}</h2>
      </div>
      <div style="padding: 30px; color: #333;">
        ${content}
      </div>
      <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        © 2025 ArenaGo. Tous droits réservés.
      </div>
    </div>
  </div>
`;

// ✅ Confirmation
export const sendBookingConfirmation = async ({ to, teamName, date, starttime, endtime, field }) => {
  const content = `
    <p>Bonjour <strong>${teamName}</strong>,</p>
    <p>✅ Votre réservation a été confirmée avec succès :</p>
    <ul>
      <li><strong>Terrain :</strong> ${field}</li>
      <li><strong>Date :</strong> ${date}</li>
      <li><strong>Heure :</strong> de ${starttime} à ${endtime}</li>
    </ul>
    <p>Merci de votre confiance 🙌<br/>— L’équipe <strong>ArenaGo</strong></p>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "✅ Confirmation de votre réservation - ArenaGo",
    html: wrapHtml("✅ Réservation confirmée", content),
  });

  console.log("📧 E-mail de confirmation envoyé : %s", info.messageId);
};

// ❌ Refus
export const sendBookingRefusal = async ({ to, teamName, date, starttime, endtime, field }) => {
  const content = `
    <p>Bonjour <strong>${teamName}</strong>,</p>
    <p>❌ Nous sommes désolés de vous informer que votre demande a été refusée :</p>
    <ul>
      <li><strong>Terrain :</strong> ${field}</li>
      <li><strong>Date :</strong> ${date}</li>
      <li><strong>Heure :</strong> de ${starttime} à ${endtime}</li>
    </ul>
    <p>Nous vous invitons à choisir un autre créneau sur ArenaGo.<br/>— L’équipe <strong>ArenaGo</strong></p>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "❌ Réservation refusée - ArenaGo",
    html: wrapHtml("❌ Réservation refusée", content),
  });

  console.log("📧 E-mail de refus envoyé : %s", info.messageId);
};

// 🎉 Bienvenue
export const sendWelcomeEmail = async ({ to, username }) => {
  const content = `
    <p>Bienvenue <strong>${username}</strong> 👋</p>
    <p>Ton compte a bien été vérifié. Tu peux maintenant réserver un terrain sur notre plateforme.</p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://arenago.vercel.app/" style="background-color: #FF6B00; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Réserver maintenant</a>
    </div>
    <p style="margin-top: 30px;">À bientôt sur <strong>ArenaGo</strong> !</p>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "🎉 Bienvenue sur ArenaGo !",
    html: wrapHtml("🎉 Bienvenue sur ArenaGo", content),
  });

  console.log("📧 E-mail de bienvenue envoyé à :", to);
};
