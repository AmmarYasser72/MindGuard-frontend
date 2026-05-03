import Icon from "../common/Icon.jsx";

export default function ActionGrid({ actions, onAction }) {
  return (
    <div className="action-grid">
      {actions.map((action) => (
        <button type="button" className="action-card" key={action.title} onClick={() => onAction(action)}>
          <span style={{ backgroundColor: `${action.color}1a` }}>
            <Icon name={action.icon} size={24} color={action.color} />
          </span>
          <strong>{action.title}</strong>
        </button>
      ))}
    </div>
  );
}
