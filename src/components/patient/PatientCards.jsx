import Icon from "../common/Icon.jsx";
import { Card, ProgressBar } from "../common/Primitives.jsx";
import { MiniWave } from "../common/Charts.jsx";

export function AppTopBar({ title, onBack, actionIcon, onAction }) {
  return (
    <header className="page-appbar">
      <button type="button" className="icon-button" onClick={onBack} aria-label="Back">
        <Icon name="arrow-left" size={20} />
      </button>
      <h1>{title}</h1>
      {actionIcon ? (
        <button type="button" className="icon-button primary-icon" onClick={onAction} aria-label={title}>
          <Icon name={actionIcon} size={20} />
        </button>
      ) : <span className="appbar-spacer" />}
    </header>
  );
}

export function HeaderCard({ title, subtitle, icon, color, bg }) {
  return (
    <Card className="tool-header-card">
      <span className="metric-icon" style={{ backgroundColor: bg }}>
        <Icon name={icon} size={24} color={color} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
    </Card>
  );
}

export function StatGrid({ items }) {
  return (
    <div className="stat-grid">
      {items.map((item) => (
        <div className="stat-box" key={`${item.label}-${item.value}`} style={{ backgroundColor: `${item.color}1a` }}>
          {item.icon ? <Icon name={item.icon} size={20} color={item.color} /> : null}
          <strong style={{ color: item.color }}>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}


export function MoodWave() {
  return <MiniWave />;
}
