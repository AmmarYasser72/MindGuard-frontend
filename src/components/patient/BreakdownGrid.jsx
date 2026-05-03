import ProgressBar from "../common/ProgressBar.jsx";

export default function BreakdownGrid({ items }) {
  return (
    <div className="breakdown-grid">
      {items.map((item) => (
        <div className="breakdown-item" key={item.label}>
          <span><strong>{item.label}</strong><em>{Math.round(item.progress * 100)}%</em></span>
          <small>{item.value}</small>
          <ProgressBar value={item.progress} color={item.color} />
        </div>
      ))}
    </div>
  );
}
