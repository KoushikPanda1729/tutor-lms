import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn("rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm", className)}
    >
      <div className="flex items-start sm:items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-tight">{title}</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.value >= 0 ? "text-green-600" : "text-red-500"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-2 sm:p-3 shrink-0", iconBg)}>
          <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
