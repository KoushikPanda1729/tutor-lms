"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { setUser } from "@/store/slices/authSlice";
import { decodeToken } from "@/lib/auth";

type MeOrg = { organisation_id: string; organisation_name: string; role: string; status: string };
type MeEmail = { id: string; address: string; is_verified: boolean };

const PROTECTED_PREFIXES = ["/org/", "/super-admin/", "/student/"];

function AuthRedirect() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const payload = decodeToken(token);
    if (!payload) return;

    api
      .get<{ organisations: MeOrg[]; emails: MeEmail[]; name: string }>("/users/me")
      .then((res) => {
        const meOrgs = res?.data?.organisations ?? [];
        const orgs = meOrgs.map((o) => ({
          id: o.organisation_id,
          name: o.organisation_name,
          role: o.role,
        }));

        // Restore Redux auth state on every page refresh
        const email = res?.data?.emails?.[0]?.address ?? payload.user.email;
        dispatch(
          setUser({
            id: payload.user.user_id,
            name: res?.data?.name ?? payload.user.name,
            email,
            platform_role: payload.platform_role,
            organisations: orgs,
          })
        );

        // Redirect to dashboard if org was approved and user is not already there
        const active = meOrgs.find((o) => o.status === "active");
        if (active) {
          const alreadyOnApp = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
          if (!alreadyOnApp) {
            router.replace(`/org/${active.organisation_id}/dashboard`);
          }
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthRedirect />
        {children}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
