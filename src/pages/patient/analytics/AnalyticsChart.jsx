import Card from "../../../components/common/Card.jsx";
import LineChart from "../../../components/common/LineChart.jsx";

const defaultLabels = ["01:00", "05:00", "09:00", "13:00", "17:00", "21:00"];

export default function AnalyticsChart({ title, tag, color, data, description, labels = defaultLabels, series }) {
  return (
    <Card className="analytics-chart-card">
      <div className="card-title-row">
        <span>
          <h2>{title}</h2>
          {description ? <small>{description}</small> : null}
        </span>
        <span className="soft-tag" style={{ color, backgroundColor: `${color}1a` }}>{tag}</span>
      </div>
      <LineChart data={data} color={color} labels={labels} series={series} />
    </Card>
  );
}
