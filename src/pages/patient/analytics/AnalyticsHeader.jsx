export default function AnalyticsHeader({ title, subtitle, timeframe }) {
  return (
    <div className="section-head-row">
      <span><h2>{title}</h2><small>{subtitle}</small></span>
      <em>{timeframe}</em>
    </div>
  );
}
