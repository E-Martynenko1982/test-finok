import React, { useState, useEffect } from "react";
import WeeklyCalendar from "./components/weekly-calendar/WeeklyCalendar";

export const HOURS_IN_DAY = 24;
export const WEEK_DAYS = ["mo", "tu", "we", "th", "fr", "sa", "su"];

export const initialSchedule = {
  mo: [],
  tu: [],
  we: [],
  th: [],
  fr: [],
  sa: [],
  su: [],
};

function App() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [dragging, setDragging] = useState(false);
  const [isSelecting, setIsSelecting] = useState(true);
  const [draggingDay, setDraggingDay] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("weeklySchedule");
    if (saved) {
      setSchedule(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <WeeklyCalendar
      schedule={schedule}
      setSchedule={setSchedule}
      dragging={dragging}
      setDragging={setDragging}
      isSelecting={isSelecting}
      setIsSelecting={setIsSelecting}
      draggingDay={draggingDay}
      setDraggingDay={setDraggingDay}
      HOURS_IN_DAY={HOURS_IN_DAY}
      WEEK_DAYS={WEEK_DAYS}
    />
  );
}

export default App;
