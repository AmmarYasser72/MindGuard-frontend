export default function DaysRow({ days, active }) {
  return (
    <div className="week-days">
      {days.map((day, index) => (
        <span className={index < active ? "active" : ""} key={`${day}-${index}`}>
          {day}
        </span>
      ))}
    </div>
  );
}
