import Icon from "../../../components/common/Icon.jsx";

export default function MetricGradientCard({ current }) {
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
