import Card from "../../../components/common/Card.jsx";
import ProgressBar from "../../../components/common/ProgressBar.jsx";

export default function TriggerSection({ title, triggers }) {
  return (
    <Card>
      <div className="card-title-row">
        <h2>{title}</h2>
        <span className="soft-tag" style={{ color: "#475569", backgroundColor: "#f1f5f9" }}>{triggers.length} tracked</span>
      </div>
      {triggers.map((trigger) => (
        <div className="trigger-row" key={trigger.name}>
          <span><strong>{trigger.name}</strong><em style={{ color: trigger.color }}>{trigger.percentage}%</em></span>
          <ProgressBar value={trigger.percentage / 100} color={trigger.color} />
        </div>
      ))}
    </Card>
  );
}
