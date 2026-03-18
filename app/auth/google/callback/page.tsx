"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { api } from "@/lib/api";
import { decodeToken, saveTokens, getRedirectPath, type AuthOrg } from "@/lib/auth";
import { setUser } from "@/store/slices/authSlice";

interface GoogleCallbackData {
  user: {
    id: string;
    name: string;
    emails: Array<{ address: string; is_verified: boolean }>;
    profile_picture: string;
  };
  organisations: AuthOrg[];
  access_token: string;
  refresh_token: string;
}

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      toast.error("Invalid OAuth callback");
      router.replace("/login");
      return;
    }

    const exchange = async () => {
      try {
        const res = await api.post<GoogleCallbackData>("/auth/google/callback", { code, state });

        saveTokens(res.data.access_token, res.data.refresh_token);

        const decoded = decodeToken(res.data.access_token);
        const platformRole = decoded?.platform_role ?? "";

        dispatch(
          setUser({
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.emails[0]?.address ?? "",
            platform_role: platformRole,
            organisations: res.data.organisations,
            profile_picture: res.data.user.profile_picture,
          })
        );

        toast.success("Signed in with Google!");
        router.replace(getRedirectPath(platformRole, res.data.organisations));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Google sign-in failed");
        router.replace("/login");
      }
    };

    void exchange();
  }, [searchParams, router, dispatch]);

  return null;
}

function LoadingUI() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
        <GraduationCap className="h-6 w-6 text-white" />
      </div>
      <p className="text-sm font-semibold text-slate-600">Signing you in with Google...</p>
      <div className="flex gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <LoadingUI />
      <GoogleCallbackInner />
    </Suspense>
  );
}
