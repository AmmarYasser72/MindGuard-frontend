export default function AnalyticsHeader({ title, subtitle, timeframe }) {
  return (
    <div className="section-head-row analytics-section-head">
      <span><h2>{title}</h2><small>{subtitle}</small></span>
      {timeframe ? <em>{timeframe}</em> : null}
    </div>
  );
}
