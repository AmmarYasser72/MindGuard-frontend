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

export default function AnalyticsPage() {
  const [active, setActive] = useState("mood");
  const tab = analyticsTabs.find((item) => item.key === active);

  return (
    <section className="analytics-page">
      <header className="analytics-appbar">
        <h1>{tab.title}</h1>
        <button type="button" aria-label="More options"><Icon name="more-vertical" size={22} /></button>
      </header>
      <nav className="analytics-tabs">
        {analyticsTabs.map((item) => (
          <button
            type="button"
            key={item.key}
            className={item.key === active ? "active" : ""}
            style={item.key === active ? { backgroundColor: item.color, borderColor: item.color } : { color: item.color }}
            onClick={() => setActive(item.key)}
          >
            <Icon name={item.icon} size={24} color={item.key === active ? "#fff" : item.color} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="analytics-card">
        {active === "mood" ? <MoodAnalytics /> : null}
        {active === "stress" ? <StressLikeAnalytics data={stressAnalytics} /> : null}
        {active === "anxiety" ? <StressLikeAnalytics data={anxietyAnalytics} /> : null}
        {active === "sleep" ? <SleepAnalytics /> : null}
        {active === "depression" ? <DepressionAnalytics /> : null}
      </div>
    </section>
  );
}
