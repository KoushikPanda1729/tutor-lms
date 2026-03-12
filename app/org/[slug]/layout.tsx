import { Suspense } from "react";
import { OrgSidebar } from "@/components/layout/org-sidebar";
import { Header } from "@/components/layout/header";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Suspense fallback={<div className="w-64 bg-slate-900" />}>
        <OrgSidebar orgName="Allen Career Institute" orgSlug="allen" />
      </Suspense>
      <div className="flex flex-col flex-1 ml-64 overflow-hidden">
        <Header userName="Rajesh Kumar" userEmail="admin@allen.ac.in" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
