"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Star, TrendingUp, Zap, Trophy, Target } from "lucide-react";

const subjects = [
  { subject: "Quran & Tajweed", pct: 88, stars: 8, maxStars: 10, color: "#C9A84C",   variant: "gold" as const,    level: "Advanced",  xp: 880  },
  { subject: "Mathematics",     pct: 72, stars: 6, maxStars: 10, color: "#10b981",   variant: "emerald" as const, level: "Proficient",xp: 720  },
  { subject: "Arabic Language", pct: 65, stars: 5, maxStars: 10, color: "#3b82f6",   variant: "blue" as const,    level: "Developing",xp: 650  },
  { subject: "Science",         pct: 55, stars: 4, maxStars: 10, color: "#a855f7",   variant: "gold" as const,    level: "Developing",xp: 550  },
  { subject: "ELA",             pct: 80, stars: 7, maxStars: 10, color: "#f97316",   variant: "emerald" as const, level: "Proficient",xp: 800  },
  { subject: "Islamic Studies", pct: 94, stars: 9, maxStars: 10, color: "#ec4899",   variant: "blue" as const,    level: "Expert",    xp: 940  },
  { subject: "Leadership",      pct: 70, stars: 6, maxStars: 10, color: "#06b6d4",   variant: "gold" as const,    level: "Proficient",xp: 700  },
  { subject: "Tarbiyah",        pct: 92, stars: 9, maxStars: 10, color: "#84cc16",   variant: "emerald" as const, level: "Expert",    xp: 920  },
];

const milestones = [
  { label: "First Mission Completed",      date: "Sep 2025", earned: true,  icon: "🎯" },
  { label: "5-Day Prayer Streak",          date: "Sep 2025", earned: true,  icon: "🕌" },
  { label: "Quran Surah Memorized",        date: "Oct 2025", earned: true,  icon: "📖" },
  { label: "Leadership Badge Unlocked",    date: "Nov 2025", earned: true,  icon: "⭐" },
  { label: "Top 5% of Grade",             date: "Dec 2025", earned: true,  icon: "🏆" },
  { label: "Community Service: 10 hours", date: "Jan 2026", earned: true,  icon: "🤝" },
  { label: "500 Leadership Points",       date: "Feb 2026", earned: true,  icon: "🌟" },
  { label: "AI Tutor: 10 Sessions",       date: "Feb 2026", earned: true,  icon: "🤖" },
  { label: "Expert Level: Islamic Studies",date: "Mar 2026", earned: true,  icon: "🎓" },
  { label: "1000 Leadership Points",      date: "Upcoming", earned: false, icon: "👑" },
  { label: "Global Exchange Project",     date: "Upcoming", earned: false, icon: "🌍" },
];

const weeklyXP = [
  { week: "W1 Jan", xp: 120 },
  { week: "W2 Jan", xp: 180 },
  { week: "W3 Jan", xp: 95  },
  { week: "W4 Jan", xp: 210 },
  { week: "W1 Feb", xp: 160 },
  { week: "W2 Feb", xp: 230 },
  { week: "W3 Feb", xp: 190 },
  { week: "W4 Feb", xp: 270 },
  { week: "W1 Mar", xp: 240 },
];
const maxXP = Math.max(...weeklyXP.map((w) => w.xp));

