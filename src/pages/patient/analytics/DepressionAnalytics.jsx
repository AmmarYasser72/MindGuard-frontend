import Card from "../../../components/common/Card.jsx";
import Icon from "../../../components/common/Icon.jsx";
import { useToast } from "../../../components/common/Toast.jsx";
import { depressionAnalytics } from "../../../data/analyticsData.js";
import AnalyticsChart from "./AnalyticsChart.jsx";
import AnalyticsHeader from "./AnalyticsHeader.jsx";
import CrisisCard from "./CrisisCard.jsx";
import TechniqueSection from "./TechniqueSection.jsx";

export default function DepressionAnalytics() {
  const { showToast } = useToast();

  return (
    <div className="analytics-stack">
      <AnalyticsHeader title="Depression" subtitle="Monitor your mental health patterns" timeframe={depressionAnalytics.timeframe} />
      <section className="metric-gradient-card" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
        <div className="metric-gradient-row">
          <span><Icon name="brain" size={24} color="#fff" /><small>Severity</small><strong>Mild</strong></span>
          <span><Icon name="clipboard-list" size={24} color="#fff" /><small>Score</small><strong>6/10</strong></span>
          <span><Icon name="trending-up" size={24} color="#fff" /><small>Trend</small><strong>Improving</strong></span>
        </div>
        <em>Last assessment: 2 days ago</em>
      </section>
      <AnalyticsChart
        title="Depression Severity Over Time"
        tag="Week"
        color="#ef4444"
        data={depressionAnalytics.severityData}
        description="Lower scores across the week suggest recovery is moving in a positive direction."
        labels={depressionAnalytics.labels}
      />
      <TechniqueSection title="Effective Coping Strategies" techniques={depressionAnalytics.strategies} color="#ef4444" />
      <Card><h2>Mood Correlation Analysis</h2><div className="stat-grid">{depressionAnalytics.correlations.map((item) => <div className="stat-box align-left" key={item.factor} style={{ backgroundColor: `${item.color}1a` }}><strong style={{ color: item.color }}>{item.factor}</strong><b style={{ color: item.color }}>{item.value}</b><span>{item.text}</span></div>)}</div></Card>
      <Card>
        <h2>Professional Support</h2>
        <div className="technique-list">
          {depressionAnalytics.support.map((item) => (
            <button
              type="button"
              className="support-button"
              key={item.title}
              onClick={() => showToast(`${item.title} resources are ready to open`, "success")}
            >
              <span className="metric-icon" style={{ backgroundColor: `${item.color}1a` }}><Icon name={item.icon} size={20} color={item.color} /></span>
              <span className="support-copy">
                <strong>{item.title}</strong>
                <small>Open guidance and next steps</small>
              </span>
              <Icon name="chevron-right" size={14} color={item.color} />
            </button>
          ))}
        </div>
      </Card>
      <CrisisCard
        crisis={{
          title: "Crisis Support",
          subtitle: "If you're having thoughts of self-harm, reach out immediately.",
          gradient: ["#ef4444", "#dc2626"],
          primary: "Safety Steps",
          secondary: "Support Chat",
          primaryAction: { type: "toast", message: "If you feel unsafe, contact your local emergency or crisis service immediately." },
          secondaryAction: { type: "navigate", path: "/patient-chat/support@mindguard.app" },
        }}
      />
    </div>
  );
}
