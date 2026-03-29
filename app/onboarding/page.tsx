"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Building2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  LocateFixed,
  ImageIcon,
  ChevronRight,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/lib/api";
import { setUser } from "@/store/slices/authSlice";
import type { RootState } from "@/store";

const LocationMapPicker = dynamic(() => import("@/components/onboarding/location-map-picker"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-200 animate-pulse" />,
});

const schema = z.object({
  name: z.string().min(3, "Required"),
  type: z.string().min(1, "Required"),
  description: z.string().min(10, "Too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
  website: z.string().optional(),
  logo_url: z.string().optional(),
  cover_image_url: z.string().optional(),
  location_text: z.string().min(2, "Required"),
  latitude: z.number(),
  longitude: z.number(),
  attendance_radius_meters: z.number().min(50).max(5000),
  attendance_radius_enabled: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const ORG_TYPES = [
  { value: "institute", label: "Coaching Institute" },
  { value: "tutoring", label: "Tutoring Center" },
  { value: "school", label: "School" },
  { value: "university", label: "University / College" },
  { value: "other", label: "Other" },
];

const DEFAULT_LAT = 20.5937;
const DEFAULT_LNG = 78.9629;

// Compact input style
const inp =
  "w-full h-9 rounded-lg border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white transition-all";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Geocoding state
  type GeoResult = { display_name: string; lat: string; lon: string };
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [geoOpen, setGeoOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);

  // On initial mount: single check (handles page refresh while waiting).
  useEffect(() => {
    const orgId = localStorage.getItem("pending_org_id");
    if (!orgId) return;
    api
      .get<{ id: string; name: string }>(`/public/organisations/${orgId}`)
      .then((res) => {
        if (res?.data?.id) {
          localStorage.removeItem("pending_org_id");
          if (authUser) {
            dispatch(
              setUser({
                ...authUser,
                organisations: [{ id: res.data.id, name: res.data.name, role: "owner" }],
              })
            );
          }
          router.push(`/org/${res.data.id}/dashboard`);
        }
      })
      .catch(() => {
        /* still pending */
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On step 2 (queue screen): poll every 10s until approved.
  useEffect(() => {
    if (step !== 2) return;

    const orgId = localStorage.getItem("pending_org_id");
    if (!orgId) return;

    const interval = setInterval(() => {
      api
        .get<{ id: string; name: string }>(`/public/organisations/${orgId}`)
        .then((res) => {
          if (res?.data?.id) {
            clearInterval(interval);
            localStorage.removeItem("pending_org_id");
            if (authUser) {
              dispatch(
                setUser({
                  ...authUser,
                  organisations: [{ id: res.data.id, name: res.data.name, role: "owner" }],
                })
              );
            }
            router.push(`/org/${res.data.id}/dashboard`);
          }
        })
        .catch(() => {
          /* still pending */
        });
    }, 10000);

    return () => clearInterval(interval);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSkip = () => {
    localStorage.setItem("org_setup_skipped", "true");
    router.push("/");
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "institute",
      latitude: DEFAULT_LAT,
      longitude: DEFAULT_LNG,
      attendance_radius_meters: 200,
      attendance_radius_enabled: true,
    },
  });

  const { watch, setValue, control } = form;
  const w = watch();

  const onNext = () => setStep(1);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", parseFloat(pos.coords.latitude.toFixed(6)));
        setValue("longitude", parseFloat(pos.coords.longitude.toFixed(6)));
        toast.success("Location pinned");
      },
      () => toast.error("Could not get your location")
    );
  };

  const handleLocationInput = useCallback(
    (value: string) => {
      setValue("location_text", value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (value.trim().length < 2) {
        setGeoResults([]);
        setGeoOpen(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data: GeoResult[] = await res.json();
          setGeoResults(data);
          setGeoOpen(data.length > 0);
        } catch {
          // silently fail
        }
      }, 400);
    },
    [setValue]
  );

  const selectGeoResult = (result: GeoResult) => {
    setValue("location_text", result.display_name);
    setValue("latitude", parseFloat(parseFloat(result.lat).toFixed(6)));
    setValue("longitude", parseFloat(parseFloat(result.lon).toFixed(6)));
    setGeoResults([]);
    setGeoOpen(false);
  };

  const submitRequest = async () => {
    setSubmitting(true);
    try {
      const data = form.getValues();
      const res = await api.post<{ id: string }>("/organisation-requests", {
        name: data.name,
        type: data.type,
        description: data.description,
        logo_url: data.logo_url ?? "",
        cover_image_url: data.cover_image_url ?? "",
        location_text: data.location_text,
        latitude: data.latitude,
        longitude: data.longitude,
        attendance_radius_meters: data.attendance_radius_meters,
        attendance_radius_enabled: data.attendance_radius_enabled,
      });
      // Save the org id so we can poll for approval
      if (res?.data?.id) {
        localStorage.setItem("pending_org_id", res.data.id);
      }
      setSubmittedName(data.name);
      setSubmittedEmail(data.email);
      setStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  /* ══════════════════════════════════════════
     STEP 0 — Map fills entire screen, form panel floats on left
  ══════════════════════════════════════════ */
  if (step === 0) {
    return (
      <div className="min-h-screen md:h-screen relative md:overflow-hidden bg-white">
        {/* ── Desktop: full-screen map background ── */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Controller
            control={control}
            name="latitude"
            render={() => (
              <LocationMapPicker
                lat={w.latitude ?? DEFAULT_LAT}
                lng={w.longitude ?? DEFAULT_LNG}
                onPick={(lat, lng) => {
                  setValue("latitude", parseFloat(lat.toFixed(6)));
                  setValue("longitude", parseFloat(lng.toFixed(6)));
                }}
              />
            )}
          />
        </div>

        {/* ── Desktop: fade edge ── */}
        <div className="hidden md:block absolute top-0 bottom-0 left-[580px] w-20 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />

        {/* ── Form panel ── */}
        <form
          onSubmit={form.handleSubmit(onNext as () => void)}
          className="w-full md:absolute md:inset-y-0 md:left-0 md:w-[580px] z-20 bg-white flex flex-col md:shadow-[4px_0_40px_-4px_rgba(0,0,0,0.15)]"
        >
          {/* Top gradient accent bar */}
          <div className="h-1 shrink-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          {/* Nav */}
          <div className="shrink-0 h-13 flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">TutorLMS</span>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip →
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3.5">
            {/* Heading + live preview card */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/60 rounded-2xl p-4 mb-1">
              <div className="flex items-center gap-3">
                {/* Org avatar */}
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
                  <span className="text-sm font-bold text-white">
                    {w.name ? w.name.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {w.name || "Your organization name"}
                  </p>
                  <p className="text-xs text-indigo-500 font-medium mt-0.5">
                    {ORG_TYPES.find((t) => t.value === w.type)?.label ?? "Coaching Institute"}
                    {w.location_text ? ` · ${w.location_text}` : ""}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                {w.description || "Add a description below to tell students about your center."}
              </p>
            </div>

            {/* Center Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Center Name{" "}
                <span className="text-indigo-400 normal-case font-semibold tracking-normal">*</span>
              </label>
              <input
                {...form.register("name")}
                placeholder="Allen Career Institute"
                className={inp}
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Type + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Type
                </label>
                <select {...form.register("type")} className={inp + " cursor-pointer"}>
                  {ORG_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Phone{" "}
                  <span className="text-indigo-400 normal-case font-semibold tracking-normal">
                    *
                  </span>
                </label>
                <input {...form.register("phone")} placeholder="9876543210" className={inp} />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-xs text-red-400">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Description{" "}
                <span className="text-indigo-400 normal-case font-semibold tracking-normal">*</span>
              </label>
              <textarea
                {...form.register("description")}
                rows={2}
                placeholder="A short description of your coaching center..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white transition-all resize-none"
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-xs text-red-400">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Email + Website */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Email{" "}
                  <span className="text-indigo-400 normal-case font-semibold tracking-normal">
                    *
                  </span>
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="admin@center.com"
                  className={inp}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-400">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Website
                </label>
                <input {...form.register("website")} placeholder="https://..." className={inp} />
              </div>
            </div>

            {/* Logo + Cover */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: "logo_url" as const, label: "Logo URL" },
                { field: "cover_image_url" as const, label: "Cover URL" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                    <input
                      {...form.register(field)}
                      placeholder="https://..."
                      className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Location text — with geocoding autocomplete */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Location / City{" "}
                <span className="text-indigo-400 normal-case font-semibold tracking-normal">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400 z-10" />
                <input
                  value={w.location_text ?? ""}
                  onChange={(e) => handleLocationInput(e.target.value)}
                  onBlur={() => setTimeout(() => setGeoOpen(false), 150)}
                  onFocus={() => geoResults.length > 0 && setGeoOpen(true)}
                  placeholder="Type a city or address..."
                  autoComplete="off"
                  className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white transition-all"
                />
              </div>
              {form.formState.errors.location_text && (
                <p className="mt-1 text-xs text-red-400">
                  {form.formState.errors.location_text.message}
                </p>
              )}

              {/* Dropdown */}
              {geoOpen && geoResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden">
                  {geoResults.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={() => selectGeoResult(r)}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-indigo-50 transition-colors text-left group"
                    >
                      <MapPin className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0 group-hover:text-indigo-600" />
                      <span className="text-sm text-slate-700 leading-snug line-clamp-1 group-hover:text-slate-900">
                        {r.display_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile: inline map + use my location */}
            <div className="md:hidden space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Pin on Map
                </p>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <LocateFixed className="h-3.5 w-3.5" /> Use my location
                </button>
              </div>
              <div
                className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                style={{ height: 200 }}
              >
                <Controller
                  control={control}
                  name="latitude"
                  render={() => (
                    <LocationMapPicker
                      lat={w.latitude ?? DEFAULT_LAT}
                      lng={w.longitude ?? DEFAULT_LNG}
                      onPick={(lat, lng) => {
                        setValue("latitude", parseFloat(lat.toFixed(6)));
                        setValue("longitude", parseFloat(lng.toFixed(6)));
                      }}
                    />
                  )}
                />
              </div>
              {/* Mobile coordinates */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Lat", value: w.latitude ?? DEFAULT_LAT, field: "latitude" as const },
                  { label: "Lng", value: w.longitude ?? DEFAULT_LNG, field: "longitude" as const },
                ].map(({ label, value, field }) => (
                  <div
                    key={field}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
                  >
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">
                      {label}
                    </p>
                    <input
                      type="number"
                      step="any"
                      value={value}
                      onChange={(e) => setValue(field, parseFloat(e.target.value))}
                      className="w-full bg-transparent text-xs font-mono font-bold text-slate-700 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance radius */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-violet-50/40 border border-indigo-100/50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs font-bold text-slate-700">Attendance radius</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Geo-fence for attendance marking
                </p>
              </div>
              <div className="flex items-center gap-2">
                {w.attendance_radius_enabled && (
                  <>
                    <input
                      type="number"
                      {...form.register("attendance_radius_meters", { valueAsNumber: true })}
                      min={50}
                      max={5000}
                      className="w-14 h-7 rounded-lg border border-indigo-200 bg-white px-2 text-xs text-center text-indigo-700 font-semibold focus:outline-none focus:border-indigo-400 transition-all"
                    />
                    <span className="text-xs text-slate-400 font-medium">m</span>
                  </>
                )}
                <Controller
                  control={control}
                  name="attendance_radius_enabled"
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                        field.value ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                          field.value ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  )}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Continue to Review <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* ── Floating: Use my location (desktop only) ── */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="hidden md:flex absolute bottom-6 right-6 z-10 items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all"
        >
          <LocateFixed className="h-4 w-4" />
          Use my location
        </button>

        {/* ── Floating: Coordinates pill (desktop only) ── */}
        <div className="hidden md:flex absolute top-4 right-4 z-10 items-center gap-0 bg-white/95 backdrop-blur-md border border-white/80 shadow-xl shadow-black/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 text-center">
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Lat</p>
            <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
              {(w.latitude ?? DEFAULT_LAT).toFixed(4)}
            </p>
          </div>
          <div className="w-px h-9 bg-slate-100" />
          <div className="px-4 py-2.5 text-center">
            <p className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Lng</p>
            <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
              {(w.longitude ?? DEFAULT_LNG).toFixed(4)}
            </p>
          </div>
        </div>

        {/* ── Floating: Map hint (desktop only) ── */}
        <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 ml-[290px] z-10 pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/70 rounded-full px-4 py-2 shadow-lg shadow-black/8">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">
              Click anywhere to pin your center
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     STEP 1 — Review
  ══════════════════════════════════════════ */
  if (step === 1) {
    const reviewRows = [
      { label: "Center Name", value: w.name },
      { label: "Type", value: ORG_TYPES.find((t) => t.value === w.type)?.label },
      { label: "Description", value: w.description },
      { label: "Email", value: w.email },
      { label: "Phone", value: w.phone },
      ...(w.website ? [{ label: "Website", value: w.website }] : []),
      { label: "Location", value: w.location_text },
      { label: "Coordinates", value: `${w.latitude?.toFixed(5)}, ${w.longitude?.toFixed(5)}` },
      {
        label: "Attendance Radius",
        value: w.attendance_radius_enabled ? `${w.attendance_radius_meters} m` : "Disabled",
      },
    ];

    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">TutorLMS</span>
          </div>
          {/* Breadcrumb — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Center Details</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-semibold text-indigo-600">Review</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-400">Done</span>
          </div>
          {/* Mobile: step badge */}
          <div className="sm:hidden">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1">
              Step 2 of 2
            </span>
          </div>
          <div className="hidden sm:block w-24" />
        </header>

        <div className="flex-1 px-4 md:px-8 py-6 md:py-0 md:flex md:items-center md:justify-center">
          <div className="w-full max-w-lg">
            <div className="mb-5">
              <h1 className="text-xl font-extrabold text-slate-900 mb-1">Confirm your details</h1>
              <p className="text-sm text-slate-500">
                Everything look right? Submit to send for review.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
              {reviewRows.map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className={`flex flex-col sm:flex-row sm:justify-between px-4 md:px-5 py-3 gap-0.5 sm:gap-4 ${
                    i < arr.length - 1 ? "border-b border-slate-50" : ""
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-400 sm:w-32 shrink-0">
                    {label}
                  </span>
                  <span className="text-sm text-slate-800 font-medium sm:text-right break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pb-6 md:pb-0">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1.5 h-11 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={submitRequest}
                disabled={submitting}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Building2 className="h-4 w-4" />
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     STEP 2 — Done
  ══════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-xl shadow-emerald-500/30 mb-6">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">You&apos;re in the queue!</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Request submitted for{" "}
          <span className="font-semibold text-slate-700">{submittedName}</span>.
        </p>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4 mb-8 text-left">
          <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Approved within 24 hours</p>
            <p className="text-xs text-amber-600 mt-0.5 break-all">
              Confirmation going to <span className="font-semibold">{submittedEmail}</span>
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
        >
          Go to Sign In <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
