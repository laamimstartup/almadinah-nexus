"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "emerald" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  variant = "gold",
  size = "md",
  children,
  icon,
  iconPosition = "right",
  className,
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    gold: "bg-gradient-to-r from-gold-600 to-gold-400 text-nexus-bg shadow-gold-glow hover:shadow-gold-glow hover:brightness-110",
    emerald: "bg-gradient-to-r from-emerald-700 to-emerald-500 text-white shadow-emerald-glow hover:brightness-110",
    ghost: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
    outline: "bg-transparent text-gold-400 border border-gold-500/40 hover:bg-gold-500/10 hover:border-gold-500/80",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(base, sizes[size], variants[variant], className)}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      {icon && iconPosition === "left" && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === "right" && <span className="relative z-10">{icon}</span>}
    </motion.button>
  );
}
