"use client";

import {
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { mockBatches } from "@/lib/mock-data";
import Link from "next/link";

const STUDENT = {
  name: "Aarav Sharma",
  email: "aarav@example.com",
  phone: "9876501234",
  joinedAt: "10 Jun 2024",
  initials: "AS",
  batches: 2,
  tests: 12,
  attendance: 87,
};

const STUDENT_BATCH_IDS = ["batch-1", "batch-3"];
const myBatches = mockBatches.filter((b) => STUDENT_BATCH_IDS.includes(b.id));

export default function StudentProfilePage() {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-20 bg-gradient-to-r from-indigo-500 to-violet-500" />
        {/* Avatar + name */}
        <div className="px-5 pb-5 -mt-8">
          <div className="flex items-end justify-between">
            <div className="h-16 w-16 rounded-2xl bg-indigo-100 border-4 border-white flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-indigo-700">{STUDENT.initials}</span>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-base font-bold text-slate-900">{STUDENT.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> Student · Allen Career Institute
            </p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-base font-bold text-indigo-600">{STUDENT.batches}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <BookOpen className="h-2.5 w-2.5" /> Batches
              </span>
            </div>
            <div className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-base font-bold text-amber-600">{STUDENT.tests}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <ClipboardList className="h-2.5 w-2.5" /> Tests
              </span>
            </div>
            <div className="flex flex-col items-center py-3 gap-0.5">
              <span className="text-base font-bold text-emerald-600">{STUDENT.attendance}%</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <CalendarCheck className="h-2.5 w-2.5" /> Attendance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-5 pt-4 pb-2">
          Contact
        </p>
        <div className="divide-y divide-slate-100">
          {[
            { icon: Mail, label: STUDENT.email },
            { icon: Phone, label: STUDENT.phone },
            { icon: Calendar, label: `Joined ${STUDENT.joinedAt}` },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-3">
              <span className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Icon className="h-3.5 w-3.5 text-slate-500" />
              </span>
              <span className="text-sm text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* My Batches */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-5 pt-4 pb-2">
          My Batches
        </p>
        <div className="divide-y divide-slate-100">
          {myBatches.map((batch) => (
            <Link
              key={batch.id}
              href={`/student/batches/${batch.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
            >
              <span className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{batch.name}</p>
                <p className="text-[11px] text-slate-400">{batch.subject}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Account actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-5 pt-4 pb-2">
          Account
        </p>
        <div className="divide-y divide-slate-100">
          <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
            <span className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-slate-500" />
            </span>
            <span className="text-sm text-slate-700">Edit Profile</span>
            <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 ml-auto" />
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors group">
            <span className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-red-400" />
            </span>
            <span className="text-sm text-red-500 font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
