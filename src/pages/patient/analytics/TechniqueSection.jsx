import Card from "../../../components/common/Card.jsx";
import Icon from "../../../components/common/Icon.jsx";
import { useToast } from "../../../components/common/Toast.jsx";

export default function TechniqueSection({ title, techniques, color }) {
  const { showToast } = useToast();

  return (
    <Card>
      <h2>{title}</h2>
      <div className="technique-list">
        {techniques.map((technique) => (
          <div className="technique-row" key={technique.name}>
            <span className="metric-icon" style={{ backgroundColor: `${color}1a` }}>
              <Icon name={technique.icon} size={20} color={color} />
            </span>
            <span><strong>{technique.name}</strong><small>{technique.effectiveness} effective</small></span>
            <button type="button" onClick={() => showToast(`${technique.name} selected`)}>Start</button>
          </div>
        ))}
      </div>
    </Card>
  );
}
