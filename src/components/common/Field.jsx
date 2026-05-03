import Icon from "./Icon.jsx";

export default function Field({ label, icon, error, children }) {
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
