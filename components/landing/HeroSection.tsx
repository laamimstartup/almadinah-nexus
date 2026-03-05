"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, Zap, Shield, Globe } from "lucide-react";
import Button from "@/components/ui/Button";

const floatingStats = [
  { label: "Students", value: "500+", icon: Star, color: "gold" },
  { label: "AI-Powered", value: "24/7", icon: Zap, color: "emerald" },
  { label: "NYS Approved", value: "✓", icon: Shield, color: "blue" },
  { label: "Global Reach", value: "NYC", icon: Globe, color: "purple" },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-nexus-bg"
    >
      {/* Animated background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06091A] via-nexus-bg to-nexus-bg" />

        {/* Gold ambient glow - top left */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
        {/* Emerald ambient glow - bottom right */}
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
        {/* Blue accent - center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/3 rounded-full blur-[150px]" />

        {/* Mashrabiya pattern overlay */}
        <div className="absolute inset-0 mashrabiya-overlay opacity-40" />

        {/* Constellation dots */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: i % 3 === 0 ? "#C9A84C" : i % 3 === 1 ? "#10b981" : "#ffffff",
              opacity: Math.random() * 0.6 + 0.2,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-gold-500/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70 text-sm font-medium">
              Introducing the Al-Madinah Nexus Platform
            </span>
            <span className="text-gold-400 text-xs font-semibold bg-gold-500/10 px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight tracking-tight mb-6"
          >
            <span className="text-white">We Don&apos;t Just</span>
            <br />
            <span className="text-gold-gradient">Educate.</span>
            <br />
            <span className="text-white">We Build </span>
            <span className="text-emerald-gradient">Leaders.</span>
          </motion.h1>

          {/* Arabic tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-arabic text-2xl text-gold-400/70 mb-4"
          >
            النَّخْبَة · الْقِيَادَة · الإِبْتِكَار
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/60 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10"
          >
            The first <span className="text-gold-400 font-semibold">Leadership Intelligence Platform</span> for
            Islamic education. AI-powered learning, real-time transparency, and character development — all in one
            immersive ecosystem.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/login">
              <Button variant="gold" size="lg" icon={<ArrowRight size={20} />}>
                Enter the Nexus
              </Button>
            </Link>
            <Link href="/#platform">
              <Button variant="ghost" size="lg">
                Explore the Platform
              </Button>
            </Link>
          </motion.div>

          {/* Floating stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {floatingStats.map((stat, i) => {
              const Icon = stat.icon;
              const colors = {
                gold: "text-gold-400 bg-gold-500/10 border-gold-500/20",
                emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
              } as Record<string, string>;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="glass rounded-xl p-4 flex flex-col items-center gap-2"
                >
                  <div className={`p-2 rounded-lg border ${colors[stat.color]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-20 relative"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gold-500/10 rounded-full blur-xl" />
          <div className="glass rounded-3xl border border-gold-500/10 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-nexus-surface/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4 bg-nexus-border rounded-md px-3 py-1 text-white/30 text-xs text-center">
                nexus.almadinah.edu/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="bg-nexus-bg/90 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-nexus-bg font-bold">
                  A
                </div>
                <div>
                  <p className="text-white/50 text-xs">Welcome back,</p>
                  <p className="text-white font-semibold text-sm">
                    Salam, Ahmed. You are{" "}
                    <span className="text-gold-400">4 steps</span> away from your weekly Leadership Goal.{" "}
                    <span className="text-emerald-400">Ready to lead?</span>
                  </p>
                </div>
              </div>
              {/* Mini cards grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Active Missions", value: "3", color: "gold" },
                  { label: "Leadership Pts", value: "847", color: "emerald" },
                  { label: "Tarbiyah Score", value: "92%", color: "blue" },
                ].map((card) => {
                  const c = {
                    gold: "border-gold-500/20 bg-gold-500/5 text-gold-400",
                    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
                    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
                  } as Record<string, string>;
                  return (
                    <div key={card.label} className={`rounded-xl p-3 border ${c[card.color]}`}>
                      <p className="text-white/40 text-xs mb-1">{card.label}</p>
                      <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-gold-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
