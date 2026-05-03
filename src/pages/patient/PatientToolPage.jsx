import Icon from "../../components/common/Icon.jsx";
import { useRouter } from "../../hooks/useRouter.js";
import { useToast } from "../../components/common/Toast.jsx";
import ActionGrid from "../../components/patient/ActionGrid.jsx";
import AppTopBar from "../../components/patient/AppTopBar.jsx";
import HeaderCard from "../../components/patient/HeaderCard.jsx";
import ToolSection from "./ToolSection.jsx";

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
