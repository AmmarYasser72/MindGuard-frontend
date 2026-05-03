import Icon from "../common/Icon.jsx";
import ProgressBar from "../common/ProgressBar.jsx";

export default function GoalList({ items, onItem }) {
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
