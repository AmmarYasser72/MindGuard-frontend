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
            <span className="technique-copy">
              <strong>{technique.name}</strong>
              <small className="technique-description">{technique.description}</small>
              <em className="technique-meta">{technique.duration ? `${technique.duration} - ` : ""}{technique.effectiveness} effective</em>
            </span>
            <button type="button" onClick={() => showToast(`${technique.name} ready to start`, "success")}>{technique.duration ? `Start ${technique.duration}` : "Start"}</button>
          </div>
        ))}
      </div>
    </Card>
  );
}
