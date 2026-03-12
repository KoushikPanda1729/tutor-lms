import { TrendingUp, TrendingDown, CheckCircle2, XCircle, CalendarCheck } from "lucide-react";
import { mockAttendance } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STUDENT_ID = "stu-1";
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function StudentAttendancePage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const records = mockAttendance.filter((a) => a.batchId === batchId);
  const myRecords = records.map((a) => ({
    date: a.date,
    present: a.records.find((r) => r.studentId === STUDENT_ID)?.present ?? false,
  }));

  const presentCount = myRecords.filter((r) => r.present).length;
  const absentCount = myRecords.length - presentCount;
  const percentage = myRecords.length ? Math.round((presentCount / myRecords.length) * 100) : 0;
  const isGood = percentage >= 75;

  const attendanceMap: Record<string, boolean> = {};
  myRecords.forEach((r) => {
    attendanceMap[r.date] = r.present;
  });

  const monthSet = new Set(myRecords.map((r) => r.date.substring(0, 7)));
  const months = [...monthSet].sort().reverse();

  const calendars = months.map((ym) => {
    const [year, month] = ym.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    return { year, month, firstDay, daysInMonth };
  });

  const sortedHistory = [...myRecords].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">Attendance</h3>
        <p className="text-xs text-slate-400 mt-0.5">{myRecords.length} classes recorded</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-slate-500">Attendance Rate</p>
            <div
              className={cn(
                "h-6 w-6 rounded-lg flex items-center justify-center",
                isGood ? "bg-emerald-50" : "bg-red-50"
              )}
            >
              {isGood ? (
                <TrendingUp className="h-3 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tabular-nums">
            {percentage}
            <span className="text-base font-bold">%</span>
          </p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", isGood ? "bg-emerald-500" : "bg-red-400")}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p
            className={cn(
              "text-[10px] font-semibold mt-1",
              isGood ? "text-emerald-600" : "text-red-500"
            )}
          >
            {isGood ? "Good standing" : "Below 75% threshold"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">Classes Attended</p>
          <p className="text-2xl font-black text-slate-900 tabular-nums">{presentCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">out of {myRecords.length} total</p>
          <div className="mt-2 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-medium text-emerald-600">Present</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">Classes Missed</p>
          <p className="text-2xl font-black text-slate-900 tabular-nums">{absentCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">out of {myRecords.length} total</p>
          <div className="mt-2 flex items-center gap-1">
            <XCircle className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-medium text-slate-500">Absent</span>
          </div>
        </div>
      </div>

      {/* Bottom row: calendar + history */}
      <div className="flex gap-4 items-start">
        {/* Calendar card — fixed width */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 w-[300px] shrink-0">
          <p className="text-sm font-bold text-slate-900 mb-1">Calendar</p>
          {/* Legend */}
          <div className="flex items-center gap-3 mb-4">
            {[
              { label: "Present", cls: "bg-emerald-500" },
              { label: "Absent", cls: "bg-red-400" },
              { label: "No class", cls: "bg-slate-200" },
            ].map(({ label, cls }) => (
              <div key={label} className="flex items-center gap-1">
                <div className={cn("h-2 w-2 rounded-full", cls)} />
                <span className="text-[10px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>

          {myRecords.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No records yet.</p>
          ) : (
            <div className="space-y-5">
              {calendars.map(({ year, month, firstDay, daysInMonth }) => {
                const cells: (number | null)[] = [
                  ...Array(firstDay).fill(null),
                  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                ];
                while (cells.length % 7 !== 0) cells.push(null);

                return (
                  <div key={`${year}-${month}`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      {MONTHS[month - 1]} {year}
                    </p>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-0.5">
                      {DAYS.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center h-7 text-[9px] font-bold text-slate-400"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {cells.map((day, i) => {
                        if (!day) return <div key={i} className="h-7" />;
                        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const hasClass = dateStr in attendanceMap;
                        const present = attendanceMap[dateStr];
                        return (
                          <div
                            key={i}
                            className={cn(
                              "h-7 flex items-center justify-center rounded-md text-[11px] font-semibold",
                              hasClass
                                ? present
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-600"
                                : "text-slate-300"
                            )}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History list — fills remaining space */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center px-5 py-3 bg-slate-50 border-b border-slate-100">
            <p className="flex-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Date
            </p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
          </div>
          {sortedHistory.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">No attendance records yet.</p>
          ) : (
            sortedHistory.map((record, i) => (
              <div
                key={record.date}
                className={cn(
                  "flex items-center px-5 py-3",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                <div className="flex-1 flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      record.present ? "bg-emerald-50" : "bg-slate-100"
                    )}
                  >
                    <CalendarCheck
                      className={cn(
                        "h-4 w-4",
                        record.present ? "text-emerald-500" : "text-slate-400"
                      )}
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-700">{formatDate(record.date)}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full",
                    record.present
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      record.present ? "bg-emerald-500" : "bg-slate-400"
                    )}
                  />
                  {record.present ? "Present" : "Absent"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
