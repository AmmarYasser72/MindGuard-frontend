import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { DonutChart, LineChart, MiniWave } from "../../components/common/Charts.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useRouter } from "../../hooks/useRouter.js";
import { useToast } from "../../components/common/Toast.jsx";
import {
  ageGender,
  clinicalSummaries,
  conditionLabels,
  defaultScheduleForm,
  doctorKpis,
  lastSeenLabel,
  patientName,
  patients,
  sessionTypeIcon,
  sessions as demoSessions,
  severityLabels,
  shortReason,
  timeCountdown,
} from "../../data/doctorData.js";

const destinations = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "patients", label: "Patients", icon: "users" },
  { key: "monitor", label: "Monitor", icon: "monitor" },
  { key: "sessions", label: "Sessions", icon: "calendar-days" },
];

const surfaceClass = "rounded-lg border border-slate-200 bg-white p-5 shadow-sm";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200";
const secondaryButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100";
const fieldClass = "grid gap-2 text-sm font-bold text-slate-700";
const inputClass = "min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

export default function DoctorDashboard() {
  const [selected, setSelected] = useState("dashboard");
  const [sessionList, setSessionList] = useState(demoSessions);
  const [schedulePatient, setSchedulePatient] = useState(undefined);
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const doctorName = user?.displayName || "Doctor";

  function logout() {
    signOut();
    navigate("/login");
  }

  function createSession(values) {
    const patient = schedulePatient || patients.find((item) => patientName(item) === values.patient) || patients[0];
    const scheduledAt = new Date(`${values.date}T${values.time}`);
    setSessionList((current) => [
      {
        id: `session-${Date.now()}`,
        patientId: patient.id,
        patientName: patientName(patient),
        scheduledAt,
        duration: Number(values.duration),
        status: "scheduled",
        type: values.type.toLowerCase().replace("-", ""),
        reason: values.reason.toLowerCase().includes("urgent") ? "urgent" : "routineCheckIn",
        severity: patient.severity,
        condition: patient.condition,
      },
      ...current,
    ]);
    setSchedulePatient(undefined);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-28 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4 lg:flex">
          <div className="mb-5 grid h-12 w-12 place-items-center self-center rounded-lg bg-slate-950 text-white">
            <Icon name="stethoscope" size={24} color="#fff" />
          </div>
          <nav className="grid gap-2" aria-label="Doctor navigation">
            {destinations.map((item) => (
              <button type="button" className={railButtonClass(selected === item.key)} key={item.key} onClick={() => setSelected(item.key)}>
                <Icon name={item.icon} size={22} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 pb-28 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-sky-700">{greeting()}</span>
                <h1 className="text-2xl font-bold tracking-normal text-slate-950">Dr. {firstName(doctorName)}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:inline-flex" onClick={() => setSchedulePatient(null)}>
                  <Icon name="calendar-plus" size={18} />
                  New session
                </button>
                <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50" aria-label="Logout" title="Logout" onClick={logout}>
                  <Icon name="log-out" size={20} />
                </button>
              </div>
            </div>
          </header>

          {selected === "dashboard" ? <DoctorHome onNavigate={setSelected} sessions={sessionList} /> : null}
          {selected === "patients" ? <PatientsScreen onOpenSchedule={setSchedulePatient} /> : null}
          {selected === "monitor" ? <MonitorScreen onOpenSchedule={setSchedulePatient} /> : null}
          {selected === "sessions" ? <SessionsScreen sessions={sessionList} onOpenSchedule={() => setSchedulePatient(null)} /> : null}
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden" aria-label="Doctor navigation">
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1">
          {destinations.map((item) => (
            <button type="button" className={bottomNavClass(selected === item.key)} key={item.key} onClick={() => setSelected(item.key)}>
              <Icon name={item.icon} size={22} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {schedulePatient !== undefined ? (
        <ScheduleSessionModal patient={schedulePatient} onClose={() => setSchedulePatient(undefined)} onCreate={createSession} />
      ) : null}
    </main>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function firstName(name) {
  if (name.includes("@")) return name.split("@")[0].split(".")[0];
  return name.split(" ")[0];
}

function DoctorHome({ onNavigate, sessions }) {
  const segments = [
    { label: conditionLabels.anxiety, value: doctorKpis.conditionDistribution.anxiety, color: "#0ea5e9" },
    { label: conditionLabels.stress, value: doctorKpis.conditionDistribution.stress, color: "#f97316" },
    { label: conditionLabels.depression, value: doctorKpis.conditionDistribution.depression, color: "#ec4899" },
    { label: conditionLabels.mixed, value: doctorKpis.conditionDistribution.mixed, color: "#14b8a6" },
    { label: "No significant condition", value: doctorKpis.conditionDistribution.none, color: "#94a3b8" },
  ];
  const upcoming = sessions.filter((item) => item.status === "scheduled").slice(0, 6);

  return (
    <div className="mx-auto grid max-w-7xl gap-5 p-4 sm:p-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DoctorStat title="Total Patients" value={doctorKpis.totalPatients} icon="users" helper="Assigned panel" tone="sky" />
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
            <button type="button" className="rounded-lg px-3 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-50">Reset</button>
          </div>
          <DonutChart segments={segments} />
        </section>

        <section className={surfaceClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Upcoming Sessions</h2>
              <p className="text-sm text-slate-500">{upcoming.length ? `Next ${upcoming.length} confirmed sessions` : "No confirmed sessions for the next few hours"}</p>
            </div>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Refresh sessions">
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
          <button type="button" className="grid min-h-32 content-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md" onClick={() => onNavigate("patients")}><ActionIcon icon="users" color="#0ea5e9" bg="#e0f2fe" /><strong className="text-base text-slate-950">View All Patients</strong></button>
          <button type="button" className="grid min-h-32 content-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md" onClick={() => onNavigate("monitor")}><ActionIcon icon="activity" color="#ef4444" bg="#fee2e2" /><strong className="text-base text-slate-950">Real-Time Monitor</strong></button>
          <button type="button" className="grid min-h-32 content-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md" onClick={() => onNavigate("sessions")}><ActionIcon icon="calendar-plus" color="#059669" bg="#d1fae5" /><strong className="text-base text-slate-950">Schedule Session</strong></button>
        </div>
      </section>
    </div>
  );
}

function DoctorStat({ title, value, icon, helper, tone }) {
  const styles = {
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${styles[tone]}`}>
          <Icon name={icon} size={20} />
        </span>
        <strong className="text-3xl font-bold text-slate-950">{value}</strong>
      </div>
      <div className="mt-5">
        <span className="block text-sm font-bold text-slate-800">{title}</span>
        <small className="mt-1 block text-xs font-semibold text-slate-500">{helper}</small>
      </div>
    </article>
  );
}

function ActionIcon({ icon, color, bg }) {
  return (
    <span className="grid h-11 w-11 place-items-center rounded-lg" style={{ backgroundColor: bg }}>
      <Icon name={icon} size={22} color={color} />
    </span>
  );
}

function SessionSnippet({ session }) {
  return (
    <article className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="truncate text-sm font-bold text-slate-900">{session.patientName}</strong>
        <SeverityPill severity={session.severity} />
      </div>
      <small className="text-sm font-medium text-slate-500">{formatDateTime(session.scheduledAt)}</small>
      <em className="w-fit rounded-lg bg-white px-3 py-1 text-xs font-bold not-italic text-sky-700 shadow-sm">{timeCountdown(session.scheduledAt)}</em>
    </article>
  );
}

function PatientsScreen({ onOpenSchedule }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("critical");
  const [expanded, setExpanded] = useState(null);
  const [detailPatient, setDetailPatient] = useState(null);
  const filtered = patients.filter((patient) => {
    const matchesQuery = patientName(patient).toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "sort" || patient.severity === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="mx-auto grid max-w-7xl gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Patients</h1>
          <p className="text-sm font-medium text-slate-500">{filtered.length} of {patients.length} patients shown</p>
        </div>
        <button type="button" className={primaryButtonClass} onClick={() => onOpenSchedule(null)}>
          <Icon name="calendar-plus" size={18} color="#fff" />
          Schedule
        </button>
      </div>

      <section className={surfaceClass}>
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_auto] lg:items-center">
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
            <Icon name="search" size={20} color="#64748b" />
            <input className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400" placeholder="Search patients" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="flex gap-2 overflow-x-auto">
            {["critical", "moderate", "mild", "normal", "sort"].map((item) => (
              <button type="button" className={filterButtonClass(filter === item)} key={item} onClick={() => setFilter(item)}>
                {item === "sort" ? "All" : severityLabels[item]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        {filtered.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            expanded={expanded === patient.id}
            onToggle={() => setExpanded((current) => current === patient.id ? null : patient.id)}
            onProfile={() => setDetailPatient(patient)}
            onSchedule={() => onOpenSchedule(patient)}
          />
        ))}
        {!filtered.length ? <EmptyPanel message="No patients match this search." /> : null}
      </div>

      {detailPatient ? <PatientDetails patient={detailPatient} onClose={() => setDetailPatient(null)} onSchedule={() => onOpenSchedule(detailPatient)} /> : null}
    </div>
  );
}

function PatientCard({ patient, expanded, onToggle, onProfile, onSchedule }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button type="button" className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 p-4 text-left transition hover:bg-slate-50" onClick={onToggle}>
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">{patient.firstName.charAt(0)}{patient.lastName.charAt(0)}</span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <strong className="truncate text-base font-bold text-slate-950">{patientName(patient)} <span className="text-slate-500">{ageGender(patient)}</span></strong>
            <SeverityPill severity={patient.severity} />
          </span>
          <small className="mt-1 block text-sm font-medium text-slate-500">{conditionLabels[patient.condition]}</small>
          <em className="mt-1 flex items-center gap-2 text-xs font-semibold not-italic text-slate-400"><MiniWave /> {lastSeenLabel(patient)}</em>
        </span>
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
      </button>
      {expanded ? (
        <div className="grid gap-4 border-t border-slate-100 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricBlock label="Latest mood" value={`${patient.mood}/100`} note={`From ${Math.round(patient.trend.at(-1))} last week`} tone="sky" />
            <MetricBlock label="HRV" value={`${patient.hrv.toFixed(0)}ms`} note={`${Math.abs(patient.hrvDeviation).toFixed(0)}% from baseline`} tone="red" />
            <MetricBlock label="Sleep" value={`${Math.round(patient.sleep * 100)}%`} note="Efficiency last night" tone="emerald" />
          </div>
          <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-600">
            <strong className="text-slate-900">Last journal:</strong> {patient.journal ? `"${patient.journal.slice(0, 110)}..."` : "No recent entry"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" className={secondaryButtonClass} onClick={onProfile}>View Full Profile</button>
            <button type="button" className={primaryButtonClass} onClick={onSchedule}>Schedule Session</button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function MetricBlock({ label, value, note, tone }) {
  const styles = {
    sky: "bg-sky-50 text-sky-700",
    red: "bg-red-50 text-red-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
      <strong className={`mt-2 block w-fit rounded-lg px-2 py-1 text-lg font-bold ${styles[tone]}`}>{value}</strong>
      <small className="mt-2 block text-xs font-semibold text-slate-500">{note}</small>
    </div>
  );
}

function SeverityPill({ severity }) {
  const styles = {
    critical: "bg-red-600 text-white",
    moderate: "bg-amber-500 text-white",
    mild: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    normal: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };

  return <span className={`inline-flex min-h-6 items-center rounded-lg px-2 text-xs font-bold ${styles[severity] || "bg-slate-100 text-slate-600"}`}>{severityLabels[severity]}</span>;
}

function ConditionPill({ condition }) {
  return <span className="inline-flex min-h-6 items-center rounded-lg bg-sky-50 px-2 text-xs font-bold text-sky-700 ring-1 ring-sky-100">{conditionLabels[condition]}</span>;
}

function PatientDetails({ patient, onClose, onSchedule }) {
  const [tab, setTab] = useState("Overview");
  const warnings = [
    "Mood <= 30 for 6 days with possible depressive episode",
    "HRV dropped >= 20% with high acute stress",
  ];

  return (
    <Modal title={patientName(patient)} onClose={onClose} actions={<button type="button" className={primaryButtonClass} onClick={onSchedule}>Schedule Session</button>}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          {warnings.map((warning) => (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700" key={warning}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-600 text-white"><Icon name="triangle-alert" size={16} color="#fff" /></span>
              {warning}
            </div>
          ))}
        </div>

        <section className={surfaceClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">{patientName(patient)}, {patient.age}{patient.gender}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{patient.email}</p>
            </div>
            <div className="flex flex-wrap gap-2"><SeverityPill severity={patient.severity} /><ConditionPill condition={patient.condition} /></div>
          </div>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-500 sm:grid-cols-2">
            <span>Last active: {lastSeenLabel(patient).replace("Last: ", "")}</span>
            <span>Next session: Not scheduled</span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {["Overview", "Mood", "Sleep", "HRV", "Journal"].map((item) => <button type="button" className={tabButtonClass(tab === item)} key={item} onClick={() => setTab(item)}>{item}</button>)}
        </div>

        <section className={surfaceClass}>
          <LineChart data={patient.trend} color="#0ea5e9" />
        </section>
        <section className={`${surfaceClass} grid gap-3`}>
          {["Recent activities", "Mood by date", "Anxiety-dominant"].map((item, index) => <p className="flex items-center gap-3 text-sm font-semibold text-slate-600" key={item}><Icon name={["calendar", "clock", "edit"][index]} size={20} color="#64748b" />{item}</p>)}
        </section>
      </div>
    </Modal>
  );
}

function MonitorScreen({ onOpenSchedule }) {
  const wrappers = clinicalSummaries.map((summary) => ({
    summary,
    patient: patients.find((patient) => patient.id === summary.patientId) || patients[0],
  }));
  const critical = wrappers.filter((item) => item.summary.severity === "critical");
  const moderate = wrappers.filter((item) => item.summary.severity === "moderate");

  return (
    <div className="mx-auto grid max-w-7xl gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Realtime Monitor</h1>
          <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><b className="h-2 w-2 rounded-full bg-emerald-500" /> Live stream - Every 30s</span>
        </div>
        <div className="flex gap-2">
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600"><Icon name="sliders-horizontal" size={20} /></button>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600"><Icon name="more-horizontal" size={20} /></button>
        </div>
      </div>

      <section className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-600 p-4 text-sm font-bold text-white shadow-sm">
        <Icon name="triangle-alert" size={18} color="#fff" />
        <span className="min-w-0 flex-1">3 high-risk patients with acute changes in mood and HRV need attention.</span>
        <Icon name="chevron-right" size={18} color="#fff" />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><Icon name="podcast" size={16} color="#047857" />Live connection</span>
        <button type="button" className="rounded-lg px-3 py-2 text-sm font-bold text-sky-700 hover:bg-sky-50">Refresh now</button>
      </div>

      <AlertSection title="High-risk alerts" tone="critical" items={critical} onOpenSchedule={onOpenSchedule} />
      <AlertSection title="Moderate alerts" tone="moderate" items={moderate} onOpenSchedule={onOpenSchedule} />
    </div>
  );
}

function AlertSection({ title, tone, items, onOpenSchedule }) {
  if (!items.length) return null;
  const critical = tone === "critical";

  return (
    <section className={`overflow-hidden rounded-lg border shadow-sm ${critical ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
      <header className="flex items-center gap-2 border-b border-white/80 p-3">
        <span className={`grid h-7 w-7 place-items-center rounded-lg text-white ${critical ? "bg-red-600" : "bg-amber-500"}`}><Icon name={critical ? "triangle-alert" : "info"} size={15} color="#fff" /></span>
        <strong className={critical ? "text-red-700" : "text-amber-700"}>{title}</strong>
        <span className="ml-auto text-xs font-bold text-slate-500">{items.length} patients</span>
      </header>
      <div className="divide-y divide-white/80">
        {items.map(({ summary, patient }) => (
          <article className="grid gap-3 p-3 lg:grid-cols-[auto_1fr_minmax(180px,auto)_auto] lg:items-center" key={`${summary.patientId}-${summary.generatedAt}`}>
            <Icon name={critical ? "circle-alert" : "bell"} size={18} color={critical ? "#dc2626" : "#d97706"} />
            <p className="m-0 text-sm font-medium text-slate-700">{summary.summaryText}</p>
            <span className="grid gap-1 lg:justify-items-end">
              <strong className="text-sm text-slate-950">{patientName(patient)}</strong>
              <small className="text-xs font-semibold text-slate-500">Last update - {time(summary.generatedAt)}</small>
            </span>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-white bg-white/80 text-slate-700 shadow-sm transition hover:bg-white" onClick={() => onOpenSchedule(patient)} aria-label="Schedule session"><Icon name="video" size={20} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

function SessionsScreen({ sessions, onOpenSchedule }) {
  const [tab, setTab] = useState("upcoming");
  const upcoming = sessions.filter((session) => session.status === "scheduled");
  const past = sessions.filter((session) => session.status !== "scheduled" || session.scheduledAt < new Date());
  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <div className="mx-auto grid max-w-7xl gap-4 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Sessions</h1>
          <p className="text-sm font-medium text-slate-500">{shown.length} {tab} sessions</p>
        </div>
        <button type="button" className={primaryButtonClass} onClick={onOpenSchedule}><Icon name="plus" size={20} color="#fff" />New session</button>
      </header>

      <div className="grid max-w-md grid-cols-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <button type="button" className={tabButtonClass(tab === "upcoming")} onClick={() => setTab("upcoming")}>Upcoming</button>
        <button type="button" className={tabButtonClass(tab === "past")} onClick={() => setTab("past")}>Past</button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {shown.length ? shown.map((session) => <SessionCard key={session.id} session={session} isPast={tab === "past"} />) : <EmptyPanel message={tab === "past" ? "No past sessions" : "No upcoming sessions"} />}
      </div>
    </div>
  );
}

function SessionCard({ session, isPast }) {
  const { showToast } = useToast();
  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-slate-950">{formatTime(session.scheduledAt)}</h2>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-700"><Icon name={sessionTypeIcon(session.type)} size={18} /> {session.patientName} <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500">{shortReason(session.reason)}</span></p>
        </div>
        {session.severity ? <SeverityPill severity={session.severity} /> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {session.condition ? <ConditionPill condition={session.condition} /> : null}
        <span className="inline-flex min-h-6 items-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-600">{session.duration} min</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" className={primaryButtonClass} onClick={() => showToast(isPast ? "Review - Coming soon" : "Session started")}>{isPast ? "Review" : "Start"}</button>
        <button type="button" className={secondaryButtonClass} onClick={() => showToast("Edit session - Coming soon")}>Edit</button>
      </div>
    </article>
  );
}

function ScheduleSessionModal({ patient, onClose, onCreate }) {
  const [form, setForm] = useState({ ...defaultScheduleForm, patient: patient ? patientName(patient) : defaultScheduleForm.patient });
  const { showToast } = useToast();

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    onCreate(form);
    showToast(`Session scheduled for ${form.patient}`, "success");
  }

  return (
    <Modal title="Schedule New Session" onClose={onClose} actions={<><button type="button" className={secondaryButtonClass} onClick={onClose}>Cancel</button><button type="button" className={primaryButtonClass} onClick={submit}>Schedule Session</button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldClass}>Patient<input className={inputClass} value={form.patient} readOnly={Boolean(patient)} onChange={(event) => update("patient", event.target.value)} /></label>
        <label className={fieldClass}>Date<input className={inputClass} type="date" value={form.date} onChange={(event) => update("date", event.target.value)} /></label>
        <label className={fieldClass}>Time<input className={inputClass} type="time" value={form.time} onChange={(event) => update("time", event.target.value)} /></label>
        <label className={fieldClass}>Duration<select className={inputClass} value={form.duration} onChange={(event) => update("duration", event.target.value)}><option>30</option><option>45</option><option>60</option></select></label>
        <label className={fieldClass}>Type<select className={inputClass} value={form.type} onChange={(event) => update("type", event.target.value)}><option>Video</option><option>Audio</option><option>In-Person</option><option>Chat</option></select></label>
        <label className={fieldClass}>Reason<input className={inputClass} value={form.reason} onChange={(event) => update("reason", event.target.value)} /></label>
        <label className={`${fieldClass} sm:col-span-2`}>Notes<textarea className={`${inputClass} min-h-28 py-3`} value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Add any additional notes..." /></label>
      </div>
    </Modal>
  );
}

function EmptyPanel({ message }) {
  return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">{message}</div>;
}

function railButtonClass(active) {
  return `grid min-h-20 justify-items-center gap-2 rounded-lg px-2 py-3 text-xs font-bold transition ${active ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`;
}

function bottomNavClass(active) {
  return `grid min-h-14 justify-items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-bold transition ${active ? "bg-sky-50 text-sky-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`;
}

function filterButtonClass(active) {
  return `h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition ${active ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`;
}

function tabButtonClass(active) {
  return `min-h-10 rounded-lg px-3 text-sm font-bold transition ${active ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`;
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
}

function time(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
