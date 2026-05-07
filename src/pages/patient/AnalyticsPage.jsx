import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import {
  analyticsTabs,
  anxietyAnalytics,
  stressAnalytics,
} from "../../data/analyticsData.js";
import DepressionAnalytics from "./analytics/DepressionAnalytics.jsx";
import MoodAnalytics from "./analytics/MoodAnalytics.jsx";
import SleepAnalytics from "./analytics/SleepAnalytics.jsx";
import StressLikeAnalytics from "./analytics/StressLikeAnalytics.jsx";

const analyticsMeta = {
  mood: {
    eyebrow: "Mood rhythm",
    headline: "Your emotional rhythm is steadier when check-ins happen early in the day.",
    subtitle: "A calmer view of how your emotions, streaks, and check-ins are trending across the week.",
    status: "Updated today",
    stats: ["12 day streak", "Morning mood strongest", "15% better than last week"],
    gradient: ["#052e2b", "#0f766e", "#10b981"],
  },
  stress: {
    eyebrow: "Stress balance",
    headline: "Pressure spikes are visible now, so relief tools are easier to time well.",
    subtitle: "See how pressure changes through the day and which techniques lower your stress fastest.",
    status: "Live snapshot",
    stats: ["Low current level", "14 relief sessions", "Meetings are top trigger"],
    gradient: ["#431407", "#b45309", "#f59e0b"],
  },
  sleep: {
    eyebrow: "Sleep recovery",
    headline: "Rest quality and next-day energy are moving in the same healthy direction.",
    subtitle: "Understand how rest quality, bedtime rhythm, and recovery energy shape your next day.",
    status: "7 day window",
    stats: ["7h 32m average", "85% quality", "Best sleep on weekends"],
    gradient: ["#2e1065", "#6d28d9", "#8b5cf6"],
  },
  depression: {
    eyebrow: "Mental wellness",
    headline: "Recovery signals are improving, with sleep and activity staying most connected.",
    subtitle: "Follow symptom trends, support patterns, and care signals in one focused recovery view.",
    status: "Weekly review",
    stats: ["Mild severity", "Improving trend", "Sleep has strongest correlation"],
    gradient: ["#450a0a", "#b91c1c", "#ef4444"],
  },
  anxiety: {
    eyebrow: "Anxiety patterns",
    headline: "You can see exactly when anxiety rises and which calming routines bring it down.",
    subtitle: "Track episodes, discover triggers, and jump into calming exercises when you need support.",
    status: "Today",
    stats: ["Moderate now", "18 breathing sessions", "Social situations lead"],
    gradient: ["#4a1d06", "#c2410c", "#fb923c"],
  },
};

export default function AnalyticsPage() {
  const [active, setActive] = useState("mood");
  const tab = analyticsTabs.find((item) => item.key === active) || analyticsTabs[0];
  const meta = analyticsMeta[tab.key];
  const heroStyle = {
    background: `linear-gradient(145deg, ${meta.gradient[0]} 0%, ${meta.gradient[1]} 58%, ${meta.gradient[2]} 100%)`,
  };

  return (
    <section className="analytics-page">
      <div className="analytics-hero" style={heroStyle}>
        <div className="analytics-glow analytics-glow-left" />
        <div className="analytics-glow analytics-glow-right" />
        <header className="analytics-appbar">
          <div>
            <span className="analytics-eyebrow">Patient insights</span>
            <h1>{tab.title}</h1>
            <p>{meta.headline}</p>
          </div>
          <span className="analytics-status-pill">
            <span className="analytics-status-dot" style={{ backgroundColor: tab.color }} />
            {meta.status}
          </span>
        </header>
        <div className="analytics-hero-body">
          <div className="analytics-hero-copy">
            <span className="analytics-hero-chip" style={{ color: tab.color, backgroundColor: `${tab.color}1a` }}>
              <Icon name={tab.icon} size={16} color={tab.color} />
              {meta.eyebrow}
            </span>
            <h2>Understand your progress at a glance</h2>
            <p>{meta.subtitle}</p>
          </div>
          <div className="analytics-hero-stats">
            {meta.stats.map((stat) => (
              <div className="analytics-hero-stat" key={stat}>
                <span className="analytics-hero-stat-dot" style={{ backgroundColor: tab.color }} />
                <strong>{stat}</strong>
              </div>
            ))}
          </div>
        </div>
        <nav className="analytics-tabs" aria-label="Patient analytics categories" role="tablist">
          {analyticsTabs.map((item) => (
            <button
              type="button"
              key={item.key}
              aria-controls={`analytics-panel-${item.key}`}
              aria-selected={item.key === active}
              className={item.key === active ? "active" : ""}
              id={`analytics-tab-${item.key}`}
              role="tab"
              style={{ "--analytics-accent": item.color }}
              tabIndex={item.key === active ? 0 : -1}
              onClick={() => setActive(item.key)}
            >
              <span className="analytics-tab-icon">
                <Icon name={item.icon} size={22} color={item.key === active ? "#fff" : item.color} />
              </span>
              <span className="analytics-tab-text">
                <strong>{item.label}</strong>
                <small>{item.title}</small>
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="analytics-card analytics-card-upgraded">
        <div
          className="analytics-card-inner"
          aria-labelledby={`analytics-tab-${tab.key}`}
          id={`analytics-panel-${tab.key}`}
          role="tabpanel"
        >
          {active === "mood" ? <MoodAnalytics /> : null}
          {active === "stress" ? <StressLikeAnalytics data={stressAnalytics} /> : null}
          {active === "anxiety" ? <StressLikeAnalytics data={anxietyAnalytics} /> : null}
          {active === "sleep" ? <SleepAnalytics /> : null}
          {active === "depression" ? <DepressionAnalytics /> : null}
        </div>
      </div>
    </section>
  );
}
