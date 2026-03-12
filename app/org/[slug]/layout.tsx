import { Suspense } from "react";
import { OrgSidebar } from "@/components/layout/org-sidebar";
import { ShellClient } from "@/components/layout/shell-client";
import { OrgBottomNav } from "@/components/org/bottom-nav";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellClient
      sidebar={
        <Suspense fallback={<div className="w-72 bg-white border-r border-slate-200 h-screen" />}>
          <OrgSidebar orgName="Allen Career Institute" orgSlug="allen" />
        </Suspense>
      }
      userName="Rajesh Kumar"
      userEmail="admin@allen.ac.in"
      orgName="Allen Career Institute"
      mobileBottomNav={<OrgBottomNav />}
    >
      {children}
    </ShellClient>
  );
}
