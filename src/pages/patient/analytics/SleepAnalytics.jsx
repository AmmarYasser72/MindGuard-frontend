import Card from "../../../components/common/Card.jsx";
import Icon from "../../../components/common/Icon.jsx";
import LineChart from "../../../components/common/LineChart.jsx";
import { sleepAnalytics } from "../../../data/analyticsData.js";
import GoalProgress from "./GoalProgress.jsx";

export default function SleepAnalytics() {
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
