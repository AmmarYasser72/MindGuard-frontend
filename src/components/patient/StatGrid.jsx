import Icon from "../common/Icon.jsx";

export default function StatGrid({ items }) {
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
