import Icon from "./Icon.jsx";

export function Button({
  children,
  icon,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} {...props}>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
    </button>
  );
}

export function IconButton({ icon, label, className = "", ...props }) {
  return (
    <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
      <Icon name={icon} size={20} />
    </button>
  );
}

export function Card({ children, className = "", as: Tag = "section", ...props }) {
  return (
    <Tag className={`card ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export function Field({
  label,
  icon,
  error,
  children,
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={`field-control ${error ? "field-error" : ""}`}>
        {icon ? <Icon name={icon} size={20} color="#9ca3af" /> : null}
        {children}
      </span>
      {error ? <span className="field-message">{error}</span> : null}
    </label>
  );
}

export function ProgressBar({ value, color = "#6366f1" }) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`;
  return (
    <span className="progress-bar">
      <span style={{ width, backgroundColor: color }} />
    </span>
  );
}

export function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}
