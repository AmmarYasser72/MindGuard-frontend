import Card from "../../../components/common/Card.jsx";
import Icon from "../../../components/common/Icon.jsx";
import LineChart from "../../../components/common/LineChart.jsx";
import { sleepAnalytics } from "../../../data/analyticsData.js";
import AnalyticsHeader from "./AnalyticsHeader.jsx";
import GoalProgress from "./GoalProgress.jsx";

export default function SleepAnalytics() {
  return (
    <div className="analytics-stack">
      <AnalyticsHeader title="Sleep Analytics" subtitle="Track your sleep quality and recovery patterns" timeframe="7 day window" />
      <section className="metric-gradient-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
        <div className="metric-gradient-row">
          {sleepAnalytics.summary.map((item) => (
            <span key={item.label}><Icon name={item.icon} size={24} color="#fff" /><small>{item.label}</small><strong>{item.value}</strong></span>
          ))}
        </div>
        <em>Good Sleep</em>
      </section>
      <Card>
        <div className="card-title-row">
          <span>
            <h2>Sleep Patterns</h2>
            <small>Comparing sleep quality with next-day energy shows how recovery affects your routine.</small>
          </span>
          <span className="soft-tag purple">7 days</span>
        </div>
        <LineChart
          labels={sleepAnalytics.labels}
          series={[
            { label: "Sleep Quality", data: sleepAnalytics.chart, color: "#8b5cf6", fill: true },
            { label: "Energy Level", data: sleepAnalytics.energy, color: "#06b6d4", dash: "5 4", fill: false },
          ]}
        />
        <div className="chart-legend">
          {sleepAnalytics.legend.map((item) => (
            <span key={item.label}><b style={{ backgroundColor: item.color }} />{item.label}</span>
          ))}
        </div>
      </Card>
      <Card><h2>Sleep Stages</h2><div className="stat-grid">{sleepAnalytics.stages.map((stage) => <div className="stat-box" key={stage.stage} style={{ backgroundColor: `${stage.color}1a` }}><strong style={{ color: stage.color }}>{stage.stage}</strong><b style={{ color: stage.color }}>{stage.duration}</b><span>{stage.percentage}</span></div>)}</div></Card>
      <Card>
        <h2>Sleep Hygiene Tips</h2>
        <div className="technique-list">
          {sleepAnalytics.tips.map((tip) => (
            <div className="technique-row" key={tip.title}>
              <span className="metric-icon"><Icon name={tip.icon} size={20} color="#8b5cf6" /></span>
              <span className="technique-copy">
                <strong>{tip.title}</strong>
                <small className="technique-description">{tip.description}</small>
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card><h2>Sleep Goals</h2>{sleepAnalytics.goals.map((goal) => <GoalProgress key={goal.goal} goal={goal} />)}</Card>
    </div>
  );
}
