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

export function ActionGrid({ actions, onAction }) {
  return (
    <div className="action-grid">
      {actions.map((action) => (
        <button type="button" className="action-card" key={action.title} onClick={() => onAction(action)}>
          <span style={{ backgroundColor: `${action.color}1a` }}>
            <Icon name={action.icon} size={24} color={action.color} />
          </span>
          <strong>{action.title}</strong>
        </button>
      ))}
    </div>
  );
}

export function ItemList({ items, color = "#6366f1", onItem }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <button type="button" className="list-card" key={item.title} onClick={() => onItem?.(item)}>
          <span className="metric-icon" style={{ backgroundColor: `${color}1a` }}>
            <Icon name={item.icon || "circle"} size={20} color={color} />
          </span>
          <span>
            <strong>{item.title}</strong>
            <small>{item.subtitle}</small>
            {item.meta ? <em>{item.meta}</em> : null}
          </span>
          <Icon name="chevron-right" size={16} color="#9ca3af" />
        </button>
      ))}
    </div>
  );
}

export function JournalEntries({ items, onItem }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <button type="button" className="journal-entry" key={item.title} onClick={() => onItem?.(item)}>
          <span className="emoji-badge">{item.mood}</span>
          <span>
            <small>{item.date}</small>
            <strong>{item.title}</strong>
            <em>{item.preview}</em>
          </span>
          <Icon name="chevron-right" size={16} color="#9ca3af" />
        </button>
      ))}
    </div>
  );
}

export function GoalList({ items, onItem }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <button type="button" className="goal-row" key={item.title} onClick={() => onItem?.(item)}>
          <span className="goal-head">
            <strong>{item.title}</strong>
            <span style={{ color: item.color, backgroundColor: `${item.color}1a` }}>{item.status}</span>
          </span>
          <em>{item.description}</em>
          <small><Icon name="clock" size={14} color="#9ca3af" /> {item.time}</small>
          <ProgressBar value={item.progress} color={item.color} />
        </button>
      ))}
    </div>
  );
}

export function ActivityRows({ items, onItem }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <button type="button" className="activity-row" key={`${item.title}-${item.time}`} onClick={() => onItem?.(item)}>
          <span className="metric-icon" style={{ backgroundColor: `${item.color}1a` }}>
            <Icon name={item.icon} size={20} color={item.color} />
          </span>
          <span>
            <strong>{item.title}</strong>
            <small>{item.subtitle || item.time}</small>
            {item.subtitle ? <em>{item.time}</em> : null}
          </span>
          <Icon name="chevron-right" size={16} color="#9ca3af" />
        </button>
      ))}
    </div>
  );
}

export function BreakdownGrid({ items }) {
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

export function DaysRow({ days, active }) {
  return (
    <div className="week-days">
      {days.map((day, index) => (
        <span className={index < active ? "active" : ""} key={`${day}-${index}`}>
          {day}
        </span>
      ))}
    </div>
  );
}

export function MoodWave() {
  return <MiniWave />;
}
