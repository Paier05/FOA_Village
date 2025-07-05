import React from "react";
import "../authPages/authPage.css";
import EventDisplay from "../../components/eventsComponent/eventDisplay.js";
import EventControl from "../../components/eventsComponent/eventControl.js";
import EventsTimerAdjustControl from "../../components/timerComponent/eventsTimerAdjust.js";

const AdminEventPage = () => {
  return (
    <div className="auth-page-background">
      <EventDisplay />
      <EventsTimerAdjustControl />
      <EventControl />
    </div>
  );
};

export default AdminEventPage;