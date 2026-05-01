export function LineChart({ data, color = "#6366f1", fill = true, labels = [] }) {
  const values = data.length ? data : [0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 90 - ((value - min) / range) * 75;
    return [x, y];
  });
  const path = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const fillPath = `${path} L 100 100 L 0 100 Z`;

  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="line-chart">
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} className="chart-grid" />
        ))}
        {fill ? <path d={fillPath} fill={color} opacity="0.1" /> : null}
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {points.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={color} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {labels.length ? (
        <div className="chart-labels">
          {labels.map((label) => <span key={label}>{label}</span>)}
        </div>
      ) : null}
    </div>
  );
}

export function DonutChart({ segments, size = 220 }) {
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

export function MiniWave() {
  return (
    <svg className="mini-wave" viewBox="0 0 80 20" aria-hidden="true">
      <path
        d="M0 12 Q12 3 24 12 T48 12 T72 12 Q78 15 80 12"
        fill="none"
        stroke="#a0c4ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
