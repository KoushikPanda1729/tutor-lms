"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { clearTokens } from "@/lib/auth";
import { clearUser } from "@/store/slices/authSlice";

export function useLogout() {
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refresh_token: refreshToken });
      }
    } catch {
      // Proceed with local logout even if the API call fails
    } finally {
      clearTokens();
      dispatch(clearUser());
      router.push("/login");
      toast.success("Signed out successfully");
    }
  };

  return logout;
}
