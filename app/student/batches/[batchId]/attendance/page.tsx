import { CalendarCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockAttendance } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const STUDENT_ID = "stu-1";

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
  const percentage = myRecords.length ? Math.round((presentCount / myRecords.length) * 100) : 0;

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 mb-4">Attendance Record</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Attendance %</p>
              <TrendingUp
                className={`h-4 w-4 ${percentage >= 75 ? "text-green-500" : "text-red-500"}`}
              />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mb-2">{percentage}%</p>
            <Progress value={percentage} className={percentage < 75 ? "[&>div]:bg-red-500" : ""} />
            <p className={`text-xs mt-2 ${percentage >= 75 ? "text-green-600" : "text-red-500"}`}>
              {percentage >= 75 ? "Good standing" : "Below 75% threshold"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-3">Classes Attended</p>
            <p className="text-3xl font-extrabold text-green-600">{presentCount}</p>
            <p className="text-xs text-slate-400 mt-1">out of {myRecords.length} classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-3">Classes Missed</p>
            <p className="text-3xl font-extrabold text-red-500">
              {myRecords.length - presentCount}
            </p>
            <p className="text-xs text-slate-400 mt-1">out of {myRecords.length} classes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {myRecords.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No attendance records yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...myRecords].reverse().map((record) => (
                <div key={record.date} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-700">{formatDate(record.date)}</p>
                  </div>
                  <Badge variant={record.present ? "success" : "destructive"}>
                    {record.present ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
