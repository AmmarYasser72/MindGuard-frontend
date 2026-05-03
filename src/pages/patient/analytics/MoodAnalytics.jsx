import { useState } from "react";
import Card from "../../../components/common/Card.jsx";
import Icon from "../../../components/common/Icon.jsx";
import { moodBars, moodInsights } from "../../../data/analyticsData.js";

const moodEmojis = ["\u{1F620}", "\u{1F622}", "\u{1F610}", "\u{1F60A}", "\u{1F60D}"];
const calendarLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MoodAnalytics() {
  const [bars, setBars] = useState(moodBars);
  const today = new Date();
  const days = Array.from(
    { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
    (_, index) => index + 1,
  );

  function cycle(index) {
    setBars((current) => current.map((bar, barIndex) => {
      if (barIndex !== index) return bar;
      const mood = bar.mood >= 5 ? 1 : bar.mood + 1;
      return { ...bar, mood, emoji: moodEmojis[mood - 1] };
    }));
  }

  return (
    <div className="mood-analytics">
      <div className="mood-calendar-head">
        <h2>Mood Calendar</h2>
        <span><Icon name="flame" size={14} color="#f59e0b" />12</span>
        <button type="button"><Icon name="calendar-days" size={16} color="#10b981" /></button>
      </div>
      <div className="mood-calendar">
        {days.map((day) => {
          const isToday = day === today.getDate();
          return (
            <button type="button" className={isToday ? "today" : ""} key={day}>
              <small>{calendarLabels[new Date(today.getFullYear(), today.getMonth(), day).getDay()]}</small>
              <strong>{day}</strong>
              <span>{isToday ? "\u{1F60A}" : "\u{1F610}"}</span>
            </button>
          );
        })}
      </div>
      <Card className="mood-tracker-card">
        <div className="card-title-row">
          <span><h2>Mood Tracker</h2><small>Track your emotional patterns</small></span>
          <select defaultValue="Week"><option>Day</option><option>Week</option><option>Month</option></select>
        </div>
        <h3>Interactive Mood Chart</h3>
        <div className="mood-bars">
          {bars.map((bar, index) => (
            <button type="button" key={bar.time} onClick={() => cycle(index)}>
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