export default function GrowthPage() {
  const totalXP = subjects.reduce((s, sub) => s + sub.xp, 0);
  const avgPct  = Math.round(subjects.reduce((s, sub) => s + sub.pct, 0) / subjects.length);

  return (
    <DashboardShell role="student" userName="Ahmed Al-Rashid" userInitial="A" subtitle="Growth Constellation">
      <div className="p-4 lg:p-8 space-y-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-gold-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="absolute inset-0 stars-bg opacity-40" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/8 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} className="text-gold-400" />
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Growth <span className="text-gold-gradient">Constellation</span>
                </h1>
              </div>
              <p className="text-white/50 text-sm max-w-md">
                Watch your constellation grow as you master each subject. Every star lit is a victory.
              </p>
            </div>
            <div className="flex gap-6 flex-shrink-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400">{totalXP.toLocaleString()}</div>
                <div className="text-white/40 text-xs">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{avgPct}%</div>
                <div className="text-white/40 text-xs">Avg. Mastery</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Constellation map */}
        <div className="glass rounded-3xl border border-gold-500/15 p-6 relative overflow-hidden">
          <div className="absolute inset-0 stars-bg opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexus-bg/20 to-nexus-bg/60" />

          <h2 className="relative text-white font-semibold text-lg flex items-center gap-2 mb-6">
            <Star size={18} className="text-gold-400" />
            Subject Constellation
          </h2>

          {/* SVG constellation lines */}
          <div className="relative">
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: 0 }}>
              <line x1="12.5%" y1="30%" x2="37.5%"  y2="50%" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="37.5%" y1="50%" x2="62.5%"  y2="30%" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="62.5%" y1="30%" x2="87.5%"  y2="50%" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="37.5%" y1="50%" x2="62.5%"  y2="70%" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4,4" />
            </svg>

            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6" style={{ zIndex: 1 }}>
              {subjects.map((subj, i) => (
                <motion.div
                  key={subj.subject}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08 * i, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Star orb */}
                  <div className="relative">
                    {/* Outer glow ring */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full blur-md"
                      style={{ background: subj.color, transform: "scale(1.4)" }}
                    />
                    {/* Main orb */}
                    <div
                      className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border border-white/10"
                      style={{
                        background: `radial-gradient(circle, ${subj.color}40 0%, ${subj.color}15 60%, transparent 100%)`,
                        boxShadow: `0 0 20px ${subj.color}40`,
                      }}
                    >
                      {/* Stars */}
                      {[...Array(subj.stars)].map((_, si) => {
                        const angle = (si / subj.stars) * 360;
                        const r = 22;
                        const x = 32 + r * Math.cos((angle * Math.PI) / 180);
                        const y = 32 + r * Math.sin((angle * Math.PI) / 180);
                        return (
                          <motion.div
                            key={si}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i + 0.05 * si }}
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                              background: subj.color,
                              left: `${(x / 64) * 100}%`,
                              top: `${(y / 64) * 100}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        );
                      })}
                      <span className="text-white font-bold text-sm z-10">{subj.pct}%</span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <div className="text-white text-xs font-semibold leading-tight">{subj.subject}</div>
                    <div className="text-xs mt-0.5" style={{ color: subj.color }}>{subj.level}</div>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, si) => (
                        <Star
                          key={si}
                          size={9}
                          className={si < Math.ceil(subj.stars / 2) ? "fill-current" : "opacity-20"}
                          style={{ color: subj.color }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Subject breakdown */}
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-gold-400" />
              Mastery Breakdown
            </h2>
            <div className="glass rounded-2xl p-5 border border-gold-500/10 space-y-4">
              {subjects.map((subj, i) => (
                <motion.div
                  key={subj.subject}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: subj.color }} />
                      <span className="text-white/70 text-sm">{subj.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: subj.color }}>{subj.level}</span>
                      <span className="text-white/40 text-xs">{subj.xp} XP</span>
                    </div>
                  </div>
                  <ProgressBar value={subj.pct} variant={subj.variant} size="sm" animated />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly XP chart + Milestones */}
          <div className="space-y-6">

            {/* Weekly XP Bar chart */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Zap size={18} className="text-gold-400" />
                Weekly XP Earned
              </h2>
              <div className="glass rounded-2xl p-5 border border-gold-500/10">
                <div className="flex items-end gap-2 h-32">
                  {weeklyXP.map((w, i) => {
                    const heightPct = (w.xp / maxXP) * 100;
                    return (
                      <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPct}%` }}
                          transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }}
                          className="w-full rounded-t-md bg-gradient-to-t from-gold-600 to-gold-400 min-h-[4px]"
                          style={{ minHeight: "4px" }}
                        />
                        <span className="text-white/30 text-[9px] text-center leading-tight">{w.week.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Trophy size={18} className="text-gold-400" />
                Milestones
              </h2>
              <div className="glass rounded-2xl p-4 border border-gold-500/10 max-h-64 overflow-y-auto space-y-2">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg ${m.earned ? "bg-gold-500/5" : "opacity-40"}`}
                  >
                    <span className="text-lg flex-shrink-0">{m.icon}</span>
                    <span className={`text-sm flex-1 ${m.earned ? "text-white/80" : "text-white/30"}`}>
                      {m.label}
                    </span>
                    <span className={`text-xs flex-shrink-0 ${m.earned ? "text-gold-400" : "text-white/20"}`}>
                      {m.date}
                    </span>
                    {m.earned && (
                      <Badge variant="gold" size="sm">✓</Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
