"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { toast } from "sonner";
import {
  Globe,
  Mail,
  Save,
  CheckCircle2,
  XCircle,
  CreditCard,
  Key,
  Webhook,
  AlertTriangle,
  Info,
  Shield,
  Zap,
  Building2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPlatformStats } from "@/lib/mock-data";

function SuperAdminSettingsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "general";

  const [appName, setAppName] = useState("TutorLMS");
  const [supportEmail, setSupportEmail] = useState("support@tutorlms.com");
  const [rootDomain, setRootDomain] = useState("tutorlms.com");
  const [saving, setSaving] = useState(false);

  const [toggles, setToggles] = useState({
    manualApproval: true,
    freePlan: true,
    emailVerification: false,
  });

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" description="Configure global platform settings" />

      {/* ── Two-column layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── LEFT ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-5">
          {/* GENERAL */}
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm font-bold text-slate-900 mb-5">Platform Configuration</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Platform Name
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Support Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      type="email"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Root Domain
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={rootDomain}
                      onChange={(e) => setRootDomain(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">Changes apply globally across all orgs.</p>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-2 h-9 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-all shadow-sm"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* REGISTRATION */}
          {activeTab === "registration" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm font-bold text-slate-900 mb-5">Registration Settings</p>
              <div className="space-y-3">
                {[
                  {
                    key: "manualApproval" as const,
                    title: "Require Manual Approval",
                    desc: "New coaching centers require admin approval before activation",
                  },
                  {
                    key: "freePlan" as const,
                    title: "Allow Free Plan",
                    desc: "Allow new centers to register on the free plan",
                  },
                  {
                    key: "emailVerification" as const,
                    title: "Email Verification",
                    desc: "Require email verification on registration",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setToggles((t) => ({ ...t, [item.key]: !t[item.key] }))}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors shrink-0",
                        toggles[item.key]
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      )}
                    >
                      {toggles[item.key] ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" /> Disabled
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                <button
                  onClick={save}
                  className="flex items-center gap-2 h-9 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* BILLING */}
          {activeTab === "billing" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm font-bold text-slate-900 mb-2">Billing Configuration</p>
              <p className="text-xs text-slate-400 mb-5">
                Connect Razorpay to enable billing for coaching centers.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3 mb-5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Keep your API keys secret. Never share them publicly.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Razorpay Key ID", icon: Key, placeholder: "rzp_live_xxxxxxxxxxxx" },
                  { label: "Razorpay Key Secret", icon: Shield, placeholder: "••••••••••••••••" },
                  { label: "Webhook Secret", icon: Webhook, placeholder: "whsec_xxxxxxxxxxxx" },
                ].map(({ label, icon: Icon, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder={placeholder}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                <button
                  onClick={save}
                  className="flex items-center gap-2 h-9 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" /> Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT panel ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === "general" && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Platform Summary
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Zap, label: "Name", value: appName },
                    { icon: Mail, label: "Support", value: supportEmail },
                    { icon: Globe, label: "Domain", value: rootDomain },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                          {label}
                        </p>
                        <p className="text-xs font-semibold text-slate-800 truncate">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Platform Stats
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      icon: Building2,
                      label: "Total Orgs",
                      value: mockPlatformStats.totalOrgs,
                      color: "bg-indigo-50 text-indigo-600",
                    },
                    {
                      icon: Users,
                      label: "Total Students",
                      value: mockPlatformStats.totalStudents.toLocaleString(),
                      color: "bg-violet-50 text-violet-600",
                    },
                    {
                      icon: Shield,
                      label: "Uptime",
                      value: "99.9%",
                      color: "bg-emerald-50 text-emerald-600",
                    },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center",
                            color
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-slate-600">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Changes to platform name and domain will reflect across all coaching centers.
                </p>
              </div>
            </>
          )}

          {activeTab === "registration" && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Current Status
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Manual Approval", enabled: toggles.manualApproval },
                    { label: "Free Plan", enabled: toggles.freePlan },
                    { label: "Email Verify", enabled: toggles.emailVerification },
                  ].map(({ label, enabled }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{label}</span>
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                          enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Manual approval is recommended to prevent spam registrations.
                </p>
              </div>
            </>
          )}

          {activeTab === "billing" && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Billing Status
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Gateway", value: "Razorpay", color: "text-indigo-600" },
                    { label: "Currency", value: "INR (₹)", color: "text-slate-700" },
                    { label: "Mode", value: "Live", color: "text-emerald-600" },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-xs text-slate-400">{label}</span>
                      <span className={cn("text-xs font-bold", color)}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5">
                <p className="text-sm font-bold text-white mb-1">MRR</p>
                <p className="text-3xl font-black text-white">
                  ₹{(mockPlatformStats.monthlyRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-indigo-200 mt-1">Monthly recurring revenue</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3">
                <Shield className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  API keys are encrypted at rest. Only store live keys in production.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminSettingsPage() {
  return (
    <Suspense
      fallback={<div className="h-64 animate-pulse bg-white rounded-2xl border border-slate-200" />}
    >
      <SuperAdminSettingsContent />
    </Suspense>
  );
}
