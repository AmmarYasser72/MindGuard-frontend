export default function LineChart({ data = [], color = "#6366f1", fill = true, labels = [], series }) {
  const normalizedSeries = series?.length
    ? series.map((entry, index) => ({
        color: entry.color || color,
        dash: entry.dash || undefined,
        data: entry.data?.length ? entry.data : [0],
        fill: entry.fill ?? (fill && index === 0),
        fillOpacity: entry.fillOpacity ?? 0.1,
        label: entry.label || `Series ${index + 1}`,
        showDots: entry.showDots ?? true,
      }))
    : [
        {
          color,
          dash: undefined,
          data: data.length ? data : [0],
          fill,
          fillOpacity: 0.1,
          label: "Series 1",
          showDots: true,
        },
      ];
  const values = normalizedSeries.flatMap((entry) => entry.data);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const plottedSeries = normalizedSeries.map((entry, entryIndex) => {
    const points = entry.data.map((value, index) => {
      const x = entry.data.length === 1 ? 50 : (index / (entry.data.length - 1)) * 100;
      const y = 90 - ((value - min) / range) * 75;
      return [x, y];
    });
    const path = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
    const fillPath = `${path} L 100 100 L 0 100 Z`;

    return {
      ...entry,
      fillPath,
      key: `${entry.label}-${entryIndex}`,
      path,
      points,
    };
  });

  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="line-chart">
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} className="chart-grid" />
        ))}
        {plottedSeries
          .filter((entry) => entry.fill)
          .map((entry) => <path d={entry.fillPath} fill={entry.color} key={`${entry.key}-fill`} opacity={entry.fillOpacity} />)}
        {plottedSeries.map((entry) => (
          <path
            d={entry.path}
            fill="none"
            key={`${entry.key}-line`}
            stroke={entry.color}
            strokeDasharray={entry.dash}
            strokeLinecap="round"
            strokeWidth="2.5"
          />
        ))}
        {plottedSeries.map((entry) =>
          entry.showDots
            ? entry.points.map(([x, y], pointIndex) => (
                <circle key={`${entry.key}-${pointIndex}`} cx={x} cy={y} r="2" fill={entry.color} vectorEffect="non-scaling-stroke" />
              ))
            : null,
        )}
      </svg>
      {labels.length ? (
        <div className="chart-labels">
          {labels.map((label) => <span key={label}>{label}</span>)}
        </div>
      ) : null}
    </div>
  );
}
