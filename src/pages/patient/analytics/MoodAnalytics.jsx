import { useEffect, useState } from "react";
import Card from "../../../components/common/Card.jsx";
import Icon from "../../../components/common/Icon.jsx";
import { Modal } from "../../../components/common/Modal.jsx";
import { useToast } from "../../../components/common/Toast.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { moodBars, moodInsights } from "../../../data/analyticsData.js";
import { storage } from "../../../services/storage.js";

const moodEmojis = ["\u{1F620}", "\u{1F622}", "\u{1F610}", "\u{1F60A}", "\u{1F60D}"];
const moodLabels = ["Very low", "Low", "Balanced", "Good", "Excellent"];
const calendarLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const moodSummaries = [
  "Today felt heavy, so smaller goals and extra support matter most.",
  "There were some difficult moments, but you still checked in and stayed aware.",
  "Your mood stayed balanced and steady through most of the day.",
  "You handled the day well and had a few uplifting moments.",
  "You felt very positive today and your energy was noticeably better.",
];
const moodHighlights = [
  "Try a short grounding exercise and keep the schedule light.",
  "Take a breathing break and check in again later this evening.",
  "A consistent routine is helping you stay emotionally steady.",
  "Your healthy rhythm is showing up in sleep and motivation.",
  "This is a strong day to repeat the habits that helped you feel good.",
];
const moodCheckInTimes = ["08:15 AM", "09:40 AM", "11:10 AM", "01:20 PM", "03:05 PM", "05:30 PM", "08:10 PM"];
const moodPattern = [4, 5, 3, 4, 2, 3, 4, 5, 4, 3, 2, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 4, 2, 3, 4, 5, 4, 3, 4, 5, 4];

