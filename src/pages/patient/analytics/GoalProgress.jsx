import ProgressBar from "../../../components/common/ProgressBar.jsx";

export default function GoalProgress({ goal }) {
  const progress = Math.min(1, goal.current / goal.target);
  const color = progress >= 0.8 ? "#10b981" : progress >= 0.6 ? "#f59e0b" : "#ef4444";

  return (
    <div className="trigger-row">
      <span><strong>{goal.goal}</strong><em style={{ color }}>{goal.current.toFixed(1)} / {goal.target.toFixed(1)} {goal.unit}</em></span>
      <ProgressBar value={progress} color={color} />
    </div>
  );
}
