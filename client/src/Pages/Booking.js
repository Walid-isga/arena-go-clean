import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import AddBookingModal from "../Components/AddBookingModal";
import FilterFields from "../Components/FilterFields";
import axios from "axios";
import { Container, Paper, Typography, Divider, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

// 🔵 Fonction utilitaire pour ajouter des jours
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default function Booking() {
  const [fields, setFields] = useState([]);
  const [field, setField] = useState("");
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const getFields = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/fields/");
      setFields(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFields();
  }, []);

  useEffect(() => {
    if (field && dateRange.start && dateRange.end) {
      fetchEvents();
    }
  }, [field, dateRange]);

  const fetchEvents = async () => {
    if (!field || !dateRange.start || !dateRange.end) return;

    try {
      setLoading(true);

      const { data } = await axios.get(`http://localhost:8000/booking/field/${field}`, {
        params: {
          start: dateRange.start,
          end: dateRange.end,
        },
      });

      const reservedEvents = data
        .filter(e => e.status === "Confirmed")
        .map(e => ({
          id: e._id,
          title: "Réservé",
          start: `${e.date}T${e.starttime}`,
          end: `${e.date}T${e.endtime}`,
          className: "event-confirmed",
        }));

      const availableEvents = generateAvailableSlots(reservedEvents, dateRange.start, dateRange.end);

      setEvents([...reservedEvents, ...availableEvents]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableSlots = (reservedEvents, startWeek, endWeek) => {
    const slots = [];
    let current = new Date(startWeek);
    const end = new Date(endWeek);

    while (current <= end) {
      const currentDate = current.toISOString().split("T")[0];

      for (let hour = 8; hour < 24; hour++) {
        const slotStart = new Date(`${currentDate}T${hour.toString().padStart(2, "0")}:00:00`);
        const slotEnd = new Date(`${currentDate}T${(hour + 1).toString().padStart(2, "0")}:00:00`);

        const overlap = reservedEvents.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return slotStart < eventEnd && slotEnd > eventStart;
        });

        if (!overlap) {
          slots.push({
            id: `available-${currentDate}-${hour}`,
            title: "Libre",
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            className: hour < 14 ? "event-available-morning" : "event-available-evening",
          });
        }
      }

      current = addDays(current, 1);
    }

    return slots;
  };

  const handleDateSelect = (info) => {
    toast.error("❌ Merci de cliquer sur un créneau libre vert !");
  };

  const handleEventClick = (info) => {
    if (info.event.classNames.includes("event-available-morning") || info.event.classNames.includes("event-available-evening")) {
      const start = info.event.startStr;
      const end = info.event.endStr;
      const date = start.split("T")[0];
      const starttime = start.split("T")[1].slice(0, 5);
      const endtime = end.split("T")[1].slice(0, 5);

      setSelectedBookingInfo({ date, starttime, endtime, field });
      setOpen(true);
      toast.success("✅ Créneau libre sélectionné !");
    } else {
      toast.error("❌ Ce créneau est déjà réservé !");
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    fetchEvents();
    toast.success("✅ Réservation confirmée !");
  };

  const handleError = () => {
    toast.error("❌ Erreur de réservation");
  };

  const handleFilter = (Field) => {
    if (!Field) {
      toast.error("❌ Merci de choisir un terrain !");
      return;
    }
    setField(Field);
  };

  const handleDatesSet = (info) => {
    setDateRange({
      start: info.startStr,
      end: info.endStr,
    });
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#fff" }}>
          📅 Réservations par terrain
        </Typography>

        <Paper elevation={4} sx={{ p: 3, mb: 4, backgroundColor: "#1e1e1e", color: "#fff", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            🎯 Choisir un terrain
          </Typography>
          <Divider sx={{ mb: 2, backgroundColor: "#444" }} />
          <FilterFields uniqueField={fields} onFilter={handleFilter} />
        </Paper>

        <Paper elevation={4} sx={{ p: 2, backgroundColor: "#1e1e1e", borderRadius: 3, color: "#fff" }}>
          {loading && (
            <Typography align="center" sx={{ mb: 2, color: "#4FC3F7" }}>
              Chargement des créneaux...
            </Typography>
          )}

          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            editable={false}
            selectable={true}
            selectMirror={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            eventOverlap={false}
            locale={frLocale}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="24:00:00"
            height={600}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek",
            }}
            contentHeight="auto"
            eventContent={renderEventContent}
          />
        </Paper>
      </Container>

      <AddBookingModal
        handleSuccess={handleSuccess}
        handleError={handleError}
        open={open}
        handleSubmit={setOpen}
        selectedInfo={selectedBookingInfo}
      />

      <style>
        {`
          .event-confirmed {
            background-color: #f44336 !important;
            color: #fff !important;
            border-radius: 8px;
            border-top: 5px solid #d32f2f !important;
            animation: fadeIn 1s;
          }

          .event-available-morning {
            background-color: #81C784 !important;
            color: #fff !important;
            border-radius: 8px;
            border-top: 5px solid #66BB6A !important;
            animation: fadeIn 1s;
            cursor: pointer;
          }

          .event-available-evening {
            background-color: #388E3C !important;
            color: #fff !important;
            border-radius: 8px;
            border-top: 5px solid #2E7D32 !important;
            animation: fadeIn 1s;
            cursor: pointer;
          }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
}

// 🎨 Fonction pour personnaliser l'affichage des événements (affiche heure + titre)
function renderEventContent(eventInfo) {
  return (
    <div style={{ paddingTop: "5px" }}>
      <b>{eventInfo.timeText}</b> <br />
      <i>{eventInfo.event.title}</i>
    </div>
  );
}
