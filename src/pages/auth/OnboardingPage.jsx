import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { Button } from "../../components/common/Primitives.jsx";
import { onboardingSlides } from "../../data/onboardingData.js";
import { useRouter } from "../../hooks/useRouter.js";

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const { navigate } = useRouter();
  const slide = onboardingSlides[index];

  function complete() {
    navigate("/login");
  }

  function next() {
    if (index === onboardingSlides.length - 1) complete();
    else setIndex((value) => value + 1);
  }

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <div className="brand-mark"><Icon name="shield" size={20} color="#fff" /></div>
        <strong>Mind Guard</strong>
        <button type="button" onClick={complete}>Skip</button>
      </header>
      <section className="onboarding-card" style={{ background: `linear-gradient(180deg, ${slide.cardGradient[0]}, ${slide.cardGradient[1]})` }}>
        <div className="gradient-badge" style={{ background: `linear-gradient(135deg, ${slide.iconGradient[0]}, ${slide.iconGradient[1]})` }}>
          <Icon name={slide.icon} size={52} color="#fff" />
        </div>
        <h1>{slide.title}</h1>
        <h2>{slide.subtitle}</h2>
        <p>{slide.body}</p>
        <div className="highlight-list">
          {slide.highlights.map((item) => (
            <div className="highlight-item" key={item}>
              <span style={{ backgroundColor: slide.accent }} />
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>
      <footer className="onboarding-footer">
        <div className="pager-dots">
          {onboardingSlides.map((item, dotIndex) => (
            <span
              key={item.title}
              className={dotIndex === index ? "active" : ""}
              style={dotIndex === index ? { backgroundColor: slide.iconGradient[1] } : undefined}
            />
          ))}
        </div>
        <Button onClick={next} className="onboarding-next">
          {index === onboardingSlides.length - 1 ? "Get Started" : "Continue"}
          <Icon name="arrow-right" size={20} color="#fff" />
        </Button>
        <button type="button" className="ghost-link" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>
          Previous
        </button>
      </footer>
    </main>
  );
}
