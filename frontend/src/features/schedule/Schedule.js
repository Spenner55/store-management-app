import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetMyShiftsQuery, makeMyScheduleSelectors } from "./scheduleApiSlice";

function weekWindowUtc(fromDate) {
    const d = new Date(fromDate);

    const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

    const dow = (utc.getUTCDay() + 6) % 7;
    utc.setUTCDate(utc.getUTCDate() - dow); // move back to Monday
    utc.setUTCHours(0, 0, 0, 0);

    const start = new Date(utc);
    const end = new Date(utc);
    end.setUTCDate(end.getUTCDate() + 7); // 7-day window

    return { from: start.toISOString(), to: end.toISOString(), start, end };
}

function formatDayHeader(date) {
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function formatTime(ts) {
    return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const EmployeeSchedule = ({ employeeId }) => {
    const [anchor, setAnchor] = useState(() => new Date());

    const { from, to, start } = useMemo(() => weekWindowUtc(anchor), [anchor]);
    const args = useMemo(() => ({employeeId, from, to}), [employeeId, from, to]);

    const { 
        isLoading, 
        isSuccess, 
        isError, 
        isFetching
    } = useGetMyShiftsQuery(args);

    const selectors = useMemo(() => makeMyScheduleSelectors(args), [args]);
    const shifts = useSelector(selectors.selectAll);

    const days = useMemo(() => {
    const buckets = Array.from({ length: 7 }, () => []);
        for (const s of shifts) {
            const dt = new Date(s.start_at);
            const idx = Math.floor((Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()) -
            Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())) / 86400000);
            if (idx >= 0 && idx < 7) buckets[idx].push(s);
        }
        // sort within day
        for (const arr of buckets) {
            arr.sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
        }
        return buckets;
    }, [shifts, start]);

    const goPrevWeek = () => setAnchor(a => {
        const n = new Date(a);
        n.setDate(n.getDate() - 7);
        return n;
    });
    const goNextWeek = () => setAnchor(a => {
        const n = new Date(a);
        n.setDate(n.getDate() + 7);
        return n;
    });
    const goThisWeek = () => setAnchor(new Date());

    return (
    <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
            <button onClick={goPrevWeek}>← Prev</button>
            <button onClick={goThisWeek}>This Week</button>
            <button onClick={goNextWeek}>Next →</button>
            <div style={{ marginLeft: "auto", opacity: 0.7 }}>
            {isLoading || isFetching ? "Loading…" : null}
            </div>
        </div>

        {/* Simple 7-column grid (Mon..Sun) */}
        <div
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "12px",
            }}
        >
            {Array.from({ length: 7 }).map((_, i) => {
                const day = new Date(start);
                day.setUTCDate(start.getUTCDate() + i);

                return (
                    <div key={i} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 8 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{formatDayHeader(day)}</div>

                        {days[i].length === 0 ? (
                            <div style={{ opacity: 0.6 }}>— no shifts —</div>
                        ) : (
                            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
                            {days[i].map(s => (
                                <li key={s.id} style={{ background: "#f6f8ff", borderRadius: 6, padding: "6px 8px" }}>
                                <div style={{ fontSize: 12, opacity: 0.8 }}>
                                    {s.role_label ?? "undetermined"} {s.status ? `• ${s.status}` : ""}
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {formatTime(s.start_at)} – {formatTime(s.end_at)}
                                </div>
                                {/* optional extra info */}
                                {/* <div style={{ fontSize: 12 }}>Emp #{s.employee_id}</div> */}
                                </li>
                            ))}
                        </ul>
                    )}
                    </div>
                );
            })}
        </div>
    </div>
  );
}