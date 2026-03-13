"use client";

import { useState } from "react";
import Link from "next/link";
import { Code2, ChevronDown, X } from "lucide-react";

const sections = [
  {
    label: "Marketing",
    color: "bg-slate-700",
    links: [
      { label: "Landing Page", href: "/" },
      { label: "Register Center", href: "/register" },
      { label: "Login", href: "/login" },
      { label: "Student Join", href: "/join/abc123" },
    ],
  },
  {
    label: "Super Admin",
    color: "bg-purple-700",
    links: [
      { label: "Dashboard", href: "/super-admin/dashboard" },
      { label: "Organizations", href: "/super-admin/organizations" },
      { label: "Org Detail", href: "/super-admin/organizations/org-1" },
    ],
  },
  {
    label: "Org Admin",
    color: "bg-indigo-700",
    links: [
      { label: "Dashboard", href: "/org/allen/dashboard" },
      { label: "Batches", href: "/org/allen/batches" },
      { label: "New Batch", href: "/org/allen/batches/new" },
      { label: "Batch Overview", href: "/org/allen/batches/batch-1" },
      { label: "Notes", href: "/org/allen/batches/batch-1/notes" },
      { label: "Videos", href: "/org/allen/batches/batch-1/videos" },
      { label: "Tests", href: "/org/allen/batches/batch-1/tests" },
      { label: "New Test", href: "/org/allen/batches/batch-1/tests/new" },
      { label: "Test Detail", href: "/org/allen/batches/batch-1/tests/test-1" },
      { label: "Attendance", href: "/org/allen/batches/batch-1/attendance" },
      { label: "Students", href: "/org/allen/students" },
      { label: "Teachers", href: "/org/allen/teachers" },
      { label: "Reports", href: "/org/allen/reports" },
      { label: "Settings", href: "/org/allen/settings" },
    ],
  },
  {
    label: "Student",
    color: "bg-green-700",
    links: [
      { label: "Dashboard", href: "/student/dashboard" },
      { label: "Batch Home", href: "/student/batches/batch-1" },
      { label: "Notes", href: "/student/batches/batch-1/notes" },
      { label: "Videos", href: "/student/batches/batch-1/videos" },
      { label: "Tests", href: "/student/batches/batch-1/tests" },
      { label: "Test Attempt", href: "/student/batches/batch-1/tests/test-1" },
      { label: "Test Result", href: "/student/batches/batch-1/tests/test-1/result" },
      { label: "Attendance", href: "/student/batches/batch-1/attendance" },
    ],
  },
];

export function DevNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-[9999]">
      {open && (
        <div className="mb-2 w-72 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dev Navigation
            </p>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2 space-y-2">
            {sections.map((section) => (
              <div key={section.label}>
                <p
                  className={`text-[10px] font-bold text-white px-2 py-1 rounded-md mb-1 ${section.color}`}
                >
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center px-2 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-lg hover:bg-slate-800 transition-colors"
      >
        <Code2 className="h-4 w-4" />
        <span className="text-xs font-semibold">Dev Nav</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
