"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Building2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const step1Schema = z.object({
  centerName: z.string().min(3, "Center name is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(10, "Enter valid phone number"),
  email: z.string().email("Enter valid email"),
  website: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;

const steps = [
  { label: "Center Details", desc: "Basic info about your coaching center" },
  { label: "Review", desc: "Confirm your details" },
  { label: "Submitted", desc: "Waiting for approval" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Step1Data | null>(null);
  const router = useRouter();

  const handleSkip = () => {
    localStorage.setItem("org_setup_skipped", "true");
    router.push("/");
  };

  const form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });

  const onSubmit = (data: Step1Data) => {
    setFormData(data);
    setStep(1);
  };

  const submitRequest = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900">TutorLMS</span>
        </div>
        <button
          onClick={handleSkip}
          className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          Skip for now →
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 mb-4">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Request your organization</h1>
          <p className="text-slate-500">
            Set up your coaching center space. We&apos;ll review and approve within 24 hours.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-start justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm transition-all ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {i < step ? <CheckCircle className="h-5 w-5" /> : i + 1}
                </div>
                <p
                  className={`text-xs font-semibold mt-2 ${i <= step ? "text-indigo-600" : "text-slate-400"}`}
                >
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-20 mx-2 mt-[-14px] ${i < step ? "bg-indigo-600" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 0: Center Details ── */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Center Information</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> Center Name
                  </span>
                </label>
                <input
                  {...form.register("centerName")}
                  placeholder="Allen Career Institute"
                  className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {form.formState.errors.centerName && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {form.formState.errors.centerName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> City
                    </span>
                  </label>
                  <input
                    {...form.register("city")}
                    placeholder="Kota"
                    className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {form.formState.errors.city && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </span>
                  </label>
                  <input
                    {...form.register("phone")}
                    placeholder="9876543210"
                    className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {form.formState.errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Official Email
                  </span>
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="admin@yourcenter.com"
                  className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {form.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Website{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </span>
                </label>
                <input
                  {...form.register("website")}
                  placeholder="https://yourcenter.com"
                  className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Continue to Review <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
              >
                Skip for now, I&apos;ll set this up later
              </button>
            </form>
          </div>
        )}

        {/* ── Step 1: Review ── */}
        {step === 1 && formData && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Review your details</h2>
            <p className="text-sm text-slate-500 mb-6">
              Please confirm everything looks correct before submitting.
            </p>

            <div className="rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100 mb-8">
              {[
                { label: "Center Name", value: formData.centerName, icon: Building2 },
                { label: "City", value: formData.city, icon: MapPin },
                { label: "Phone", value: formData.phone, icon: Phone },
                { label: "Official Email", value: formData.email, icon: Mail },
                ...(formData.website
                  ? [{ label: "Website", value: formData.website, icon: Globe }]
                  : []),
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={submitRequest}
                className="flex-1 h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Building2 className="h-4 w-4" /> Submit Request
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Submitted ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Request submitted!</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              We&apos;ve received your request for <strong>{formData?.centerName}</strong>. Our team
              will review and set everything up for you.
            </p>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 mb-8 text-left">
              <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Approval within 24 hours</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  You&apos;ll receive an email at <strong>{formData?.email}</strong> once your
                  organization is ready.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
