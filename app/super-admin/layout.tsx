import { Suspense } from "react";
import { SuperAdminSidebar } from "@/components/layout/super-admin-sidebar";
import { ShellClient } from "@/components/layout/shell-client";
import { SuperAdminBottomNav } from "@/components/super-admin/bottom-nav";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellClient
      sidebar={
        <Suspense fallback={<div className="w-72 bg-white border-r border-slate-200 h-screen" />}>
          <SuperAdminSidebar />
        </Suspense>
      }
      userName="Super Admin"
      userEmail="admin@tutorlms.com"
      orgName="TutorLMS"
      mobileBottomNav={<SuperAdminBottomNav />}
    >
      {children}
    </ShellClient>
  );
}
