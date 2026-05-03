export default function ProgressBar({ value, color = "#6366f1" }) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`;

  return (
    <span className="progress-bar">
      <span style={{ width, backgroundColor: color }} />
    </span>
  );
}
