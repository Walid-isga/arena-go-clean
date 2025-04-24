
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddBookingModal from "../Components/AddBookingModal";
import FilterFields from "../Components/FilterFields";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

export default function Booking() {
  const [fields, setFields] = useState([]);
  const [field, setField] = useState("");
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

  const getEvents = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/booking/field/${field}`);
      const ev = data
        .filter(event => event.status === "Confirmed")
        .map(event => ({
          id: event._id,
          title: event.teamName,
          start: `${event.date}T${event.starttime}`,
          end: `${event.date}T${event.endtime}`,
        }));
      setEvents(ev);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getField = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/fields/`);
      setFields(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getField();
  }, []);

  useEffect(() => {
    if (field) getEvents();
  }, [field]);

  const handleDateSelect = (selectInfo) => {
    const start = selectInfo.startStr;
    const end = selectInfo.endStr;
    const date = start.split("T")[0];
    const starttime = start.split("T")[1].slice(0, 5);
    const endtime = end.split("T")[1].slice(0, 5);

    setSelectedBookingInfo({
      date,
      starttime,
      endtime,
      field,
    });
    setOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleSuccess = () => {
    setOpen(false);
    getEvents();
  };

  const handleError = (error) => {
    console.log(error);
  };

  const handleFilter = (Field) => setField(Field);

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#fff" }}>
          📅 Réservations par terrain
        </Typography>

        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            🎯 Filtrer par terrain
          </Typography>
          <Divider sx={{ mb: 2, backgroundColor: "#444" }} />
          <FilterFields uniqueField={fields} onFilter={handleFilter} />
        </Paper>

        <Paper
          elevation={4}
          sx={{
            p: 2,
            backgroundColor: "#1e1e1e",
            borderRadius: 3,
            color: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            📆 Calendrier des réservations
          </Typography>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            views={{
              timeGridWeek: {
                allDaySlot: false,
                slotMinTime: "08:00:00",
                slotMaxTime: "24:00:00",
              },
            }}
            height={600}
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
    </>
  );
}