export default function MoodAnalytics() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [bars, setBars] = useState(moodBars);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const todayDay = today.getDate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const monthDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const patientKey = user?.uid || user?.email || "guest-patient";
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const moodStorageKey = `patient_mood_calendar_${patientKey}_${monthKey}`;
  const [monthEntries, setMonthEntries] = useState(() => hydrateMonthEntries(storage.get(moodStorageKey, null), monthDays, todayDay));
  const [selectedDay, setSelectedDay] = useState(todayDay);
  const [pendingMood, setPendingMood] = useState(null);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const calendarCells = createCalendarCells(monthEntries, firstDayOfMonth);
  const recordedEntries = monthEntries.filter((entry) => entry.recorded && entry.day <= todayDay);
  const averageMood = recordedEntries.length
    ? (recordedEntries.reduce((sum, item) => sum + item.mood, 0) / recordedEntries.length).toFixed(1)
    : "0.0";
  const positiveMoments = recordedEntries.filter((entry) => entry.mood >= 4).length;
  const days = Array.from({ length: monthDays }, (_, index) => index + 1);
  const selectedEntry = monthEntries.find((entry) => entry.day === selectedDay) || monthEntries[0];
  const currentStreak = calculateCurrentStreak(monthEntries, todayDay);

  useEffect(() => {
    storage.set(moodStorageKey, monthEntries);
  }, [monthEntries, moodStorageKey]);

  function cycle(index) {
    setBars((current) => current.map((bar, barIndex) => {
      if (barIndex !== index) return bar;
      const mood = bar.mood >= 5 ? 1 : bar.mood + 1;
      return { ...bar, mood, emoji: moodEmojis[mood - 1] };
    }));
  }

  function handleSelectDay(day) {
    if (day > todayDay) {
      showToast("Wait until this day arrives to record your mood and continue your streak.");
      return;
    }

    setSelectedDay(day);
    const nextEntry = monthEntries.find((entry) => entry.day === day);
    setPendingMood(nextEntry?.recorded ? nextEntry.mood : null);
  }

  function recordMoodForDay() {
    if (selectedDay > todayDay) {
      showToast("Wait until this day arrives to record your mood and continue your streak.");
      return;
    }

    if (!pendingMood) {
      showToast("Choose a mood first, then record your streak.");
      return;
    }

    setMonthEntries((currentEntries) => currentEntries.map((entry) => {
      if (entry.day !== selectedDay) return entry;

      return {
        ...entry,
        checkInTime: entry.day === todayDay ? formatCheckInTime(today) : entry.checkInTime,
        emoji: moodEmojis[pendingMood - 1],
        highlight: moodHighlights[pendingMood - 1],
        label: moodLabels[pendingMood - 1],
        mood: pendingMood,
        recorded: true,
        summary: moodSummaries[pendingMood - 1],
      };
    }));

    showToast(`Mood saved for ${calendarLabels[new Date(currentYear, currentMonth, selectedDay).getDay()]} ${selectedDay}.`, "success");
  }

  return (
    <div className="mood-analytics">
      <div className="mood-calendar-head">
        <div>
          <h2>Mood Calendar</h2>
          <small>Every daily check-in is grouped into one monthly snapshot.</small>
        </div>
        <div className="analytics-pill-row">
          <span><Icon name="flame" size={14} color="#f59e0b" />{currentStreak} day streak</span>
          <button type="button" className="analytics-pill-button" onClick={() => setIsCalendarOpen(true)}>
            <Icon name="calendar-days" size={14} color="#10b981" />
            Open calendar
          </button>
        </div>
      </div>
      {isCalendarOpen ? (
        <Modal
          title={`${today.toLocaleString("en-US", { month: "long" })} Mood Calendar`}
          onClose={() => setIsCalendarOpen(false)}
          actions={<button type="button" className="btn" onClick={() => setIsCalendarOpen(false)}>Done</button>}
        >
          <div className="mood-calendar-modal">
            <section className="mood-calendar-summary">
              <span className="mood-calendar-summary-badge" style={{ backgroundColor: `${moodColor(selectedEntry.mood)}1a`, color: moodColor(selectedEntry.mood) }}>
                {selectedEntry.recorded ? `${selectedEntry.emoji} ${selectedEntry.label}` : "No mood recorded"}
              </span>
              <h3>{calendarLabels[new Date(currentYear, currentMonth, selectedEntry.day).getDay()]}, {today.toLocaleString("en-US", { month: "long" })} {selectedEntry.day}</h3>
              <p>{selectedEntry.recorded ? selectedEntry.summary : "No check-in was recorded for this day. Missing days break the streak, and the next recorded day starts from 1 again."}</p>
              <div className="mood-calendar-summary-grid">
                <div>
                  <small>Check-in time</small>
                  <strong>{selectedEntry.recorded ? selectedEntry.checkInTime : "Not recorded"}</strong>
                </div>
                <div>
                  <small>Mood score</small>
                  <strong>{selectedEntry.recorded ? `${selectedEntry.mood}/5` : "-"}</strong>
                </div>
                <div>
                  <small>Day highlight</small>
                  <strong>{selectedEntry.recorded ? selectedEntry.highlight : "Record a mood to continue your progress."}</strong>
                </div>
              </div>
              {selectedDay <= todayDay ? (
                <div className="mood-record-panel">
                  <div className="mood-record-head">
                    <strong>Record this day</strong>
                    <small>Select the emoji that matches how the patient felt, then save it to continue the streak.</small>
                  </div>
                  <div className="mood-record-row">
                    {moodEmojis.map((emoji, index) => (
                      <button
                        type="button"
                        className={`mood-record-button ${pendingMood === index + 1 ? "active" : ""}`.trim()}
                        key={`${emoji}-${index}`}
                        onClick={() => setPendingMood(index + 1)}
                      >
                        <span>{emoji}</span>
                        <small>{moodLabels[index]}</small>
                      </button>
                    ))}
                  </div>
                  <button type="button" className="mood-record-cta" onClick={recordMoodForDay} disabled={!pendingMood}>
                    {selectedEntry.recorded ? "Update mood and streak" : "Record mood and continue streak"}
                  </button>
                </div>
              ) : null}
            </section>

            <section className="mood-calendar-panel">
              <div className="mood-calendar-weekdays">
                {calendarLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <div className="mood-calendar-grid">
                {calendarCells.map((entry, index) => {
                  if (!entry) {
                    return <span className="mood-calendar-cell placeholder" key={`placeholder-${index}`} aria-hidden="true" />;
                  }

                  const isToday = entry.day === todayDay;
                  const isSelected = entry.day === selectedDay;
                  const isFuture = entry.day > todayDay;

                  return (
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      className={`mood-calendar-cell ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isFuture ? "future" : ""}`.trim()}
                      key={entry.day}
                      onClick={() => handleSelectDay(entry.day)}
                    >
                      <small>{entry.day}</small>
                      <strong>{isFuture || !entry.recorded ? "" : entry.emoji}</strong>
                      <span>{isFuture ? "Coming soon" : entry.recorded ? entry.label : "Not recorded"}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </Modal>
      ) : null}
      <div className="mood-calendar">
        {days.map((day) => {
          const isToday = day === todayDay;
          const isSelected = day === selectedDay;
          const isFuture = day > todayDay;
          const dayEntry = monthEntries.find((entry) => entry.day === day);
          return (
            <button
              type="button"
              aria-pressed={isSelected}
              className={`${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isFuture ? "future" : ""}`.trim()}
              key={day}
              onClick={() => handleSelectDay(day)}
            >
              <small>{calendarLabels[new Date(currentYear, currentMonth, day).getDay()]}</small>
              <strong>{day}</strong>
              <span>{isFuture || !dayEntry?.recorded ? "" : dayEntry.emoji}</span>
            </button>
          );
        })}
      </div>
      <div className="mood-day-spotlight">
        <div className="mood-day-spotlight-header">
          <span className="mood-day-spotlight-emoji">{selectedEntry.recorded ? selectedEntry.emoji : "\u{1F4DD}"}</span>
          <div>
            <strong>{calendarLabels[new Date(currentYear, currentMonth, selectedDay).getDay()]} {selectedDay}</strong>
            <small>{selectedEntry.recorded ? `${selectedEntry.label} mood recorded at ${selectedEntry.checkInTime}` : "No mood recorded for this day yet"}</small>
          </div>
        </div>
        <p>{selectedEntry.recorded ? selectedEntry.summary : "This day does not have a mood check-in yet. Recording today keeps your streak moving, but missing days resets it."}</p>
        <em>{selectedEntry.recorded ? selectedEntry.highlight : "Record this day to build your streak from here."}</em>
      </div>
      <div className="mood-summary-row">
        <div className="mood-summary-card">
          <small>Average mood</small>
          <strong>{averageMood}/5</strong>
        </div>
        <div className="mood-summary-card">
          <small>Positive check-ins</small>
          <strong>{positiveMoments}/{recordedEntries.length || 0}</strong>
        </div>
        <div className="mood-summary-card">
          <small>Current streak</small>
          <strong>{currentStreak} day{currentStreak === 1 ? "" : "s"}</strong>
        </div>
      </div>
      <Card className="mood-tracker-card">
        <div className="card-title-row">
          <span><h2>Mood Tracker</h2><small>Track your emotional patterns</small></span>
          <span className="soft-tag" style={{ color: "#10b981", backgroundColor: "rgba(16,185,129,0.12)" }}>Weekly view</span>
        </div>
        <h3>Interactive Mood Chart</h3>
        <p className="analytics-card-note">Tap any mood bar to preview how another emotional state would appear on the chart.</p>
        <div className="mood-bars">
          {bars.map((bar, index) => (
            <button type="button" key={bar.time} aria-label={`${bar.time}, mood ${moodLabels[bar.mood - 1]}. Tap to cycle mood preview.`} onClick={() => cycle(index)}>
              <small>{bar.time}</small>
              <span className="mood-bar-track">
                <span className="mood-bar-fill" style={{ height: `${bar.mood * 20}%`, backgroundColor: moodColor(bar.mood) }} />
                <em style={{ bottom: `calc(${bar.mood * 20}% - 16px)` }}>{bar.emoji}</em>
              </span>
            </button>
          ))}
        </div>
        <h3>Mood Insights</h3>
        <ul className="insight-list">
          {moodInsights.map((insight) => <li key={insight}>{insight}</li>)}
        </ul>
      </Card>
    </div>
  );
}

function moodColor(mood) {
  return ["#ef4444", "#f59e0b", "#6b7280", "#10b981", "#3b82f6"][mood - 1] || "#6b7280";
}

function createMonthEntries(daysInMonth, todayDay) {
  return Array.from({ length: daysInMonth }, (_, index) => {
    const mood = moodPattern[index % moodPattern.length];
    const day = index + 1;
    const recorded = day < todayDay ? day % 6 !== 0 : false;
    return {
      day,
      mood,
      recorded,
      emoji: moodEmojis[mood - 1],
      label: moodLabels[mood - 1],
      summary: moodSummaries[mood - 1],
      highlight: moodHighlights[mood - 1],
      checkInTime: moodCheckInTimes[index % moodCheckInTimes.length],
    };
  });
}

function hydrateMonthEntries(savedEntries, daysInMonth, todayDay) {
  const defaultEntries = createMonthEntries(daysInMonth, todayDay);

  if (!Array.isArray(savedEntries)) {
    return defaultEntries;
  }

  return defaultEntries.map((entry) => {
    const savedEntry = savedEntries.find((item) => item?.day === entry.day);

    if (!savedEntry) {
      return entry;
    }

    const mood = Number(savedEntry.mood);
    const safeMood = Number.isInteger(mood) && mood >= 1 && mood <= 5 ? mood : entry.mood;
    const isFutureDay = entry.day > todayDay;

    return {
      ...entry,
      mood: safeMood,
      recorded: isFutureDay ? false : Boolean(savedEntry.recorded),
      emoji: moodEmojis[safeMood - 1],
      label: moodLabels[safeMood - 1],
      summary: moodSummaries[safeMood - 1],
      highlight: moodHighlights[safeMood - 1],
      checkInTime: typeof savedEntry.checkInTime === "string" && savedEntry.checkInTime ? savedEntry.checkInTime : entry.checkInTime,
    };
  });
}

function createCalendarCells(entries, firstDayOfMonth) {
  const leadingPlaceholders = Array.from({ length: firstDayOfMonth }, () => null);
  const cells = [...leadingPlaceholders, ...entries];
  const trailingCount = (7 - (cells.length % 7)) % 7;
  return [...cells, ...Array.from({ length: trailingCount }, () => null)];
}

function calculateCurrentStreak(entries, todayDay) {
  let streak = 0;

  for (let day = 1; day <= todayDay; day += 1) {
    const entry = entries.find((item) => item.day === day);

    if (entry?.recorded) {
      streak += 1;
    } else {
      streak = 0;
    }
  }

  return streak;
}

function formatCheckInTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
