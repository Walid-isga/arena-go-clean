import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendOTP = async (toEmail, otp) => {
  const API_KEY = process.env.BREVO_API_KEY;

  const payload = {
    sender: { name: "ArenaGo", email: "walidfath02@gmail.com" },
    to: [{ email: toEmail }],
    subject: "Votre code de vérification ArenaGo",
    htmlContent: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #003566; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">🔐 Vérification ArenaGo</h2>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Bonjour,</p>
            <p style="font-size: 16px;">Merci de vous être inscrit sur <strong>ArenaGo</strong> !</p>
            <p style="font-size: 16px;">Voici votre code de vérification :</p>
            <div style="margin: 30px auto; text-align: center;">
              <span style="display: inline-block; background-color: #FF6B00; color: white; font-size: 28px; font-weight: bold; padding: 12px 24px; border-radius: 8px; letter-spacing: 2px;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #555;">Ce code est valable pendant <strong>10 minutes</strong>.</p>
            <p style="font-size: 14px; color: #999; margin-top: 40px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © 2025 ArenaGo. Tous droits réservés.
          </div>
        </div>
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
