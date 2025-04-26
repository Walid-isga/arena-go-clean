// 📁 api/utils/sendOTP.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendOTP = async (toEmail, otp) => {
  const API_KEY = process.env.BREVO_API_KEY;

  const payload = {
    sender: { name: "Sportify", email: "walidfath02@gmail.com" },
    to: [{ email: toEmail }],
    subject: "Votre code de vérification Sportify",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Bienvenue sur Sportify !</h2>
        <p>Voici votre code de vérification :</p>
        <h1 style="color: #4f46e5;">${otp}</h1>
        <p>Ce code est valable pendant 10 minutes.</p>
      </div>
    `,
  };

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Email OTP envoyé à :", toEmail);
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi de l'email :", err.response?.data || err.message);
  }
};
