import Icon from "./Icon.jsx";

export default function Button({
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
