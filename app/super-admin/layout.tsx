import { Suspense } from "react";
import { SuperAdminSidebar } from "@/components/layout/super-admin-sidebar";
import { ShellClient } from "@/components/layout/shell-client";

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
    >
      {children}
    </ShellClient>
  );
}
