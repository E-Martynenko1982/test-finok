import React from "react";
import "./WeeklyCalendar.css";
import {
  mergeIntervals,
  removeInterval,
  isDayFullySelected as isDayFullySelectedUtil,
  isHourSelected as isHourSelectedUtil
} from "../../utils/intervals";

const WeeklyCalendar = ({
  schedule,
  setSchedule,
  dragging,
  setDragging,
  isSelecting,
  setIsSelecting,
  draggingDay,
  setDraggingDay,
  HOURS_IN_DAY,
  WEEK_DAYS,
}) => {

  const isDayFullySelected = (day) => {
    return isDayFullySelectedUtil(schedule[day]);
  };

  const isHourSelected = (day, hour) => {
    return isHourSelectedUtil(schedule[day], hour * 60);
  };

  const handleDayCheckboxChange = (day, checked) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: checked ? [{ bt: 0, et: 1439 }] : []
    }));
  };

  const toggleHour = (day, hour, select) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const interval = { bt: hour * 60, et: hour * 60 + 59 };

      if (select) {
        newSchedule[day] = mergeIntervals([...newSchedule[day], interval]);
      } else {
        newSchedule[day] = removeInterval(newSchedule[day], interval.bt, interval.et);
      }
      return newSchedule;
    });
  };

  const handleMouseDown = (day, hour) => {
    const alreadySelected = isHourSelected(day, hour);
    setDragging(true);
    setDraggingDay(day);
    setIsSelecting(!alreadySelected);
    toggleHour(day, hour, !alreadySelected);
  };

  const handleMouseEnter = (day, hour) => {
    if (dragging && day === draggingDay) {
      toggleHour(day, hour, isSelecting);
    }
  };

  const handleClear = () => {
    setSchedule((prev) => {
      const cleared = {};
      Object.keys(prev).forEach((day) => {
        cleared[day] = [];
      });
      return cleared;
    });
  };

  const handleSaveChanges = () => {
    localStorage.setItem("weeklySchedule", JSON.stringify(schedule));
    alert("Поточний розклад збережено в Local Storage!");
  };

  return (
    <div className="container">
      <div className="weekly-calendar">
        <div className="calendar-grid">
          <div className="header-row">
            <div className="time-label">Day</div>
            {[...Array(HOURS_IN_DAY)].map((_, hour) => (
              <div key={hour} className="time-label">
                {hour}:00
              </div>
            ))}
          </div>

          {WEEK_DAYS.map((day) => {
            const dayFullySelected = isDayFullySelected(day);
            return (
              <div key={day} className="day-row">
                <div className="day-label">
                  <input
                    type="checkbox"
                    checked={dayFullySelected}
                    onChange={(e) => handleDayCheckboxChange(day, e.target.checked)}
                  />
                  {day.toUpperCase()}
                </div>
                {[...Array(HOURS_IN_DAY)].map((_, hour) => (
                  <div
                    key={`${day}-${hour}`}
                    className={`hour-cell ${isHourSelected(day, hour) ? "selected" : ""}`}
                    onMouseDown={() => handleMouseDown(day, hour)}
                    onMouseEnter={() => handleMouseEnter(day, hour)}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <div className="button-container">
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleSaveChanges}>Save changes</button>
        </div>
      </div>
      <pre className="fixed-pre">{JSON.stringify(schedule, null, 2)}</pre>
    </div>
  );
};

export default WeeklyCalendar;
