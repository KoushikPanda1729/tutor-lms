import Link from "next/link";
import { OrgSetupBanner } from "@/components/ui/org-setup-banner";
import { HeroSlider } from "@/components/ui/hero-slider";
import { LandingNav } from "@/components/layout/landing-nav";
import {
  GraduationCap,
  CheckCircle,
  Building2,
  Users,
  BookOpen,
  BarChart3,
  CalendarCheck,
  Video,
  ClipboardList,
  FileText,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Zap,
  Shield,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Multi-Center Management",
    desc: "Each coaching center gets their own branded subdomain and fully isolated data.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Users,
    title: "Student Onboarding",
    desc: "Invite students via link or let them join with your center code instantly.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: BookOpen,
    title: "Content Management",
    desc: "Upload notes, videos, and schedule tests per batch with ease.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Track attendance, test scores, and student performance in one place.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: CalendarCheck,
    title: "Attendance Tracking",
    desc: "Mark daily attendance per batch with a beautiful calendar view.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: ClipboardList,
    title: "Online Tests",
    desc: "Create MCQ tests, auto-grade submissions, and view detailed reports.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Video,
    title: "Video Lectures",
    desc: "Upload or link YouTube videos with drag-to-reorder for each batch.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: FileText,
    title: "Notes & PDFs",
    desc: "Share study materials as PDFs with preview and download support.",
    color: "bg-orange-50 text-orange-600",
  },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    desc: "Get started for free",
    features: ["2 Batches", "50 Students", "1 GB Storage", "Notes & Attendance", "Basic Support"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹2,999",
    desc: "per month",
    badge: "Most Popular",
    features: [
      "20 Batches",
      "500 Students",
      "20 GB Storage",
      "Tests & Videos",
      "Analytics",
      "Priority Support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "contact us",
    features: [
      "Unlimited Batches",
      "Unlimited Students",
      "Unlimited Storage",
      "Priority Support",
      "Custom Domain",
      "Dedicated Manager",
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Documentation", "Help Center", "Contact", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <OrgSetupBanner />
      <LandingNav />

      {/* Hero */}
      <HeroSlider />

      {/* Features */}
      <section id="features" className="py-28 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
                Platform Features
              </span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
              Everything in one{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-indigo-600">platform</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-indigo-100 rounded-full -z-0" />
              </span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Powerful tools designed for coaching centers of all sizes — from a single tutor to
              multi-branch institutes.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big card: Multi-Center */}
            <div className="md:col-span-2 relative rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 overflow-hidden group cursor-default">
              <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute right-10 bottom-0 h-32 w-32 rounded-full bg-violet-400/20 blur-xl" />
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Multi-Center Management</h3>
                <p className="text-indigo-200 leading-relaxed max-w-sm">
                  Each coaching center gets their own branded subdomain and fully isolated data —
                  manage everything from one master dashboard.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <span>Isolated data per center</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>Custom subdomains</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>Role-based access</span>
                </div>
              </div>
            </div>

            {/* Student Onboarding */}
            <div className="rounded-3xl bg-slate-900 p-7 relative overflow-hidden group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-transparent" />
              <div className="relative z-10">
                <div className="h-11 w-11 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-5 border border-violet-500/30">
                  <Users className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Student Onboarding</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Invite students via link or let them join instantly with your center code.
                </p>
              </div>
            </div>

            {/* Attendance */}
            <div className="rounded-3xl bg-amber-50 border border-amber-100 p-7 group hover:shadow-lg hover:shadow-amber-100 transition-all duration-300 cursor-default">
              <div className="h-11 w-11 rounded-2xl bg-amber-100 flex items-center justify-center mb-5">
                <CalendarCheck className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Attendance Tracking</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Mark daily attendance per batch with a beautiful calendar view and instant reports.
              </p>
              <div className="mt-5 grid grid-cols-7 gap-1">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 w-full rounded-sm ${
                      [2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19].includes(i)
                        ? "bg-amber-400"
                        : [4, 11, 18].includes(i)
                          ? "bg-red-300"
                          : "bg-amber-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Online Tests */}
            <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-7 group hover:shadow-lg hover:shadow-rose-100 transition-all duration-300 cursor-default relative overflow-hidden">
              <div className="absolute right-6 top-6 flex gap-2">
                {["MCQ", "Fill", "True/False"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold bg-white border border-rose-100 text-rose-500 px-2.5 py-1 rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="h-11 w-11 rounded-2xl bg-rose-100 flex items-center justify-center mb-5">
                <ClipboardList className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Online Tests & Auto-Grading</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Create MCQ tests, auto-grade submissions instantly, and view detailed performance
                reports per student.
              </p>
            </div>

            {/* Reports */}
            <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-7 group hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 cursor-default">
              <div className="h-11 w-11 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reports & Analytics</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Track attendance, test scores, and student performance. Spot trends before they
                become problems.
              </p>
              <div className="mt-5 flex items-end gap-1.5 h-12">
                {[40, 65, 50, 80, 60, 90, 75, 95, 70, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-emerald-400/60 group-hover:bg-emerald-500/70 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Video Lectures */}
            <div className="rounded-3xl bg-sky-50 border border-sky-100 p-7 group hover:shadow-lg hover:shadow-sky-100 transition-all duration-300 cursor-default">
              <div className="h-11 w-11 rounded-2xl bg-sky-100 flex items-center justify-center mb-5">
                <Video className="h-5 w-5 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Video Lectures</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Upload or link YouTube videos with drag-to-reorder for each batch.
              </p>
            </div>

            {/* Content Management */}
            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-7 group hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-default">
              <div className="h-11 w-11 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Content Management</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Upload notes, videos, and schedule tests per batch with ease.
              </p>
            </div>

            {/* Notes & PDFs */}
            <div className="rounded-3xl bg-orange-50 border border-orange-100 p-7 group hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 cursor-default">
              <div className="h-11 w-11 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Notes & PDFs</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Share study materials as PDFs with preview and download support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">
                Why TutorLMS
              </p>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Built specifically for Indian coaching centers
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Unlike generic LMS platforms, TutorLMS is designed from the ground up for JEE, NEET,
                and competitive exam coaching institutes.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Zap,
                    title: "Lightning Fast Setup",
                    desc: "Get your center live in under 10 minutes.",
                  },
                  {
                    icon: Shield,
                    title: "Secure & Reliable",
                    desc: "99.9% uptime with daily backups and SOC2 compliance.",
                  },
                  {
                    icon: HeadphonesIcon,
                    title: "Dedicated Support",
                    desc: "Real humans available via chat and phone.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white">
              <p className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-6">
                Quick Glance
              </p>
              <div className="space-y-4">
                {[
                  { label: "Average attendance tracked per day", value: "2,400+" },
                  { label: "Tests auto-graded per month", value: "18,000+" },
                  { label: "Notes & videos served", value: "95,000+" },
                  { label: "Centers onboarded in 2024", value: "40+" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-b border-white/10 pb-4"
                  >
                    <p className="text-sm text-indigo-200">{item.label}</p>
                    <p className="text-xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 relative ${
                  plan.highlight
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <p
                  className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}
                >
                  {plan.name}
                </p>
                <p
                  className={`text-4xl font-extrabold mb-0.5 ${plan.highlight ? "text-white" : "text-slate-900"}`}
                >
                  {plan.price}
                </p>
                <p
                  className={`text-sm mb-7 ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}
                >
                  {plan.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle
                        className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-indigo-200" : "text-green-500"}`}
                      />
                      <span className={plan.highlight ? "text-indigo-100" : "text-slate-600"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to transform your institute?
          </h2>
          <p className="text-indigo-200 text-lg mb-10">
            Join 40+ coaching centers already using TutorLMS. Setup takes less than 10 minutes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-bold text-white">TutorLMS</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-xs">
                The complete learning management system built for Indian coaching centers. Manage
                everything from one place.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:hello@tutorlms.in"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" /> hello@tutorlms.in
                </a>
                <a
                  href="tel:+911800123456"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" /> +91 1800-123-456
                </a>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Bangalore, India
                </p>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-white font-semibold text-sm mb-4">{category}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 TutorLMS Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@tutorlms.in"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
