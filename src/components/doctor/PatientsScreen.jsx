import { useState } from "react";
import Icon from "../common/Icon.jsx";
import {
  patients,
  patientName,
  severityLabels,
} from "../../data/doctorData.js";
import PatientCard from "./PatientCard.jsx";
import PatientDetails from "./PatientDetails.jsx";
import EmptyPanel from "./EmptyPanel.jsx";
import { filterButtonClass, primaryButtonClass, surfaceClass } from "./dashboardShared.js";

export default function PatientsScreen({ onOpenSchedule }) {
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
    <div className="grid w-full max-w-none gap-4 p-4 sm:p-6 lg:p-8">
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
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-violet-100 bg-violet-50/50 px-3 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
            <Icon name="search" size={20} color="#6366f1" />
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
