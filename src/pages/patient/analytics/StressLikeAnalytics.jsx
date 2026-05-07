import AnalyticsChart from "./AnalyticsChart.jsx";
import AnalyticsHeader from "./AnalyticsHeader.jsx";
import CrisisCard from "./CrisisCard.jsx";
import MetricGradientCard from "./MetricGradientCard.jsx";
import ProgressSection from "./ProgressSection.jsx";
import TechniqueSection from "./TechniqueSection.jsx";
import TriggerSection from "./TriggerSection.jsx";

export default function StressLikeAnalytics({ data }) {
  return (
    <div className="analytics-stack">
      <AnalyticsHeader title={data.title} subtitle={data.subtitle} timeframe={data.timeframe} />
      <MetricGradientCard current={data.current} />
      <AnalyticsChart title={data.chart.title} tag={data.chart.tag} color={data.chart.color} data={data.chart.data} description={data.chart.description} labels={data.chart.labels} />
      <TriggerSection title={data.title.includes("Anxiety") ? "Top Anxiety Triggers" : "Top Stress Triggers"} triggers={data.triggers} />
      <TechniqueSection title={data.techniquesTitle} techniques={data.techniques} color="#f59e0b" />
      {data.secondaryTechniques ? <TechniqueSection title={data.secondaryTechniquesTitle} techniques={data.secondaryTechniques} color="#f59e0b" /> : null}
      <ProgressSection items={data.progress} />
      <CrisisCard crisis={data.crisis} />
    </div>
  );
}
