import Card from "../../../components/common/Card.jsx";
import Icon from "../../../components/common/Icon.jsx";

export default function ProgressSection({ items }) {
  return (
    <Card>
      <h2>Weekly Progress</h2>
      <div className="stat-grid">
        {items.map((item) => (
          <div className="stat-box" style={{ backgroundColor: `${item.color}1a` }} key={item.label}>
            <Icon name={item.icon} size={24} color={item.color} />
            <strong style={{ color: item.color }}>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
