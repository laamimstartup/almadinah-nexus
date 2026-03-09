"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "gold" | "emerald" | "blue" | "purple" | "rose" | "teal";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  variant = "gold",
  size = "md",
  showLabel = false,
  label,
  className,
  animated = true,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  const trackSizes = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  const fills: Record<string, string> = {
    gold:    "from-gold-600 to-gold-400",
    emerald: "from-emerald-700 to-emerald-400",
    blue:    "from-blue-700 to-blue-400",
    purple:  "from-purple-700 to-purple-400",
    rose:    "from-rose-700 to-rose-400",
    teal:    "from-teal-700 to-teal-400",
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs text-white/60">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-gold-400">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-nexus-border rounded-full overflow-hidden", trackSizes[size])}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={cn("h-full rounded-full bg-gradient-to-r", fills[variant])}
        >
          <div className="h-full w-full opacity-50 shimmer-effect" />
        </motion.div>
      </div>
    </div>
  );
}
