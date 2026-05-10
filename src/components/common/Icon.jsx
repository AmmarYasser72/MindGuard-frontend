const aliases = {
  dashboard: "layout-dashboard",
  analytics: "chart-no-axes-combined",
  doctor: "stethoscope",
  exercise: "dumbbell",
  journal: "book-open-text",
  sleep: "moon",
  mood: "smile",
  monitor: "activity",
  sessions: "calendar-days",
  warning: "triangle-alert",
};

export default function Icon({ name, size = 20, color = "currentColor", className = "", title }) {
  const iconName = aliases[name] || name;
  const style = {
    width: size,
    height: size,
    backgroundColor: color,
    WebkitMask: `url(/assets/icons/${iconName}.svg) center / contain no-repeat`,
    mask: `url(/assets/icons/${iconName}.svg) center / contain no-repeat`,
  };

  return (
    <span
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
      className={`inline-block shrink-0 align-middle ${className}`}
      role={title ? "img" : undefined}
      style={style}
    />
  );
}
