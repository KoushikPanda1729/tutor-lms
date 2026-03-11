export const APP_NAME = "TutorLMS";
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

export const NAV_LINKS = {
  marketing: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "#about" },
  ],
};

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Accountancy",
];

export const ORG_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  REJECTED: "rejected",
} as const;

export const BATCH_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export const TEST_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  AVAILABLE: "available",
  CLOSED: "closed",
} as const;

export const MEMBER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const PLAN_LIMITS = {
  free: { batches: 2, students: 50, storage: "1 GB" },
  pro: { batches: 20, students: 500, storage: "20 GB" },
  enterprise: { batches: -1, students: -1, storage: "Unlimited" },
};
