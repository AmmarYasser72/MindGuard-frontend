import Icon from "../common/Icon.jsx";

export default function ActivityRows({ items, onItem }) {
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
