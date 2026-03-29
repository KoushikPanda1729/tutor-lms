"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { OrgSidebar } from "@/components/layout/org-sidebar";
import { ShellClient } from "@/components/layout/shell-client";
import { OrgBottomNav } from "@/components/org/bottom-nav";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const user = useSelector((state: RootState) => state.auth.user);

  const org = user?.organisations.find((o) => o.id === slug);
  const orgName = org?.name ?? "My Institute";
  const orgRole = org?.role ?? "";
  const userName = user?.name ?? "";
  const userEmail = user?.email ?? "";

  return (
    <ShellClient
      sidebar={
        <Suspense fallback={<div className="w-72 bg-white border-r border-slate-200 h-screen" />}>
          <OrgSidebar orgName={orgName} orgSlug={slug} orgRole={orgRole} />
        </Suspense>
      }
      userName={userName}
      userEmail={userEmail}
      orgName={orgName}
      mobileBottomNav={<OrgBottomNav />}
    >
      {children}
    </ShellClient>
  );
}
