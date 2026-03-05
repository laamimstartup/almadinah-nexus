"use client";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Globe, Star, Code, Palette, Mic2, Heart } from "lucide-react";

const programs = [
  {
    icon: BookOpen,
    title: "NYS Core Curriculum",
    description: "ELA, Mathematics, Science & Social Studies — fully aligned with New York State standards.",
    badge: "Foundation",
    color: "gold",
  },
  {
    icon: Star,
    title: "Quran & Islamic Studies",
    description: "Daily Quran recitation, Tajweed, Islamic history, Fiqh, and Aqeedah.",
    badge: "Faith",
    color: "emerald",
  },
  {
    icon: Globe,
    title: "Arabic Language",
    description: "From foundational literacy to conversational and classical Arabic proficiency.",
    badge: "Language",
    color: "blue",
  },
  {
    icon: Code,
    title: "STEM + KidsCodeGift",
    description: "Hands-on labs, coding, robotics, and technology integrated throughout.",
    badge: "Innovation",
    color: "purple",
  },
  {
    icon: Mic2,
    title: "Leadership Development",
    description: "Public speaking, project management, and ethical leadership rooted in Islamic principles.",
    badge: "Leadership",
    color: "gold",
  },
  {
    icon: Palette,
    title: "Arts & Enrichment",
    description: "Visual arts, Islamic calligraphy, PE, and cultural appreciation programs.",
    badge: "Enrichment",
    color: "emerald",
  },
];

const colorMap: Record<string, { badge: string; icon: string; border: string }> = {
  gold:   { badge: "text-gold-400 bg-gold-500/10 border-gold-500/20",   icon: "from-gold-600 to-gold-400",     border: "border-gold-500/10" },
  emerald:{ badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: "from-emerald-700 to-emerald-400", border: "border-emerald-500/10" },
  blue:   { badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",   icon: "from-blue-700 to-blue-400",     border: "border-blue-500/10" },
  purple: { badge: "text-purple-400 bg-purple-500/10 border-purple-500/20", icon: "from-purple-700 to-purple-400", border: "border-purple-500/10" },
};

export default function ProgramsSection() {
  return (
    <section id="programs" className="relative py-24 bg-nexus-bg overflow-hidden">
      <div className="absolute inset-0 mashrabiya-overlay opacity-20" />

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6"
            >
              <Heart size={14} className="text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Programs That Shape Futures</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
            >
              A Curriculum Built
              <br />
              <span className="text-gold-gradient">for Two Worlds.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed mb-8"
            >
              At Al-Madinah, we don&apos;t ask students to choose between deen and duniya. 
              Our curriculum is engineered to master both — producing students who are 
              academically elite and spiritually grounded.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { label: "Subjects", value: "12+" },
                { label: "Grade Levels", value: "PK-9" },
                { label: "NYS Approved", value: "✓" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 text-center border border-gold-500/10">
                  <div className="text-2xl font-bold text-gold-400">{stat.value}</div>
                  <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Programs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programs.map((prog, i) => {
              const Icon = prog.icon;
              const c = colorMap[prog.color];
              return (
                <motion.div
                  key={prog.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className={`glass rounded-2xl p-5 border ${c.border} group`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.icon} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border mt-1 ${c.badge}`}>
                      {prog.badge}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{prog.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{prog.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
