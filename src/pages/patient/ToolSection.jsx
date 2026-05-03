import Card from "../../components/common/Card.jsx";
import Icon from "../../components/common/Icon.jsx";
import ActivityRows from "../../components/patient/ActivityRows.jsx";
import BreakdownGrid from "../../components/patient/BreakdownGrid.jsx";
import DaysRow from "../../components/patient/DaysRow.jsx";
import GoalList from "../../components/patient/GoalList.jsx";
import ItemList from "../../components/patient/ItemList.jsx";
import JournalEntries from "../../components/patient/JournalEntries.jsx";
import StatGrid from "../../components/patient/StatGrid.jsx";

export default function ToolSection({ section, color, onAction }) {
  return (
    <section className="tool-section">
      <h2>{section.title}</h2>
      {section.type === "list" ? <ItemList items={section.items} color={color} onItem={onAction} /> : null}
      {section.type === "stats" ? <Card><StatGrid items={section.items} /></Card> : null}
      {section.type === "journal" ? <JournalEntries items={section.items} onItem={onAction} /> : null}
      {section.type === "goals" ? <GoalList items={section.items} onItem={onAction} /> : null}
      {section.type === "activity" ? <ActivityRows items={section.items} onItem={onAction} /> : null}
      {section.type === "breakdown" ? <Card><BreakdownGrid items={section.items} /></Card> : null}
      {section.type === "days" ? <Card><DaysRow days={section.days} active={section.active} /></Card> : null}
      {section.type === "sleep" ? (
        <div className="stack-list">
          {section.items.map((item) => (
            <button type="button" className="sleep-entry" key={item.date} onClick={() => onAction({ toast: "Sleep details - Coming soon" })}>
              <span className="metric-icon"><Icon name="moon" size={20} color="#ec4899" /></span>
              <span>
                <small>{item.date}</small>
                <strong>{item.duration} <em>{item.quality}</em></strong>
                <span>Bedtime: {item.bedtime}</span>
              </span>
              <Icon name="chevron-right" size={16} color="#9ca3af" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
