import { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { useToast } from "../common/Toast.jsx";
import {
  defaultScheduleForm,
  patientName,
} from "../../data/doctorData.js";
import {
  fieldClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./dashboardShared.js";

export default function ScheduleSessionModal({ patient, onClose, onCreate }) {
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
