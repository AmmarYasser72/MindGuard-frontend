import Icon from "../common/Icon.jsx";

export default function ErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div className="error-banner">
      <Icon name="circle-alert" size={20} color="#dc2626" />
      <span>{error}</span>
    </div>
  );
}
