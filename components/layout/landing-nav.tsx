"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearUser } from "@/store/slices/authSlice";
import { clearTokens, getRedirectPath } from "@/lib/auth";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isHome = pathname === "/";

  const dashboardPath = user ? getRedirectPath(user.platform_role, user.organisations) : "/login";

  function handleSignOut() {
    clearTokens();
    dispatch(clearUser());
    router.push("/");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "bg-white border-b border-slate-200 shadow-sm"
          : "bg-white border-b border-slate-100"
      )}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">TutorLMS</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{user.name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        {user ? (
          <div className="md:hidden flex items-center gap-1.5">
            <Link
              href={dashboardPath}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <div className="h-5 w-5 rounded-md bg-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700">Dashboard</span>
            </Link>
          </div>
        ) : isHome ? (
          <Link
            href="/register"
            className="md:hidden inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            Start Free <ArrowRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
