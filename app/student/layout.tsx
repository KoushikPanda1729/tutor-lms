import { StudentSidebar } from "@/components/layout/student-sidebar";
import { ShellClient } from "@/components/layout/shell-client";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellClient
      sidebar={<StudentSidebar orgName="Allen Career Institute" />}
      userName="Aarav Sharma"
      userEmail="aarav@example.com"
    >
      {children}
    </ShellClient>
  );
}
