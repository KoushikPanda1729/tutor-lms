export type OrgStatus = "pending" | "active" | "suspended" | "rejected";
export type BatchStatus = "active" | "archived";
export type TestStatus = "draft" | "scheduled" | "available" | "closed";
export type MemberRole = "admin" | "teacher" | "student";
export type QuestionType = "mcq" | "integer" | "multi-select";
export type Plan = "free" | "pro" | "enterprise";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  email: string;
  phone: string;
  city: string;
  status: OrgStatus;
  plan: Plan;
  createdAt: string;
  totalStudents: number;
  totalBatches: number;
}

export interface Batch {
  id: string;
  orgId: string;
  name: string;
  subject: string;
  description?: string;
  status: BatchStatus;
  studentCount: number;
  createdAt: string;
}

export interface Student {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  enrolledBatches: string[];
  createdAt: string;
}

export interface Teacher {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  assignedBatches: string[];
  createdAt: string;
}

export interface Note {
  id: string;
  batchId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Video {
  id: string;
  batchId: string;
  title: string;
  description?: string;
  url: string;
  type: "upload" | "youtube";
  duration?: string;
  thumbnail?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  negativeMarks: number;
}

export interface Test {
  id: string;
  batchId: string;
  title: string;
  instructions?: string;
  status: TestStatus;
  availableFrom: string;
  availableTo: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
  shuffleQuestions: boolean;
  showResultImmediately: boolean;
  createdAt: string;
}

export interface TestSubmission {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, string | string[]>;
  score: number;
  totalMarks: number;
  submittedAt: string;
  timeTaken: number;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  present: boolean;
}

export interface Attendance {
  id: string;
  batchId: string;
  date: string;
  records: AttendanceRecord[];
}

export interface Invite {
  id: string;
  token: string;
  orgId: string;
  batchId?: string;
  expiresAt: string;
  uses: number;
  maxUses?: number;
}
