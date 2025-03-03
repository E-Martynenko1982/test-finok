import React, { useState } from "react";
import "./WeeklyCalendar.css";

const HOURS_IN_DAY = 24;
const WEEK_DAYS = ["mo", "tu", "we", "th", "fr", "sa", "su"];

const initialSchedule = {
  mo: [{ bt: 240, et: 779 }],
  tu: [],
  we: [],
  th: [{ bt: 240, et: 779 }, { bt: 1140, et: 1319 }],
  fr: [{ bt: 660, et: 1019 }],
  sa: [{ bt: 0, et: 1439 }],
  su: [],
};

const WeeklyCalendar = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [dragging, setDragging] = useState(false);

  const toggleHour = (day, hour) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const hourStart = hour * 60;
      const hourEnd = hourStart + 59;

      const existing = newSchedule[day].some(
        (interval) => interval.bt <= hourStart && interval.et >= hourEnd
      );

      if (existing) {
        newSchedule[day] = newSchedule[day].filter(
          (interval) => !(interval.bt <= hourStart && interval.et >= hourEnd)
        );
      } else {
        newSchedule[day] = [...newSchedule[day], { bt: hourStart, et: hourEnd }];
      }
      return newSchedule;
    });
  };

  const handleMouseDown = (day, hour) => {
    setDragging(true);
    toggleHour(day, hour);
  };

  const handleMouseEnter = (day, hour) => {
    if (dragging) {
      toggleHour(day, hour);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const toggleAllDay = (day) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      if (newSchedule[day].length === HOURS_IN_DAY) {
        newSchedule[day] = [];
      } else {
        newSchedule[day] = Array.from({ length: HOURS_IN_DAY }, (_, i) => ({
          bt: i * 60,
          et: i * 60 + 59,
        }));
      }
      return newSchedule;
    });
  };

  return (
    <div className="weekly-calendar" onMouseUp={handleMouseUp}>
      <div className="calendar-grid">
        <div className="header-row">
          <div className="time-label">Time</div>
          {WEEK_DAYS.map((day) => (
            <div key={day} className="day-label" onClick={() => toggleAllDay(day)}>
              {day.toUpperCase()}
            </div>
          ))}
        </div>
        {[...Array(HOURS_IN_DAY)].map((_, hour) => (
          <div key={hour} className="hour-row">
            <div className="time-label">{hour}:00</div>
            {WEEK_DAYS.map((day) => {
              const isSelected = schedule[day].some(
                (interval) => interval.bt <= hour * 60 && interval.et >= hour * 60 + 59
              );
              return (
                <div
                  key={day + hour}
                  className={`hour-cell ${isSelected ? "selected" : ""}`}
                  onMouseDown={() => handleMouseDown(day, hour)}
                  onMouseEnter={() => handleMouseEnter(day, hour)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
