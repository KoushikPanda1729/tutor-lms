"use client";

import { Suspense, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Camera,
  Trash2,
  ExternalLink,
  Save,
  Info,
  Lock,
  HelpCircle,
  BookOpen,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockBatches, mockStudents } from "@/lib/mock-data";

function SettingsContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "general";

  const [orgName, setOrgName] = useState("Allen Career Institute");
  const [city, setCity] = useState("Kota");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("admin@allen.ac.in");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Settings saved successfully!");
  };

  const initials = orgName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeBatches = mockBatches.filter((b) => b.status === "active");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your institute settings" />

      {/* ── Two-column layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── LEFT: Main content ─────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-5">
          {/* ── GENERAL ─────────────────────────────────────────────── */}
          {activeTab === "general" && (
            <>
              {/* Logo card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <p className="text-sm font-bold text-slate-900 mb-4">Institute Logo</p>
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                      <span className="text-xl font-black text-white">{initials}</span>
                    </div>
                    <button className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors">
                      <Camera className="h-3 w-3 text-slate-500" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{orgName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Your institute name initials are used as the logo
                    </p>
                    <button className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                      Upload custom logo →
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile form */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <p className="text-sm font-bold text-slate-900 mb-5">Institute Profile</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      Institute Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Allen Career Institute"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Kota"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="admin@example.com"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      Subdomain
                    </label>
                    <div className="flex items-center">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          value={slug}
                          readOnly
                          className="h-10 w-full rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <span className="h-10 flex items-center rounded-r-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 shrink-0">
                        .tutorlms.com
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
                      <Lock className="h-3 w-3 text-amber-400" />
                      Contact support to change your subdomain.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Changes will apply immediately.</p>
                  <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-all shadow-sm shadow-indigo-200 whitespace-nowrap"
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
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── BILLING ─────────────────────────────────────────────── */}
          {activeTab === "billing" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">
                      Current Plan
                    </p>
                    <p className="text-2xl font-black text-white">Enterprise</p>
                    <p className="text-sm text-indigo-200 mt-0.5">Billed annually · ₹49,999/yr</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  What&apos;s included
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  {[
                    "Unlimited students",
                    "Unlimited batches",
                    "SOC2 compliant",
                    "Priority support",
                    "Custom subdomain",
                    "Invoice & GST billing",
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => toast.success("Redirecting to billing portal…")}
                    className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Manage Billing
                  </button>
                  <button
                    onClick={() => toast.success("Invoice downloaded!")}
                    className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── DANGER ZONE ─────────────────────────────────────────── */}
          {activeTab === "danger" && (
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700">Danger Zone</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    These actions are irreversible. Proceed with caution.
                  </p>
                </div>
              </div>

              <div className="border border-red-100 bg-red-50/50 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Delete Institute</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Permanently delete your institute account, all batches, student data,
                      attendance records, and test results. This action{" "}
                      <span className="font-semibold text-red-600">cannot be undone</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => toast.error("Please contact support to delete your account.")}
                    className="flex items-center gap-2 h-9 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shrink-0 shadow-sm self-start"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Info panel ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* GENERAL right panel */}
          {activeTab === "general" && (
            <>
              {/* Profile summary */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Profile Summary
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Building2, label: "Name", value: orgName },
                    { icon: MapPin, label: "City", value: city },
                    { icon: Phone, label: "Phone", value: phone },
                    { icon: Mail, label: "Email", value: email },
                    { icon: Globe, label: "URL", value: `${slug}.tutorlms.com` },
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

              {/* Quick stats */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Institute Stats
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      icon: Users,
                      label: "Total Students",
                      value: mockStudents.length,
                      color: "bg-indigo-50 text-indigo-600",
                    },
                    {
                      icon: BookOpen,
                      label: "Active Batches",
                      value: activeBatches.length,
                      color: "bg-violet-50 text-violet-600",
                    },
                    {
                      icon: Star,
                      label: "Avg Rating",
                      value: "4.9★",
                      color: "bg-amber-50 text-amber-600",
                    },
                    {
                      icon: Shield,
                      label: "Plan",
                      value: "Enterprise",
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

              {/* Help tip */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Keep your institute name and contact details up to date so students can always
                  reach you.
                </p>
              </div>
            </>
          )}

          {/* BILLING right panel */}
          {activeTab === "billing" && (
            <>
              {/* Usage */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Usage
                </p>
                <div className="space-y-4">
                  {[
                    {
                      label: "Students",
                      used: mockStudents.length,
                      max: "Unlimited",
                      pct: 20,
                      color: "bg-indigo-500",
                    },
                    {
                      label: "Batches",
                      used: activeBatches.length,
                      max: "Unlimited",
                      pct: 15,
                      color: "bg-violet-500",
                    },
                    {
                      label: "Storage",
                      used: "2.3 GB",
                      max: "100 GB",
                      pct: 23,
                      color: "bg-sky-500",
                    },
                  ].map(({ label, used, max, pct, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-600">{label}</span>
                        <span className="text-xs text-slate-400">
                          {used} / {max}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", color)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Renewal */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <CreditCard className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Renews Dec 31, 2025</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Auto-renews. Cancel anytime from the billing portal.
                  </p>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5">
                <p className="text-sm font-bold text-white mb-1">Need more?</p>
                <p className="text-xs text-indigo-200 mb-3">
                  Talk to our team for custom plans, white-labeling, or dedicated support.
                </p>
                <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-3 py-1.5">
                  Contact Sales <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </>
          )}

          {/* DANGER right panel */}
          {activeTab === "danger" && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Before you delete
                </p>
                <div className="space-y-3">
                  {[
                    "Export all student data first",
                    "Download attendance records",
                    "Save test results & scores",
                    "Notify your students & teachers",
                    "Cancel your subscription",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-red-500">{i + 1}</span>
                      </div>
                      <p className="text-xs text-slate-600">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                <HelpCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-700 mb-0.5">Need help instead?</p>
                  <p className="text-xs text-red-600 leading-relaxed">
                    Contact our support team before deleting. We can help with data exports or
                    account issues.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={<div className="h-64 animate-pulse bg-white rounded-2xl border border-slate-200" />}
    >
      <SettingsContent params={params} />
    </Suspense>
  );
}
