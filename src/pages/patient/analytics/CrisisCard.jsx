import Icon from "../../../components/common/Icon.jsx";
import { useToast } from "../../../components/common/Toast.jsx";
import { useRouter } from "../../../hooks/useRouter.js";

export default function CrisisCard({ crisis }) {
  const { navigate } = useRouter();
  const { showToast } = useToast();

  function handleAction(action, fallbackMessage) {
    if (!action) {
      showToast(fallbackMessage);
      return;
    }

    if (action.type === "navigate" && action.path) {
      navigate(action.path);
      return;
    }

    if (action.type === "toast" && action.message) {
      showToast(action.message);
      return;
    }

    showToast(fallbackMessage);
  }

  return (
    <section className="crisis-card" style={{ background: `linear-gradient(135deg, ${crisis.gradient[0]}, ${crisis.gradient[1]})` }}>
      <div><Icon name="triangle-alert" size={24} color="#fff" /></div>
      <span><strong>{crisis.title}</strong><small>{crisis.subtitle}</small></span>
      <div className="crisis-actions">
        <button type="button" onClick={() => handleAction(crisis.primaryAction, `${crisis.primary} is not configured yet`)}>
          {crisis.primary}
        </button>
        <button type="button" onClick={() => handleAction(crisis.secondaryAction, `${crisis.secondary} is not configured yet`)}>
          {crisis.secondary}
        </button>
      </div>
    </section>
  );
}
