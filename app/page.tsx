import Link from "next/link";
import {
  GraduationCap,
  CheckCircle,
  Building2,
  Users,
  BookOpen,
  BarChart3,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Multi-Center Management",
    desc: "Each coaching center gets their own branded subdomain and isolated data.",
  },
  {
    icon: Users,
    title: "Student Onboarding",
    desc: "Invite students via link or let them join with your center code.",
  },
  {
    icon: BookOpen,
    title: "Content Management",
    desc: "Upload notes, videos, and schedule tests per batch.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Track attendance, test scores, and student performance in one place.",
  },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    desc: "Get started",
    features: ["2 Batches", "50 Students", "1 GB Storage", "Notes & Attendance"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹2,999",
    desc: "per month",
    features: ["20 Batches", "500 Students", "20 GB Storage", "Tests & Videos", "Analytics"],
    cta: "Start Trial",
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
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">TutorLMS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <a href="#about" className="hover:text-slate-900 transition-colors">
              About
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Register Center <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 mb-6">
            <Star className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700">
              Trusted by 40+ coaching centers
            </span>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            The complete LMS for
            <br />
            <span className="text-indigo-600">coaching centers</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Manage batches, students, tests, notes, videos, and attendance — all from one platform.
            Each center gets their own subdomain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Register Your Center <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Everything you need to run your institute
            </h2>
            <p className="text-slate-500">
              Powerful tools designed for coaching centers of all sizes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm"
              >
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-500">Start free, upgrade as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${plan.highlight ? "border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "border-slate-200 bg-white"}`}
              >
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
                  className={`text-sm mb-6 ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}
                >
                  {plan.desc}
                </p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        className={`h-4 w-4 ${plan.highlight ? "text-indigo-200" : "text-green-500"}`}
                      />
                      <span className={plan.highlight ? "text-indigo-100" : "text-slate-600"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${plan.highlight ? "bg-white text-indigo-600 hover:bg-indigo-50" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">TutorLMS</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 TutorLMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
