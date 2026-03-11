"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
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

const step2Schema = z
  .object({
    adminName: z.string().min(2, "Name is required"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const steps = ["Center Details", "Admin Account", "Confirmation"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });

  const onStep1 = (data: Step1Data) => {
    setStep1Data(data);
    setStep(1);
  };
  const onStep2 = async (data: Step2Data) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.log({ ...step1Data, ...data });
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 mb-4">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Register Your Coaching Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            We&apos;ll review and approve within 24 hours
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${i <= step ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}
              >
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${i <= step ? "text-indigo-600" : "text-slate-400"}`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={`h-px w-8 ${i < step ? "bg-indigo-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {/* Step 1 */}
          {step === 0 && (
            <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Center Information</h2>
              {[
                {
                  name: "centerName" as const,
                  label: "Center Name",
                  placeholder: "Allen Career Institute",
                },
                { name: "city" as const, label: "City", placeholder: "Kota" },
                { name: "phone" as const, label: "Phone Number", placeholder: "9876543210" },
                {
                  name: "email" as const,
                  label: "Official Email",
                  placeholder: "admin@yourcenter.com",
                },
                {
                  name: "website" as const,
                  label: "Website (optional)",
                  placeholder: "https://yourcenter.com",
                },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    {...form1.register(name)}
                    placeholder={placeholder}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                  {form1.formState.errors[name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {form1.formState.errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full h-10 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Admin Account Setup</h2>
              {[
                {
                  name: "adminName" as const,
                  label: "Your Full Name",
                  placeholder: "Rajesh Kumar",
                  type: "text",
                },
                {
                  name: "password" as const,
                  label: "Password",
                  placeholder: "••••••••",
                  type: "password",
                },
                {
                  name: "confirmPassword" as const,
                  label: "Confirm Password",
                  placeholder: "••••••••",
                  type: "password",
                },
              ].map(({ name, label, placeholder, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    {...form2.register(name)}
                    type={type}
                    placeholder={placeholder}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                  {form2.formState.errors[name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {form2.formState.errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 h-10 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={form2.formState.isSubmitting}
                  className="flex-1 h-10 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                >
                  {form2.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="text-center py-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-9 w-9 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Application Submitted!</h2>
              <p className="text-sm text-slate-500 mb-6">
                We&apos;ve received your registration for <strong>{step1Data?.centerName}</strong>.
                We&apos;ll review and get back to you within 24 hours on{" "}
                <strong>{step1Data?.email}</strong>.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>

        {step < 2 && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Already registered?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
