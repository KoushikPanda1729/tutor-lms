"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80",
];

const stats = [
  { value: "40+", label: "Coaching Centers" },
  { value: "12,000+", label: "Active Students" },
  { value: "98%", label: "Uptime SLA" },
  { value: "4.9★", label: "Avg. Rating" },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[calc(90vh-4rem)] sm:h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background images */}
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${src})`, opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Glassy overlay */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

      {/* Subtle bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1.5 mb-5 sm:mb-7">
          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[11px] sm:text-xs font-semibold text-white">
            Trusted by 40+ coaching centers across India
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-4 sm:mb-6 drop-shadow-lg">
          The complete LMS for
          <br />
          <span className="text-indigo-300">coaching centers</span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-7 sm:mb-10 leading-relaxed">
          Manage batches, students, tests, notes, videos, and attendance — all from one platform.
        </p>

        <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10 flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-white/20 transition-colors"
          >
            See Features
          </a>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "bg-white w-5 h-1.5" : "bg-white/40 w-1.5 h-1.5 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-white drop-shadow">{s.value}</p>
              <p className="text-[11px] sm:text-sm text-white/60 mt-0.5 sm:mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
