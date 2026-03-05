"use client";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "emerald" | "blue" | "purple" | "red" | "ghost";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "gold", size = "sm", className }: BadgeProps) {
  const variants = {
    gold:    "bg-gold-500/15 text-gold-400 border border-gold-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    blue:    "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    purple:  "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    red:     "bg-red-500/15 text-red-400 border border-red-500/30",
    ghost:   "bg-white/5 text-white/60 border border-white/10",
  };
  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full font-medium", variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
