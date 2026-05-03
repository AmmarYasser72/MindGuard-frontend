import Icon from "../../../components/common/Icon.jsx";

export default function CrisisCard({ crisis }) {
  return (
    <section className="crisis-card" style={{ background: `linear-gradient(135deg, ${crisis.gradient[0]}, ${crisis.gradient[1]})` }}>
      <div><Icon name="triangle-alert" size={24} color="#fff" /></div>
      <span><strong>{crisis.title}</strong><small>{crisis.subtitle}</small></span>
      <div className="crisis-actions"><button type="button">{crisis.primary}</button><button type="button">{crisis.secondary}</button></div>
    </section>
  );
}
