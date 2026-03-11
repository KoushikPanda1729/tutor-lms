import Link from "next/link";
import { Trophy, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockTests, mockTestSubmissions } from "@/lib/mock-data";

export default async function TestResultPage({
  params,
}: {
  params: Promise<{ batchId: string; testId: string }>;
}) {
  const { batchId, testId } = await params;
  const test = mockTests.find((t) => t.id === testId) || mockTests[0];
  const submission =
    mockTestSubmissions.find((s) => s.testId === testId && s.studentId === "stu-1") ||
    mockTestSubmissions[0];
  const percentage = Math.round((submission.score / submission.totalMarks) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/student/batches/${batchId}/tests`}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tests
      </Link>

      {/* Result card */}
      <div
        className={`rounded-2xl p-8 text-white text-center mb-6 ${percentage >= 60 ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
          <Trophy className="h-9 w-9 text-white" />
        </div>
        <p className="text-4xl font-extrabold mb-1">
          {submission.score}/{submission.totalMarks}
        </p>
        <p className="text-xl font-semibold mb-2">{percentage}%</p>
        <p className="text-sm opacity-80">
          {percentage >= 60 ? "Great work! Keep it up." : "Keep practicing. You can do better!"}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="grid grid-cols-3 gap-4 p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{submission.score}</p>
            <p className="text-xs text-slate-500">Marks Scored</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-2xl font-bold text-slate-800">{submission.totalMarks}</p>
            <p className="text-xs text-slate-500">Total Marks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
              <Clock className="h-5 w-5" />
              {submission.timeTaken}m
            </p>
            <p className="text-xs text-slate-500">Time Taken</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {test.questions.map((q, i) => {
            const studentAnswer = submission.answers[q.id];
            const isCorrect =
              String(studentAnswer).toLowerCase() === String(q.correctAnswer).toLowerCase();
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-2">
                      Q{i + 1}. {q.text}
                    </p>
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="text-slate-500">Your answer: </span>
                        <span
                          className={
                            isCorrect ? "text-green-700 font-medium" : "text-red-600 font-medium"
                          }
                        >
                          {String(studentAnswer) || "Not answered"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="text-slate-500">Correct answer: </span>
                          <span className="text-green-700 font-medium">
                            {String(q.correctAnswer)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={isCorrect ? "success" : "destructive"}>
                    {isCorrect ? `+${q.marks}` : `-${q.negativeMarks}`}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
