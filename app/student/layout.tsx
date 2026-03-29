"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { ShellClient } from "@/components/layout/shell-client";
import { StudentBottomNav } from "@/components/student/bottom-nav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);

  const orgName = user?.organisations?.[0]?.name ?? "My Institute";
  const userName = user?.name ?? "Student";
  const userEmail = user?.email ?? "";

  return (
    <ShellClient
      sidebar={<StudentSidebar orgName={orgName} />}
      userName={userName}
      userEmail={userEmail}
      orgName={orgName}
      mobileBottomNav={<StudentBottomNav />}
    >
      {children}
    </ShellClient>
  );
}
