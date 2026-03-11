"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ArrowRight, X } from "lucide-react";

export function OrgSetupBanner() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("org_setup_skipped") === "true";
  });

  if (!show) return null;

  return (
    <div className="fixed top-16 inset-x-0 z-40 flex justify-center px-4 pt-3">
      <div className="w-full max-w-2xl rounded-2xl border border-indigo-200 bg-indigo-50 shadow-lg px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Complete your organization setup</p>
            <p className="text-xs text-slate-500">
              Request your coaching center to unlock all features.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-1.5 rounded-lg"
          >
            Set up now <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => {
              setShow(false);
              localStorage.removeItem("org_setup_skipped");
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
