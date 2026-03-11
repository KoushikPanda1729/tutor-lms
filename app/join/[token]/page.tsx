"use client";

import { GraduationCap, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, use } from "react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter valid email"),
  phone: z.string().min(10, "Enter valid phone"),
  password: z.string().min(8, "Minimum 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log({ token: token, ...data });
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">You&apos;re enrolled!</h1>
          <p className="text-sm text-slate-500 mb-6">
            Your account has been created and you&apos;ve been enrolled in the batch.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Sign in to your account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-indigo-600 rounded-t-2xl px-8 py-6 text-white text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 mb-3">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-medium text-indigo-200">You&apos;ve been invited to join</p>
          <h1 className="text-xl font-bold">Allen Career Institute</h1>
          <p className="text-xs text-indigo-200 mt-1">JEE Advanced 2026 — Batch A</p>
        </div>
        <div className="bg-white rounded-b-2xl border border-slate-200 shadow-sm px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Create your account</h2>
            {[
              {
                name: "name" as const,
                label: "Full Name",
                placeholder: "Aarav Sharma",
                type: "text",
              },
              {
                name: "email" as const,
                label: "Email",
                placeholder: "you@example.com",
                type: "email",
              },
              {
                name: "phone" as const,
                label: "Phone Number",
                placeholder: "9876543210",
                type: "tel",
              },
              {
                name: "password" as const,
                label: "Set Password",
                placeholder: "••••••••",
                type: "password",
              },
            ].map(({ name, label, placeholder, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {errors[name] && (
                  <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors mt-2"
            >
              {isSubmitting ? "Creating account..." : "Join Batch"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
