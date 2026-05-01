import { useEffect } from "react";
import Icon from "../../components/common/Icon.jsx";
import { useRouter } from "../../hooks/useRouter.js";

export default function SplashPage() {
  const { navigate } = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate("/intro"), 2200);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash-screen">
      <div className="splash-circle splash-circle-left" />
      <div className="splash-circle splash-circle-right" />
      <div className="splash-circle splash-circle-top" />
      <div className="floating-badge floating-heart"><Icon name="heart" size={30} color="#fff" /></div>
      <div className="floating-badge floating-brain"><Icon name="brain" size={28} color="#fff" /></div>
      <section className="splash-content">
        <div className="splash-logo">
          <span className="splash-ring splash-ring-outer" />
          <span className="splash-ring splash-ring-inner" />
          <span className="splash-shield"><Icon name="shield" size={54} color="#fff" /></span>
          <span className="splash-pulse"><Icon name="activity" size={16} color="#fff" /></span>
        </div>
        <h1>Mind Guard</h1>
        <p>Your Mental Health Companion</p>
        <div className="splash-progress"><span /></div>
        <span className="loading-label">Loading...</span>
      </section>
    </main>
  );
}
