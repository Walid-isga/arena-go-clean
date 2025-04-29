import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // 587 = false
        requireTLS: true, // très important pour Office365
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      });
      

      await transporter.sendMail({
        from: process.env.EMAIL_FROM, // ✅ c'est ton propre mail
        to: "rzlt404@gmail.com", // ✅ destination admin
        subject: "Nouveau message de contact ArenaGo",
        replyTo: email, // ✅ réponse directe au visiteur
        html: `
          <h3>Informations du contact :</h3>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong><br/>${message}</p>
        `
      });
      

    res.status(200).json({ message: "Message envoyé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'envoi du message." });
  }
});

export default router;
