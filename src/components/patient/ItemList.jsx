import Icon from "../common/Icon.jsx";

export default function ItemList({ items, color = "#6366f1", onItem }) {
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
