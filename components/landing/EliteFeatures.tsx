"use client";
import { motion } from "framer-motion";
import {
  Brain, Star, Globe, Zap, Heart, Compass, Trophy, Users, Shield
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Mualim Tutor",
    description: "GPT-4o powered AI trained on Al-Madinah's curriculum and Islamic values. Available 24/7 to guide, explain, and inspire.",
    tag: "AI-Powered",
    color: "gold",
    size: "large",
  },
  {
    icon: Heart,
    title: "Tarbiyah Tracker",
    description: "Earn Leadership Badges for acts of kindness, prayer consistency, and community service. Gamified spiritual growth.",
    tag: "Character",
    color: "emerald",
    size: "small",
  },
  {
    icon: Globe,
    title: "Global Leadership Exchange",
    description: "Connect with elite schools worldwide for collaborative projects and cultural exchange.",
    tag: "Global",
    color: "blue",
    size: "small",
  },
  {
    icon: Zap,
    title: "Early Warning System",
    description: "AI flags disengagement before grades drop. Proactive interventions that change outcomes.",
    tag: "Analytics",
    color: "purple",
    size: "small",
  },
  {
    icon: Trophy,
    title: "Leader's Portfolio",
    description: "An auto-generated, high-end digital resume tracking grades, projects, service, and Tarbiyah milestones — ready for top universities.",
    tag: "Portfolio",
    color: "gold",
    size: "large",
  },
  {
    icon: Compass,
    title: "Constellation Map",
    description: "Students navigate learning through a living star-map that lights up with each completed mission.",
    tag: "Immersive",
    color: "emerald",
    size: "small",
  },
  {
    icon: Users,
    title: "Parent Pulse",
    description: "Real-time vibe check on your child's day — attendance, mood indicators, and leadership points, all in one live feed.",
    tag: "Transparency",
    color: "blue",
    size: "small",
  },
  {
    icon: Shield,
    title: "NYS Aligned",
    description: "Every mission and curriculum module is fully aligned to NYS Department of Education standards.",
    tag: "Certified",
    color: "purple",
    size: "small",
  },
];

const colorMap: Record<string, { badge: string; icon: string; glow: string; border: string }> = {
  gold: {
    badge: "bg-gold-500/10 text-gold-400 border-gold-500/20",
    icon: "from-gold-600 to-gold-400",
    glow: "bg-gold-500/5",
    border: "border-gold-500/10",
  },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "from-emerald-700 to-emerald-400",
    glow: "bg-emerald-500/5",
    border: "border-emerald-500/10",
  },
  blue: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "from-blue-700 to-blue-400",
    glow: "bg-blue-500/5",
    border: "border-blue-500/10",
  },
  purple: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: "from-purple-700 to-purple-400",
    glow: "bg-purple-500/5",
    border: "border-purple-500/10",
  },
};

export default function EliteFeatures() {
  return (
    <section id="features" className="relative py-24 bg-nexus-surface overflow-hidden">
      <div className="absolute inset-0 mashrabiya-overlay opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Star size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Elite Differentiators</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Features No Other
            <br />
            <span className="text-gold-gradient">NYC School Has.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            We went beyond the playbook of elite institutions to build something that belongs to the future.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const c = colorMap[feature.color];
            const isLarge = feature.size === "large";
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`
                  relative glass rounded-2xl p-6 border ${c.border} overflow-hidden group
                  ${isLarge ? "sm:col-span-2" : ""}
                `}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${c.glow} opacity-50`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.icon} flex items-center justify-center shadow-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.badge}`}>
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="geo-divider mb-8" />
          <p className="font-arabic text-2xl text-gold-400/60 mb-2">
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </p>
          <p className="text-white/30 text-sm italic">
            &ldquo;And whoever fears Allah — He will make for him a way out.&rdquo; — Quran 65:2
          </p>
        </motion.div>
      </div>
    </section>
  );
}
