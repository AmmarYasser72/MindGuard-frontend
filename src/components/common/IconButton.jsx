import Icon from "./Icon.jsx";

export default function IconButton({ icon, label, className = "", ...props }) {
  return (
    <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
      <Icon name={icon} size={20} />
    </button>
  );
}
