import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useRouter } from "../../hooks/useRouter.js";
import {
  patientName,
  patients,
  sessions as demoSessions,
} from "../../data/doctorData.js";
import DoctorHome from "../../components/doctor/DoctorHome.jsx";
import MonitorScreen from "../../components/doctor/MonitorScreen.jsx";
import PatientsScreen from "../../components/doctor/PatientsScreen.jsx";
import ScheduleSessionModal from "../../components/doctor/ScheduleSessionModal.jsx";
import SessionsScreen from "../../components/doctor/SessionsScreen.jsx";
import {
  bottomNavClass,
  destinations,
  firstName,
  greeting,
  primaryPurple,
  railButtonClass,
} from "../../components/doctor/dashboardShared.js";

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
    <main className="min-h-screen text-slate-950" style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #f8fafc 46%, #ffffff 100%)" }}>
      <div className="flex min-h-screen w-full">
        <aside className="sticky top-0 hidden h-screen w-28 shrink-0 flex-col border-r border-violet-100 bg-white/90 px-3 py-4 shadow-sm shadow-violet-950/5 backdrop-blur lg:flex">
          <div className="mb-5 grid h-12 w-12 place-items-center self-center rounded-lg bg-[var(--primary)] text-white shadow-lg shadow-indigo-900/20">
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
          <header className="sticky top-0 z-20 border-b border-violet-100 bg-white/90 px-4 py-3 shadow-sm shadow-violet-950/5 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex w-full items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[var(--primary)]">{greeting()}</span>
                <h1 className="text-2xl font-bold tracking-normal text-slate-950">Dr. {firstName(doctorName)}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="hidden rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[var(--primary)] sm:inline-flex" onClick={() => setSchedulePatient(null)}>
                  <Icon name="calendar-plus" size={18} />
                  New session
                </button>
                <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-violet-100 bg-white text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[var(--primary)]" aria-label="Logout" title="Logout" onClick={logout}>
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

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-violet-100 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(76,29,149,0.12)] backdrop-blur lg:hidden" aria-label="Doctor navigation">
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1">
          {destinations.map((item) => (
            <button type="button" className={bottomNavClass(selected === item.key)} key={item.key} onClick={() => setSelected(item.key)}>
              <Icon name={item.icon} size={22} color={selected === item.key ? primaryPurple : "currentColor"} />
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
