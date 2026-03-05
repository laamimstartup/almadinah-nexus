"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gold?: boolean;
  emerald?: boolean;
  delay?: number;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  hover = true,
  gold = false,
  emerald = false,
  delay = 0,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={cn(
        "glass rounded-2xl p-6 relative overflow-hidden",
        gold && "border-gold-500/20 shadow-gold-glow/20",
        emerald && "border-emerald-500/20 shadow-emerald-glow/20",
        hover && "cursor-pointer",
        className
      )}
    >
      {gold && (
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
      )}
      {emerald && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}
