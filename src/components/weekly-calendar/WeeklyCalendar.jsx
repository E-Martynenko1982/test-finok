import React, { useState, useEffect } from "react";
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
  const [isSelecting, setIsSelecting] = useState(true);
  const [draggingDay, setDraggingDay] = useState(null);

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const toggleHour = (day, hour, select) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const hourStart = hour * 60;
      const hourEnd = hourStart + 59;

      if (select) {
        newSchedule[day] = mergeIntervals([...newSchedule[day], { bt: hourStart, et: hourEnd }]);
      } else {
        newSchedule[day] = removeInterval(newSchedule[day], hourStart, hourEnd);
      }
      return newSchedule;
    });
  };

  const handleMouseDown = (day, hour) => {
    const isHourAlreadySelected = isHourSelected(day, hour);
    setDragging(true);
    setDraggingDay(day);
    setIsSelecting(!isHourAlreadySelected);
    toggleHour(day, hour, !isHourAlreadySelected);
  };

  const handleMouseEnter = (day, hour) => {
    if (dragging && day === draggingDay) {
      toggleHour(day, hour, isSelecting);
    }
  };

  const isHourSelected = (day, hour) => {
    const hourStart = hour * 60;
    return schedule[day].some(
      (interval) => interval.bt <= hourStart && interval.et >= hourStart + 59
    );
  };

  const mergeIntervals = (intervals) => {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a.bt - b.bt);
    const merged = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      if (last.et + 1 >= intervals[i].bt) {
        last.et = Math.max(last.et, intervals[i].et);
      } else {
        merged.push(intervals[i]);
      }
    }
    return merged;
  };

  const removeInterval = (intervals, start, end) => {
    const result = [];
    for (const interval of intervals) {
      if (interval.bt >= start && interval.et <= end) continue;
      if (interval.bt < start && interval.et > end) {
        result.push({ bt: interval.bt, et: start - 1 });
        result.push({ bt: end + 1, et: interval.et });
      } else if (interval.et >= start && interval.bt < start) {
        result.push({ bt: interval.bt, et: start - 1 });
      } else if (interval.bt <= end && interval.et > end) {
        result.push({ bt: end + 1, et: interval.et });
      } else {
        result.push(interval);
      }
    }
    return result;
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar-grid">
        <div className="header-row">
          <div className="time-label">Day</div>
          {[...Array(HOURS_IN_DAY)].map((_, hour) => (
            <div key={hour} className="time-label">{hour}:00</div>
          ))}
        </div>
        {WEEK_DAYS.map((day) => (
          <div key={day} className="day-row">
            <div className="day-label">{day.toUpperCase()}</div>
            {[...Array(HOURS_IN_DAY)].map((_, hour) => (
              <div
                key={`${day}-${hour}`}
                className={`hour-cell ${isHourSelected(day, hour) ? "selected" : ""}`}
                onMouseDown={() => handleMouseDown(day, hour)}
                onMouseEnter={() => handleMouseEnter(day, hour)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <pre>{JSON.stringify(schedule, null, 2)}</pre>
    </div>
  );
};

export default WeeklyCalendar;