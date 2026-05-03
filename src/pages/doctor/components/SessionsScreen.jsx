import { useState } from "react";
import Icon from "../../../components/common/Icon.jsx";
import EmptyPanel from "./EmptyPanel.jsx";
import SessionCard from "./SessionCard.jsx";
import { primaryButtonClass, tabButtonClass } from "./dashboardShared.js";

export default function SessionsScreen({ sessions, onOpenSchedule }) {
  const [tab, setTab] = useState("upcoming");
  const upcoming = sessions.filter((session) => session.status === "scheduled");
  const past = sessions.filter((session) => session.status !== "scheduled" || session.scheduledAt < new Date());
  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <div className="grid w-full max-w-none gap-4 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Sessions</h1>
          <p className="text-sm font-medium text-slate-500">{shown.length} {tab} sessions</p>
        </div>
        <button type="button" className={primaryButtonClass} onClick={onOpenSchedule}><Icon name="plus" size={20} color="#fff" />New session</button>
      </header>

      <div className="grid max-w-md grid-cols-2 rounded-lg border border-violet-100 bg-white p-1 shadow-sm shadow-violet-950/5">
        <button type="button" className={tabButtonClass(tab === "upcoming")} onClick={() => setTab("upcoming")}>Upcoming</button>
        <button type="button" className={tabButtonClass(tab === "past")} onClick={() => setTab("past")}>Past</button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {shown.length ? shown.map((session) => <SessionCard key={session.id} session={session} isPast={tab === "past"} />) : <EmptyPanel message={tab === "past" ? "No past sessions" : "No upcoming sessions"} />}
      </div>
    </div>
  );
}
