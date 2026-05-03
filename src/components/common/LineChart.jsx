export default function LineChart({ data, color = "#6366f1", fill = true, labels = [] }) {
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
