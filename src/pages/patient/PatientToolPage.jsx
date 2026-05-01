import Icon from "../../components/common/Icon.jsx";
import { Card } from "../../components/common/Primitives.jsx";
import { useRouter } from "../../hooks/useRouter.js";
import { useToast } from "../../components/common/Toast.jsx";
import {
  ActionGrid,
  ActivityRows,
  AppTopBar,
  BreakdownGrid,
  DaysRow,
  GoalList,
  HeaderCard,
  ItemList,
  JournalEntries,
  StatGrid,
} from "../../components/patient/PatientCards.jsx";

export default function PatientToolPage({ config }) {
  const { navigate } = useRouter();
  const { showToast } = useToast();

  function toastAction(item) {
    showToast(item.toast || "Details - Coming soon");
  }

  return (
    <main className="tool-page">
      <AppTopBar
        title={config.title}
        onBack={() => navigate("/patient-dashboard")}
        actionIcon={config.title === "Journal" || config.title === "Sleep Log" ? "plus" : undefined}
        onAction={() => showToast(`${config.title} - Coming soon`)}
      />
      <div className="tool-scroll">
        <HeaderCard {...config} />
        {config.actions ? <ActionGrid actions={config.actions} onAction={toastAction} /> : null}
        {config.sections.map((section) => (
          <ToolSection key={section.title} section={section} color={config.color} onAction={toastAction} />
        ))}
      </div>
    </main>
  );
}

function ToolSection({ section, color, onAction }) {
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
