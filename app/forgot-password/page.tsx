"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/auth/forgot-password", { email: data.email });
      toast.success(res.message);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">TutorLMS</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <Mail className="h-7 w-7 text-indigo-500" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Check your email</h1>
              <p className="text-slate-500 text-sm mb-1">We sent a password reset link to</p>
              <p className="font-semibold text-slate-800 text-sm mb-6">{getValues("email")}</p>
              <p className="text-xs text-slate-400">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900">Forgot password?</h1>
                <p className="text-slate-500 text-sm mt-1.5">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors mt-2"
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
