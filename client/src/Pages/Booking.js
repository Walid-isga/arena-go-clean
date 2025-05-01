import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import AddBookingModal from "../Components/AddBookingModal";
import FilterFields from "../Components/FilterFields";
import axios from "../axiosConfig";
import {
  Container,
  Paper,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import "../styles/Booking.css";

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getFields = async () => {
      try {
        const { data } = await axios.get("/fields/");
        setFields(data);
      } catch (err) {
        console.error(err);
      }
    };
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

      const { data } = await axios.get(`/booking/field/${field}`, {
        params: {
          start: dateRange.start,
          end: dateRange.end,
        },
      });

      const reservedEvents = data
        .map((e) => {
          const base = {
            id: e._id,
            start: `${e.date}T${e.starttime}`,
            end: `${e.date}T${e.endtime}`,
          };

          if (e.status === "Confirmed") {
            return { ...base, title: "Réservé", className: "event-confirmed" };
          } else if (e.status === "Pending") {
            return { ...base, title: "En attente", className: "event-pending" };
          }

          return null;
        })
        .filter(Boolean);

      const availableEvents = generateAvailableSlots(
        reservedEvents,
        dateRange.start,
        dateRange.end
      );

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
        const slotStart = new Date(
          `${currentDate}T${hour.toString().padStart(2, "0")}:00:00`
        );
        const slotEnd = new Date(
          `${currentDate}T${(hour + 1).toString().padStart(2, "0")}:00:00`
        );

        const overlap = reservedEvents.some((event) => {
          const eventStart = new Date(event.start).getTime();
          const eventEnd = new Date(event.end).getTime();
          return (
            slotStart.getTime() < eventEnd && slotEnd.getTime() > eventStart
          );
        });

        if (!overlap) {
          slots.push({
            id: `available-${currentDate}-${hour}`,
            title: "Libre",
            start: slotStart.toLocaleString("sv-SE").replace(" ", "T"),
            end: slotEnd.toLocaleString("sv-SE").replace(" ", "T"),
            className:
              hour < 14 ? "event-available-morning" : "event-available-evening",
          });
        }
      }

      current = addDays(current, 1);
    }

    return slots;
  };

  const handleEventClick = (info) => {
    if (
      info.event.classNames.includes("event-available-morning") ||
      info.event.classNames.includes("event-available-evening")
    ) {
      const start = info.event.startStr;
      const end = info.event.endStr;
      const date = start.split("T")[0];
      const starttime = start.split("T")[1].slice(0, 5);
      const endtime = end.split("T")[1].slice(0, 5);

      setSelectedBookingInfo({ date, starttime, endtime, field });
      setOpen(true);
      toast.success("✅ Créneau libre sélectionné !");
    } else if (info.event.classNames.includes("event-pending")) {
      toast.info("🕒 Ce créneau est en attente de validation.");
    } else {
      toast.error("❌ Ce créneau est déjà réservé !");
    }
  };

  const handleDatesSet = (info) => {
    setDateRange({ start: info.startStr, end: info.endStr });
  };

  const handleFilter = (Field) => {
    if (!Field) {
      toast.error("❌ Merci de choisir un terrain !");
      return;
    }
    setField(Field);
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#003566",
            textAlign: "center",
          }}
        >
          📅 Réservations par terrain
        </Typography>

        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: "#ffffff",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: "#003566" }}>
            🎯 Choisir un terrain
          </Typography>
          <Divider sx={{ mb: 2, backgroundColor: "#FF6B00" }} />
          <FilterFields uniqueField={fields} onFilter={handleFilter} />
        </Paper>

        <Paper
          elevation={4}
          sx={{ p: 2, backgroundColor: "#ffffff", borderRadius: 3 }}
        >
          {loading && (
            <Typography align="center" sx={{ mb: 2, color: "#4FC3F7" }}>
              Chargement des créneaux...
            </Typography>
          )}

          {/* ✅ Wrapper scroll horizontal sur mobile */}
          <Box sx={{ overflowX: isMobile ? "auto" : "visible" }}>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              editable={false}
              selectable={true}
              selectMirror={true}
              events={events}
              select={() =>
                toast.error("❌ Merci de cliquer sur un créneau libre vert !")
              }
              eventClick={handleEventClick}
              datesSet={handleDatesSet}
              eventOverlap={false}
              locale={frLocale}
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="24:00:00"
              height={isMobile ? 500 : 700}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              eventContent={renderEventContent}
            />
          </Box>
        </Paper>
      </Container>

      <AddBookingModal
        handleSuccess={() => {
          setOpen(false);
          fetchEvents();
          toast.success("✅ Réservation confirmée !");
        }}
        handleError={() => toast.error("❌ Erreur lors de la réservation")}
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
          }
          .event-pending {
            background-color: #FF9800 !important;
            color: #fff !important;
            border-radius: 8px;
            cursor: not-allowed;
          }
          .event-available-morning {
            background-color: #81C784 !important;
            color: #fff !important;
            border-radius: 8px;
            cursor: pointer;
          }
          .event-available-evening {
            background-color: #388E3C !important;
            color: #fff !important;
            border-radius: 8px;
            cursor: pointer;
          }
          /* ✅ Fix responsive FullCalendar */
          @media (max-width: 768px) {
            .fc .fc-scrollgrid {
              min-width: 650px;
            }
          }
        `}
      </style>
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div style={{ paddingTop: "5px" }}>
      <b>{eventInfo.timeText}</b>
      <br />
      <i>{eventInfo.event.title}</i>
    </div>
  );
}
