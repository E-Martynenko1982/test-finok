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

      const existingIntervalIndex = newSchedule[day].findIndex(
        (interval) => interval.bt <= hourStart && interval.et >= hourEnd
      );

      if (existingIntervalIndex !== -1) {
        // Remove or split the existing interval
        const existingInterval = newSchedule[day][existingIntervalIndex];
        newSchedule[day].splice(existingIntervalIndex, 1);

        // Create intervals before and after the toggled hour if needed
        if (existingInterval.bt < hourStart) {
          newSchedule[day].push({ bt: existingInterval.bt, et: hourStart - 1 });
        }
        if (existingInterval.et > hourEnd) {
          newSchedule[day].push({ bt: hourEnd + 1, et: existingInterval.et });
        }
      } else {
        // Check for adjacent intervals and merge if needed
        const adjacentBefore = newSchedule[day].find(
          (interval) => interval.et === hourStart - 1
        );
        const adjacentAfter = newSchedule[day].find(
          (interval) => interval.bt === hourEnd + 1
        );

        if (adjacentBefore && adjacentAfter) {
          // Merge both adjacent intervals
          newSchedule[day] = newSchedule[day].filter(
            (interval) => interval !== adjacentBefore && interval !== adjacentAfter
          );
          newSchedule[day].push({ bt: adjacentBefore.bt, et: adjacentAfter.et });
        } else if (adjacentBefore) {
          // Extend the interval before
          newSchedule[day] = newSchedule[day].filter(
            (interval) => interval !== adjacentBefore
          );
          newSchedule[day].push({ bt: adjacentBefore.bt, et: hourEnd });
        } else if (adjacentAfter) {
          // Extend the interval after
          newSchedule[day] = newSchedule[day].filter(
            (interval) => interval !== adjacentAfter
          );
          newSchedule[day].push({ bt: hourStart, et: adjacentAfter.et });
        } else {
          // Add a new interval
          newSchedule[day].push({ bt: hourStart, et: hourEnd });
        }
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
      // Check if all hours are selected (using coverage, not just count)
      const isAllSelected = newSchedule[day].some(
        interval => interval.bt === 0 && interval.et === 1439
      );

      if (isAllSelected) {
        newSchedule[day] = [];
      } else {
        // Replace with a single interval covering the whole day
        newSchedule[day] = [{ bt: 0, et: 1439 }];
      }
      return newSchedule;
    });
  };

  // Helper function to check if an hour is selected
  const isHourSelected = (day, hour) => {
    const hourStart = hour * 60;
    const hourEnd = hourStart + 59;

    return schedule[day].some(
      (interval) => interval.bt <= hourStart && interval.et >= hourEnd


    );
  };

  // Helper function to check if all hours in a day are selected
  const isAllDaySelected = (day) => {
    return schedule[day].some(interval => interval.bt === 0 && interval.et === 1439);
  };

  return (
    <div className="weekly-calendar" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="calendar-grid">
        <div className="header-row">
          <div className="time-label">Day</div>
          {[...Array(HOURS_IN_DAY)].map((_, hour) => (
            <div key={hour} className="time-label">{hour}:00</div>
          ))}
        </div>
        {WEEK_DAYS.map((day) => (
          <div key={day} className="day-row">
            <div className="day-label">
              <input
                type="checkbox"
                checked={isAllDaySelected(day)}
                onChange={() => toggleAllDay(day)}
              />
              {day.toUpperCase()}
            </div>
            {[...Array(HOURS_IN_DAY)].map((_, hour) => {
              const isSelected = isHourSelected(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`hour-cell ${isSelected ? "selected" : ""}`}
                  onMouseDown={() => handleMouseDown(day, hour)}
                  onMouseEnter={() => handleMouseEnter(day, hour)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <pre>{JSON.stringify(schedule, null, 2)}</pre>
    </div>

  );
};

export default WeeklyCalendar;
