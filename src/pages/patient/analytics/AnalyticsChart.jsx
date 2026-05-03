import Card from "../../../components/common/Card.jsx";
import LineChart from "../../../components/common/LineChart.jsx";

export default function AnalyticsChart({ title, tag, color, data }) {
  return (
    <Card>
      <div className="card-title-row"><h2>{title}</h2><span className="soft-tag" style={{ color, backgroundColor: `${color}1a` }}>{tag}</span></div>
      <LineChart data={data} color={color} labels={["01:00", "05:00", "09:00", "13:00", "17:00", "21:00"]} />
    </Card>
  );
}
