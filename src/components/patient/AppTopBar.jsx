import Icon from "../common/Icon.jsx";

export default function AppTopBar({ title, onBack, actionIcon, onAction }) {
  return (
    <header className="page-appbar">
      <button type="button" className="icon-button" onClick={onBack} aria-label="Back">
        <Icon name="arrow-left" size={20} />
      </button>
      <h1>{title}</h1>
      {actionIcon ? (
        <button type="button" className="icon-button primary-icon" onClick={onAction} aria-label={title}>
          <Icon name={actionIcon} size={20} />
        </button>
      ) : <span className="appbar-spacer" />}
    </header>
  );
}
