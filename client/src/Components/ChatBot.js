import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Salut 👋 Que veux-tu savoir ?" },
  ]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleQuickReply = (question, response) => {
    const userMsg = { sender: "user", text: question };
    const botMsg = { sender: "bot", text: response };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const quickReplies = [
    {
      question: "Comment réserver un terrain ?",
      answer: "Clique sur 'Réserver' dans le menu et choisis ton créneau 📅.",
    },
    {
      question: "Quels créneaux sont disponibles ?",
      answer: "Tous les créneaux libres sont visibles dans le calendrier en ligne ⏰.",
    },
    {
      question: "Comment annuler une réservation ?",
      answer: "Va dans ton profil > réservations > annuler ❌.",
    },
    {
      question: "Comment contacter le support ?",
      answer: "Utilise la page 'Contact' ou envoie-nous un message depuis ton espace client 📩.",
    },
  ];

  return (
    <>
      {/* Icône flottante */}
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#1e40af", // bleu foncé
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          cursor: "pointer",
          zIndex: 999,
        }}
      >
        <MessageCircle color="#fff" size={28} />
      </div>

      {/* Fenêtre chatbot */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "320px",
            backgroundColor: "#111827", // gris très foncé
            borderRadius: "12px",
            padding: "15px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            zIndex: 1000,
            color: "#e5e7eb", // texte clair
          }}
        >
          <h4 style={{ marginBottom: "10px", color: "#93c5fd" }}>🤖 Sportify Assistant</h4>
          <div style={{ maxHeight: "220px", overflowY: "auto", marginBottom: "10px" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    backgroundColor: msg.sender === "user" ? "#1d4ed8" : "#374151", // bleu & gris foncé
                    color: "#fff",
                    borderRadius: "16px",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Boutons de réponse rapide */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {quickReplies.map((item, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(item.question, item.answer)}
                style={{
                  padding: "8px",
                  backgroundColor: "#1e293b", // gris nuit
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  textAlign: "left",
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "#e5e7eb",
                }}
              >
                {item.question}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
