import { StudentSidebar } from "@/components/layout/student-sidebar";
import { Header } from "@/components/layout/header";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <StudentSidebar orgName="Allen Career Institute" />
      <div className="flex flex-col flex-1 ml-64 overflow-hidden">
        <Header userName="Aarav Sharma" userEmail="aarav@example.com" showSearch={false} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
