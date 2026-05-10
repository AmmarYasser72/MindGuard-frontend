export default function DonutChart({ segments, size = 220 }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  let cumulative = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.55fr)_minmax(320px,1fr)] lg:items-center">
      <div className="grid justify-items-center gap-4 rounded-lg bg-slate-50/80 p-5 ring-1 ring-slate-100">
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm" role="img" aria-label={`${total} patients by condition`}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#eef2f7" strokeWidth="14" />
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
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          );
        })}
          <text x="50" y="47" textAnchor="middle" className="fill-slate-950 text-[16px] font-black">{total}</text>
          <text x="50" y="58" textAnchor="middle" className="fill-slate-500 text-[7px] font-bold uppercase">patients</text>
        </svg>
        <div className="grid justify-items-center gap-1 text-center">
          <strong className="text-sm font-black text-slate-950">Assigned patient panel</strong>
          <span className="text-xs font-semibold text-slate-500">Condition mix by primary presentation</span>
        </div>
      </div>

      <div className="grid gap-3">
        {segments.map((segment) => (
          <button
            type="button"
            className="group grid gap-2 rounded-lg border border-slate-100 bg-white p-3 text-left shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md"
            key={segment.label}
            onClick={segment.onClick}
          >
            <span className="flex items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full ring-4 ring-slate-100" style={{ backgroundColor: segment.color }} />
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">{segment.label}</span>
              <strong className="text-sm font-black text-slate-950">{segment.value}</strong>
              <small className="w-11 text-right text-xs font-bold text-slate-400">{Math.round((segment.value / total) * 100)}%</small>
            </span>
            <span className="h-2 overflow-hidden rounded-full bg-slate-100">
              <span
                className="block h-full rounded-full transition-all group-hover:brightness-95"
                style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
