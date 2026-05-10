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
  const totalPanel = segments.reduce((sum, segment) => sum + segment.value, 0);
  const leadingCondition = [...segments].sort((a, b) => b.value - a.value)[0];
  const leadingPercent = Math.round((leadingCondition.value / totalPanel) * 100);
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
        <section className="overflow-hidden rounded-lg border border-violet-100 bg-white shadow-sm shadow-violet-950/5">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#f5f3ff_100%)] p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex min-h-7 items-center gap-2 rounded-lg bg-violet-50 px-2.5 text-xs font-black uppercase text-[var(--primary)] ring-1 ring-violet-100">
                <Icon name="chart-no-axes-combined" size={14} />
                Clinical mix
              </span>
              <h2 className="mt-3 text-xl font-black text-slate-950">Condition Distribution</h2>
              <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-slate-500">Current clinical mix across the assigned patient panel.</p>
            </div>
            <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-violet-100 bg-white px-3 text-sm font-bold text-[var(--primary)] shadow-sm shadow-violet-950/5 transition hover:border-violet-200 hover:bg-violet-50">
              <Icon name="rotate-ccw" size={16} />
              Reset
            </button>
          </div>

          <div className="grid gap-5 p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <small className="text-xs font-black uppercase text-slate-400">Panel total</small>
                <strong className="mt-2 block text-2xl font-black text-slate-950">{totalPanel}</strong>
                <span className="text-xs font-semibold text-slate-500">assigned patients</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <small className="text-xs font-black uppercase text-slate-400">Largest group</small>
                <strong className="mt-2 block truncate text-lg font-black text-slate-950">{leadingCondition.label}</strong>
                <span className="text-xs font-semibold text-slate-500">{leadingPercent}% of the panel</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <small className="text-xs font-black uppercase text-slate-400">Tracked categories</small>
                <strong className="mt-2 block text-2xl font-black text-slate-950">{segments.length}</strong>
                <span className="text-xs font-semibold text-slate-500">condition cohorts</span>
              </div>
            </div>

            <DonutChart segments={segments} size={240} />
          </div>
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
