import Icon from "../common/Icon.jsx";

export default function AuthLogo({ tone = "indigo", icon = "shield", size = 80 }) {
  return (
    <div className={`auth-logo auth-logo-${tone}`} style={{ width: size, height: size, borderRadius: size * 0.25 }}>
      <Icon name={icon} size={size * 0.5} color="#ffffff" />
    </div>
  );
}
