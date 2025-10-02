import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetMyShiftsQuery, makeMyScheduleSelectors } from "./scheduleApiSlice";
import styles from "./Schedule.module.css"

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
        <div className={styles['schedule']}>
            <div className={styles['schedule-button-container']}>
                <button onClick={goPrevWeek}>← Prev</button>
                <button onClick={goThisWeek}>This Week</button>
                <button onClick={goNextWeek}>Next →</button>
                <div className={styles['schedule-loading']}>
                    {isLoading || isFetching ? "Loading…" : null}
                </div>
            </div>
            <div className={styles['schedule-container']}>
                {Array.from({ length: 7 }).map((_, i) => {
                    const day = new Date(start);
                    day.setUTCDate(start.getUTCDate() + i);

                    return (
                        <div key={i} className={styles['employee-schedule-shift']}>
                            <div className={styles['day-header']}>
                                {formatDayHeader(day)}
                            </div>
                            {days[i].length === 0 ? (
                                <div className={styles['no-shift']}>
                                    — no shifts —
                                </div>
                            ) : (
                                <ul className={styles['shift-container']}>
                                    {days[i].map(s => (
                                        <li key={s.id} className={styles['shift-list']}>
                                            <div className={styles['shift-role']}>
                                                {s.role_label ?? "undetermined"} {s.status ? `• ${s.status}` : ""}
                                            </div>
                                            <div className={styles['shift-time']}>
                                                {formatTime(s.start_at)} – {formatTime(s.end_at)}
                                            </div>
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

export default EmployeeSchedule;