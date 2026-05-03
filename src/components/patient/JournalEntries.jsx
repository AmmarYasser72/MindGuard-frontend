import Icon from "../common/Icon.jsx";

export default function JournalEntries({ items, onItem }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <button type="button" className="journal-entry" key={item.title} onClick={() => onItem?.(item)}>
          <span className="emoji-badge">{item.mood}</span>
          <span>
            <small>{item.date}</small>
            <strong>{item.title}</strong>
            <em>{item.preview}</em>
          </span>
          <Icon name="chevron-right" size={16} color="#9ca3af" />
        </button>
      ))}
    </div>
  );
}
