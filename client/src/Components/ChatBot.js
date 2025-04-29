import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Salut 👋 Que veux-tu savoir ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [pendingBooking, setPendingBooking] = useState({
    terrainId: "",
    terrainName: "",
    date: "",
    time: "",
    teamName: "",
    players: 0,
  });
  const [currentStep, setCurrentStep] = useState("");
  const [availableFields, setAvailableFields] = useState([]);
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);
  const chatEndRef = useRef(null);

  const API_URL_AI = "http://localhost:5001/chat";

  const corrections = {
    "réeservation": "réservation",
    "reseervation": "réservation",
    "rezervation": "réservation",
    "resérvation": "réservation",
    "resérvation": "reservation",
    "terain": "terrain",
    "terrrain": "terrain",
    "statu": "statut",
    "statut de reservation": "statut réservation",
    "resérvation": "réservation",
    // Ajoute ici d'autres fautes courantes si tu veux
  };

  const autocorrectInput = (input) => {
    let corrected = input;
    for (const wrong in corrections) {
      const regex = new RegExp(wrong, "gi");
      corrected = corrected.replace(regex, corrections[wrong]);
    }
    return corrected;
  };

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const token = localStorage.getItem("token");
    const decoded = token ? jwtDecode(token) : null;
    const userId = decoded?.id;
    const lowerInput = autocorrectInput(input.toLowerCase());

    const idRegex = /[a-f0-9]{24}/;
    const reservationIdMatch = input.match(idRegex);
    const reservationId = reservationIdMatch ? reservationIdMatch[0] : null;

    const annulerPattern = /\bannuler\b/;
    const reservationPattern = /\bréservation\b/;
    const mesReservationsPattern = /(mes|voir|afficher).*(réservations)/;
    const statutReservationPattern = /(statut|vérifier).*(réservation)/;
    const reserverPattern = /(réserver|terrain)/;

    if (waitingConfirmation) {
      handleBookingConfirmation(lowerInput);
    } else if (isBooking) {
      await handleBookingConversation(lowerInput);
    }
    else if (annulerPattern.test(lowerInput) && reservationPattern.test(lowerInput) && reservationId) {
      try {
        const response = await fetch(`http://localhost:8000/booking/${reservationId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setMessages((prev) => [...prev, { sender: "bot", text: "✅ Réservation annulée avec succès." }]);
        } else {
          setMessages((prev) => [...prev, { sender: "bot", text: "❌ Échec de l'annulation de la réservation." }]);
        }
      } catch (error) {
        console.error("Erreur annulation :", error);
        setMessages((prev) => [...prev, { sender: "bot", text: "🚫 Erreur serveur lors de l'annulation." }]);
      }
    }
    else if (mesReservationsPattern.test(lowerInput)) {
      try {
        const response = await fetch(`http://localhost:8000/booking/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reservations = await response.json();
        if (reservations.length === 0) {
          setMessages((prev) => [...prev, { sender: "bot", text: "📭 Vous n'avez aucune réservation." }]);
        } else {
          const reservationList = reservations
            .map(
              (res) =>
                `🆔 ID: ${res._id}\n📅 Date: ${res.date}\n⏰ Heure: ${res.starttime} - ${res.endtime}\n🏟️ Terrain: ${res.field.name}\n📌 Statut: ${res.status}`
            )
            .join("\n\n");
          setMessages((prev) => [...prev, { sender: "bot", text: `📋 Vos réservations:\n\n${reservationList}` }]);
        }
      } catch (error) {
        console.error("Erreur reservations:", error);
        setMessages((prev) => [...prev, { sender: "bot", text: "🚫 Erreur serveur lors de la récupération des réservations." }]);
      }
    }
    else if (statutReservationPattern.test(lowerInput) && reservationId) {
      try {
        const response = await fetch(`http://localhost:8000/booking/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const reservation = await response.json();
          setMessages((prev) => [...prev, {
            sender: "bot",
            text: `📄 Détails de la réservation:\n🆔 ID: ${reservation._id}\n📅 Date: ${reservation.date}\n⏰ Heure: ${reservation.starttime} - ${reservation.endtime}\n🏟️ Terrain: ${reservation.field.name}\n📌 Statut: ${reservation.status}`,
          }]);
        } else {
          setMessages((prev) => [...prev, { sender: "bot", text: "❌ Réservation non trouvée." }]);
        }
      } catch (error) {
        console.error("Erreur statut:", error);
        setMessages((prev) => [...prev, { sender: "bot", text: "🚫 Erreur serveur lors de la récupération du statut." }]);
      }
    }
    else if (reserverPattern.test(lowerInput)) {
      setIsBooking(true);
      await loadFields();
      setCurrentStep("terrain");
    }
    else {
      await sendToAI(input);
    }

    setInput("");
  };

  const loadFields = async () => {
    try {
      const response = await fetch("http://localhost:8000/fields");
      const data = await response.json();
      if (Array.isArray(data)) {
        setAvailableFields(data);
        setMessages((prev) => [...prev, { sender: "bot", text: "🏟️ Choisis ton terrain :" }]);
      }
    } catch (error) {
      console.error("Erreur terrains:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Erreur lors du chargement des terrains." }]);
    }
  };

  const handleBookingConversation = async (input) => {
    if (currentStep === "terrain") {
      // attendre clic
    } else if (currentStep === "date") {
      setPendingBooking((prev) => ({ ...prev, date: input }));
      setCurrentStep("time");
      setMessages((prev) => [...prev, { sender: "bot", text: "⏰ À quelle heure ? (ex: 14:00)" }]);
    } else if (currentStep === "time") {
      setPendingBooking((prev) => ({ ...prev, time: input }));
      setCurrentStep("teamName");
      setMessages((prev) => [...prev, { sender: "bot", text: "🏷️ Nom de ton équipe ?" }]);
    } else if (currentStep === "teamName") {
      setPendingBooking((prev) => ({ ...prev, teamName: input }));
      setCurrentStep("players");
      setMessages((prev) => [...prev, { sender: "bot", text: "👥 Combien de joueurs ?" }]);
    } else if (currentStep === "players") {
      setPendingBooking((prev) => ({ ...prev, players: parseInt(input) }));
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `✅ Résumé :\n- Terrain : ${pendingBooking.terrainName}\n- Date : ${pendingBooking.date}\n- Heure : ${pendingBooking.time}\n- Équipe : ${pendingBooking.teamName}\n- Joueurs : ${input}\n\nVeux-tu confirmer ? (Oui / Non)`,
        },
      ]);
      setWaitingConfirmation(true);
    }
  };

  const handleBookingConfirmation = async (input) => {
    if (input === "oui" || input === "yes") {
      await createBooking(pendingBooking);
    } else {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Réservation annulée." }]);
    }
    resetBooking();
  };

  const resetBooking = () => {
    setIsBooking(false);
    setWaitingConfirmation(false);
    setCurrentStep("");
    setAvailableFields([]);
    setPendingBooking({
      terrainId: "",
      terrainName: "",
      date: "",
      time: "",
      teamName: "",
      players: 0,
    });
  };

  const selectField = (field) => {
    setPendingBooking((prev) => ({
      ...prev,
      terrainId: field._id,
      terrainName: field.name,
    }));
    setCurrentStep("date");
    setMessages((prev) => [...prev, { sender: "bot", text: "📅 Quelle date ? (ex: 2025-04-27)" }]);
  };

  const createBooking = async (bookingData) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const res = await fetch("http://localhost:8000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: bookingData.terrainId,
          user: userId,
          date: bookingData.date,
          starttime: bookingData.time,
          endtime: addOneHour(bookingData.time),
          status: "Pending",
          teamName: bookingData.teamName,
          players: bookingData.players,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: "🎉 Réservation faite avec succès !" }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: `❌ ${result.message}` }]);
      }
    } catch (error) {
      console.error("Erreur booking:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "🚫 Erreur serveur." }]);
    }
  };

  const addOneHour = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return `${(hour + 1) % 24}:${minute.toString().padStart(2, "0")}`;
  };

  const sendToAI = async (userInput) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_AI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply || "🤖 Je n'ai pas compris." }]);
    } catch (error) {
      console.error("Erreur AI:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "🚫 Erreur serveur." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={toggleChat}
        style={{
          position: "fixed", bottom: "20px", right: "20px",
          width: "60px", height: "60px", backgroundColor: "#1e40af",
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.4)", zIndex: 999,
        }}
      >
        <MessageCircle color="#fff" size={28} />
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed", bottom: "100px", right: "20px",
            width: "320px", backgroundColor: "#111827",
            borderRadius: "12px", padding: "15px", color: "#e5e7eb",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)", height: "420px", display: "flex", flexDirection: "column", zIndex: 1000,
          }}
        >
          <h4 style={{ color: "#93c5fd", marginBottom: "10px" }}>🤖 ArenaGo Assistant</h4>

          <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "10px" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "6px" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    backgroundColor: msg.sender === "user" ? "#1d4ed8" : "#374151",
                    color: "#fff",
                    borderRadius: "16px",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {currentStep === "terrain" && availableFields.length > 0 && (
              <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {availableFields.map((field) => (
                  <button
                    key={field._id}
                    onClick={() => selectField(field)}
                    style={{
                      padding: "6px 10px", backgroundColor: "#2563eb", color: "#fff",
                      border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px",
                    }}
                  >
                    {field.name}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div style={{ textAlign: "left", marginTop: "10px" }}>
                ⌛ Assistant prépare la réponse...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ton message..."
              style={{
                flexGrow: 1,
                padding: "8px",
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                color: "#e5e7eb",
                borderRadius: "8px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                backgroundColor: "#2563eb",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Envoyer
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
}