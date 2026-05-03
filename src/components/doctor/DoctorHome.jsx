import Icon from "../common/Icon.jsx";
import DonutChart from "../common/DonutChart.jsx";
import {
  conditionLabels,
  doctorKpis,
} from "../../data/doctorData.js";
import ActionIcon from "./ActionIcon.jsx";
import DoctorStat from "./DoctorStat.jsx";
import EmptyPanel from "./EmptyPanel.jsx";
import SessionSnippet from "./SessionSnippet.jsx";
import { surfaceClass } from "./dashboardShared.js";

export default function DoctorHome({ onNavigate, sessions }) {
  const segments = [
    { label: conditionLabels.anxiety, value: doctorKpis.conditionDistribution.anxiety, color: "#6366f1" },
    { label: conditionLabels.stress, value: doctorKpis.conditionDistribution.stress, color: "#8b5cf6" },
    { label: conditionLabels.depression, value: doctorKpis.conditionDistribution.depression, color: "#ec4899" },
    { label: conditionLabels.mixed, value: doctorKpis.conditionDistribution.mixed, color: "#10b981" },
    { label: "No significant condition", value: doctorKpis.conditionDistribution.none, color: "#94a3b8" },
  ];
  const upcoming = sessions.filter((item) => item.status === "scheduled").slice(0, 6);

  return (
    <div className="grid w-full max-w-none gap-5 p-4 sm:p-6 lg:p-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DoctorStat title="Total Patients" value={doctorKpis.totalPatients} icon="users" helper="Assigned panel" tone="violet" />
        <DoctorStat title="Active Today" value={doctorKpis.activePatientsToday} icon="activity" helper="Recent check-ins" tone="emerald" />
        <DoctorStat title="Critical Count" value={doctorKpis.criticalPatients} icon="triangle-alert" helper="Needs attention" tone="red" />
        <DoctorStat title="Sessions Today" value={doctorKpis.upcomingSessionsToday} icon="calendar-days" helper="On the calendar" tone="amber" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)]">
        <section className={surfaceClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Condition Distribution</h2>
              <p className="text-sm text-slate-500">Current clinical mix across the assigned patient panel.</p>
            </div>
            <button type="button" className="rounded-lg px-3 py-2 text-sm font-bold text-[var(--primary)] transition hover:bg-violet-50">Reset</button>
          </div>
          <DonutChart segments={segments} />
        </section>

        <section className={surfaceClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Upcoming Sessions</h2>
              <p className="text-sm text-slate-500">{upcoming.length ? `Next ${upcoming.length} confirmed sessions` : "No confirmed sessions for the next few hours"}</p>
            </div>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-violet-100 text-slate-600 transition hover:bg-violet-50 hover:text-[var(--primary)]" aria-label="Refresh sessions">
              <Icon name="refresh-cw" size={18} />
            </button>
          </div>
          {upcoming.length ? (
            <div className="grid gap-3">
              {upcoming.slice(0, 4).map((session) => <SessionSnippet session={session} key={session.id} />)}
            </div>
          ) : <EmptyPanel message="No upcoming sessions in the next 24 hours." />}
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-950">Quick Actions</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <button type="button" className="grid min-h-32 content-between rounded-lg border border-violet-100 bg-white p-4 text-left shadow-sm shadow-violet-950/5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md" onClick={() => onNavigate("patients")}><ActionIcon icon="users" color="#6366f1" bg="#eef2ff" /><strong className="text-base text-slate-950">View All Patients</strong></button>
          <button type="button" className="grid min-h-32 content-between rounded-lg border border-violet-100 bg-white p-4 text-left shadow-sm shadow-violet-950/5 transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md" onClick={() => onNavigate("monitor")}><ActionIcon icon="activity" color="#ec4899" bg="#fce7f3" /><strong className="text-base text-slate-950">Real-Time Monitor</strong></button>
          <button type="button" className="grid min-h-32 content-between rounded-lg border border-violet-100 bg-white p-4 text-left shadow-sm shadow-violet-950/5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md" onClick={() => onNavigate("sessions")}><ActionIcon icon="calendar-plus" color="#10b981" bg="#d1fae5" /><strong className="text-base text-slate-950">Schedule Session</strong></button>
        </div>
      </section>
    </div>
  );
}
