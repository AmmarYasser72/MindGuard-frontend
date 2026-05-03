import { useState } from "react";
import LineChart from "../../../components/common/LineChart.jsx";
import { Modal } from "../../../components/common/Modal.jsx";
import Icon from "../../../components/common/Icon.jsx";
import {
  lastSeenLabel,
  patientName,
} from "../../../data/doctorData.js";
import ConditionPill from "./ConditionPill.jsx";
import SeverityPill from "./SeverityPill.jsx";
import { primaryButtonClass, surfaceClass, tabButtonClass } from "./dashboardShared.js";

export default function PatientDetails({ patient, onClose, onSchedule }) {
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
          <LineChart data={patient.trend} color="#6366f1" />
        </section>
        <section className={`${surfaceClass} grid gap-3`}>
          {["Recent activities", "Mood by date", "Anxiety-dominant"].map((item, index) => <p className="flex items-center gap-3 text-sm font-semibold text-slate-600" key={item}><Icon name={["calendar", "clock", "edit"][index]} size={20} color="#64748b" />{item}</p>)}
        </section>
      </div>
    </Modal>
  );
}
