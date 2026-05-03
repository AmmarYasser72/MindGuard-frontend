import Card from "../common/Card.jsx";
import Icon from "../common/Icon.jsx";

export default function HeaderCard({ title, subtitle, icon, color, bg }) {
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
