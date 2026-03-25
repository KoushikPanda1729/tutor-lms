"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";

const schema = z
  .object({
    new_password: z.string().min(8, "Minimum 8 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!resetToken) {
      toast.error("Invalid or missing reset token");
      return;
    }
    try {
      const res = await api.post("/auth/reset-password", {
        reset_token: resetToken,
        new_password: data.new_password,
      });
      toast.success(res.message);
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
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
          {done ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Password updated!</h1>
              <p className="text-slate-500 text-sm">Redirecting you to sign in...</p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900">Set new password</h1>
                <p className="text-slate-500 text-sm mt-1.5">Must be at least 8 characters.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("new_password")}
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 pr-11 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.new_password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirm_password")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 pr-11 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.confirm_password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors mt-2"
                >
                  {isSubmitting ? "Updating..." : "Update password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
