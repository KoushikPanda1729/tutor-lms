import { Suspense } from "react";
import { SuperAdminSidebar } from "@/components/layout/super-admin-sidebar";
import { Header } from "@/components/layout/header";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Suspense fallback={<div className="w-64 bg-slate-900" />}>
        <SuperAdminSidebar />
      </Suspense>
      <div className="flex flex-col flex-1 ml-64 overflow-hidden">
        <Header userName="Super Admin" userEmail="admin@tutorlms.com" showSearch={false} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
