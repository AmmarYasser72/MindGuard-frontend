export default function DonutChart({ segments, size = 220 }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  let cumulative = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="donut-layout">
      <svg width={size} height={size} viewBox="0 0 100 100" className="donut-chart">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="16" />
        {segments.map((segment) => {
          const length = (segment.value / total) * circumference;
          const dash = `${length} ${circumference - length}`;
          const offset = -cumulative;
          cumulative += length;
          return (
            <circle
              key={segment.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="16"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          );
        })}
        <text x="50" y="48" textAnchor="middle" className="donut-total">{total}</text>
        <text x="50" y="58" textAnchor="middle" className="donut-caption">patients</text>
      </svg>
      <div className="legend-grid">
        {segments.map((segment) => (
          <button type="button" className="legend-chip" key={segment.label} onClick={segment.onClick}>
            <span style={{ backgroundColor: segment.color }} />
            {segment.label} - {segment.value}
          </button>
        ))}
      </div>
    </div>
  );
}
