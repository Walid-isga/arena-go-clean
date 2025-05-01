import express from 'express';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: 'admin@arenago.ma', name: 'Admin ArenaGo' }];
  sendSmtpEmail.sender = { name: name, email: email }; // L'expéditeur visible
  sendSmtpEmail.subject = `📨 Nouveau message de ${name}`;
  sendSmtpEmail.htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div style="background-color: #003566; padding: 20px; color: white; text-align: center;">
        <h2 style="margin: 0;">📨 Nouveau message - ArenaGo</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px;"><strong>Nom :</strong> ${name}</p>
        <p style="font-size: 16px;"><strong>Email :</strong> ${email}</p>
        <p style="font-size: 16px;"><strong>Message :</strong></p>
        <p style="font-size: 15px; background-color: #f1f1f1; padding: 15px; border-left: 4px solid #FFA500; border-radius: 4px;">
          ${message}
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 14px; color: #888;">Ce message a été envoyé depuis le formulaire de contact d’ArenaGo.</p>
      </div>
    </div>
  </div>
`;


  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: "✅ Email envoyé avec succès via Brevo API." });
  } catch (error) {
    console.error("❌ Erreur Brevo API :", error.response?.body || error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message." });
  }
});

export default router;
