import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { Card, ProgressBar } from "../../components/common/Primitives.jsx";
import { LineChart } from "../../components/common/Charts.jsx";
import { useToast } from "../../components/common/Toast.jsx";
import {
  analyticsTabs,
  anxietyAnalytics,
  depressionAnalytics,
  moodBars,
  moodInsights,
  sleepAnalytics,
  stressAnalytics,
} from "../../data/analyticsData.js";

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

function MoodAnalytics() {
  const [bars, setBars] = useState(moodBars);
  const today = new Date();
  const days = Array.from({ length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() }, (_, index) => index + 1);

  function cycle(index) {
    setBars((current) => current.map((bar, barIndex) => {
      if (barIndex !== index) return bar;
      const mood = bar.mood >= 5 ? 1 : bar.mood + 1;
      return { ...bar, mood, emoji: ["😠", "😢", "😐", "😊", "😍"][mood - 1] };
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
              <small>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(today.getFullYear(), today.getMonth(), day).getDay()]}</small>
              <strong>{day}</strong>
              <span>{isToday ? "😊" : "😐"}</span>
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

function StressLikeAnalytics({ data }) {
  return (
    <div className="analytics-stack">
      <AnalyticsHeader title={data.title} subtitle={data.subtitle} timeframe={data.timeframe} />
      <MetricGradientCard current={data.current} />
      <AnalyticsChart title={data.chart.title} tag={data.chart.tag} color={data.chart.color} data={data.chart.data} />
      <TriggerSection title={data.title.includes("Anxiety") ? "Top Anxiety Triggers" : "Top Stress Triggers"} triggers={data.triggers} />
      <TechniqueSection title={data.techniquesTitle} techniques={data.techniques} color="#f59e0b" />
      {data.secondaryTechniques ? <TechniqueSection title={data.secondaryTechniquesTitle} techniques={data.secondaryTechniques} color="#f59e0b" /> : null}
      <ProgressSection items={data.progress} />
      <CrisisCard crisis={data.crisis} />
    </div>
  );
}

function AnalyticsHeader({ title, subtitle, timeframe }) {
  return (
    <div className="section-head-row">
      <span><h2>{title}</h2><small>{subtitle}</small></span>
      <em>{timeframe}</em>
    </div>
  );
}

function MetricGradientCard({ current }) {
  return (
    <section className="metric-gradient-card" style={{ background: `linear-gradient(135deg, ${current.gradient[0]}, ${current.gradient[1]})` }}>
      <h2>{current.title}</h2>
      <div className="metric-gradient-row">
        {current.metrics.map((metric, index) => metric.gauge ? (
          <span className="gauge" key={index}><strong>{metric.value}</strong><small>{metric.label}</small></span>
        ) : (
          <span key={metric.label}><Icon name={metric.icon} size={24} color="#fff" /><small>{metric.label}</small><strong>{metric.value}</strong></span>
        ))}
      </div>
      <em>{current.badge}</em>
    </section>
  );
}

function AnalyticsChart({ title, tag, color, data }) {
  return (
    <Card>
      <div className="card-title-row"><h2>{title}</h2><span className="soft-tag" style={{ color, backgroundColor: `${color}1a` }}>{tag}</span></div>
      <LineChart data={data} color={color} labels={["01:00", "05:00", "09:00", "13:00", "17:00", "21:00"]} />
    </Card>
  );
}

function TriggerSection({ title, triggers }) {
  return (
    <Card>
      <div className="card-title-row"><h2>{title}</h2><button type="button">View All</button></div>
      {triggers.map((trigger) => (
        <div className="trigger-row" key={trigger.name}>
          <span><strong>{trigger.name}</strong><em style={{ color: trigger.color }}>{trigger.percentage}%</em></span>
          <ProgressBar value={trigger.percentage / 100} color={trigger.color} />
        </div>
      ))}
    </Card>
  );
}

function TechniqueSection({ title, techniques, color }) {
  const { showToast } = useToast();
  return (
    <Card>
      <h2>{title}</h2>
      <div className="technique-list">
        {techniques.map((technique) => (
          <div className="technique-row" key={technique.name}>
            <span className="metric-icon" style={{ backgroundColor: `${color}1a` }}>
              <Icon name={technique.icon} size={20} color={color} />
            </span>
            <span><strong>{technique.name}</strong><small>{technique.effectiveness} effective</small></span>
            <button type="button" onClick={() => showToast(`${technique.name} selected`)}>Start</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProgressSection({ items }) {
  return (
    <Card>
      <h2>Weekly Progress</h2>
      <div className="stat-grid">
        {items.map((item) => (
          <div className="stat-box" style={{ backgroundColor: `${item.color}1a` }} key={item.label}>
            <Icon name={item.icon} size={24} color={item.color} />
            <strong style={{ color: item.color }}>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CrisisCard({ crisis }) {
  return (
    <section className="crisis-card" style={{ background: `linear-gradient(135deg, ${crisis.gradient[0]}, ${crisis.gradient[1]})` }}>
      <div><Icon name="triangle-alert" size={24} color="#fff" /></div>
      <span><strong>{crisis.title}</strong><small>{crisis.subtitle}</small></span>
      <div className="crisis-actions"><button type="button">{crisis.primary}</button><button type="button">{crisis.secondary}</button></div>
    </section>
  );
}

function SleepAnalytics() {
  return (
    <div className="analytics-stack">
      <div className="section-head-row">
        <span><h2>Sleep Analytics</h2><small>Track your sleep quality and patterns</small></span>
        <select defaultValue="Week"><option>Day</option><option>Week</option><option>Month</option></select>
      </div>
      <section className="metric-gradient-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
        <div className="metric-gradient-row">
          {sleepAnalytics.summary.map((item) => (
            <span key={item.label}><Icon name={item.icon} size={24} color="#fff" /><small>{item.label}</small><strong>{item.value}</strong></span>
          ))}
        </div>
        <em>Good Sleep</em>
      </section>
      <Card>
        <div className="card-title-row"><h2>Sleep Patterns</h2><span className="soft-tag purple">7 Days</span></div>
        <LineChart data={sleepAnalytics.chart} color="#8b5cf6" labels={["M", "T", "W", "T", "F", "S", "S"]} />
        <div className="chart-legend"><span><b style={{ backgroundColor: "#8b5cf6" }} />Sleep Quality</span><span><b style={{ backgroundColor: "#3b82f6" }} />Energy Level</span></div>
      </Card>
      <Card><h2>Sleep Stages</h2><div className="stat-grid">{sleepAnalytics.stages.map((stage) => <div className="stat-box" key={stage.stage} style={{ backgroundColor: `${stage.color}1a` }}><strong style={{ color: stage.color }}>{stage.stage}</strong><b style={{ color: stage.color }}>{stage.duration}</b><span>{stage.percentage}</span></div>)}</div></Card>
      <Card><h2>Sleep Hygiene Tips</h2><div className="technique-list">{sleepAnalytics.tips.map((tip) => <div className="technique-row" key={tip.title}><span className="metric-icon"><Icon name={tip.icon} size={20} color="#8b5cf6" /></span><span><strong>{tip.title}</strong><small>{tip.description}</small></span></div>)}</div></Card>
      <Card><h2>Sleep Goals</h2>{sleepAnalytics.goals.map((goal) => <GoalProgress key={goal.goal} goal={goal} />)}</Card>
    </div>
  );
}

function GoalProgress({ goal }) {
  const progress = Math.min(1, goal.current / goal.target);
  const color = progress >= 0.8 ? "#10b981" : progress >= 0.6 ? "#f59e0b" : "#ef4444";
  return (
    <div className="trigger-row">
      <span><strong>{goal.goal}</strong><em style={{ color }}>{goal.current.toFixed(1)} / {goal.target.toFixed(1)} {goal.unit}</em></span>
      <ProgressBar value={progress} color={color} />
    </div>
  );
}

function DepressionAnalytics() {
  return (
    <div className="analytics-stack">
      <AnalyticsHeader title="Depression" subtitle="Monitor your mental health patterns" timeframe="" />
      <section className="metric-gradient-card" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
        <div className="metric-gradient-row">
          <span><Icon name="brain" size={24} color="#fff" /><small>Severity</small><strong>Mild</strong></span>
          <span><Icon name="clipboard-list" size={24} color="#fff" /><small>Score</small><strong>6/10</strong></span>
          <span><Icon name="trending-up" size={24} color="#fff" /><small>Trend</small><strong>Improving</strong></span>
        </div>
        <em>Last assessment: 2 days ago</em>
      </section>
      <AnalyticsChart title="Depression Severity Over Time" tag="Week" color="#ef4444" data={depressionAnalytics.severityData} />
      <TechniqueSection title="Effective Coping Strategies" techniques={depressionAnalytics.strategies} color="#ef4444" />
      <Card><h2>Mood Correlation Analysis</h2><div className="stat-grid">{depressionAnalytics.correlations.map((item) => <div className="stat-box align-left" key={item.factor} style={{ backgroundColor: `${item.color}1a` }}><strong style={{ color: item.color }}>{item.factor}</strong><b style={{ color: item.color }}>{item.value}</b><span>{item.text}</span></div>)}</div></Card>
      <Card><h2>Professional Support</h2><div className="technique-list">{depressionAnalytics.support.map((item) => <button type="button" className="support-button" key={item.title}><span className="metric-icon" style={{ backgroundColor: `${item.color}1a` }}><Icon name={item.icon} size={20} color={item.color} /></span><strong>{item.title}</strong><Icon name="chevron-right" size={14} color={item.color} /></button>)}</div></Card>
      <CrisisCard crisis={{ title: "Crisis Support", subtitle: "If you're having thoughts of self-harm, reach out immediately.", gradient: ["#ef4444", "#dc2626"], primary: "Crisis Hotline", secondary: "Crisis Chat" }} />
    </div>
  );
}
