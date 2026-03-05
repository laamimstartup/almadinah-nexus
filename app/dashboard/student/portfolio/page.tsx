"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import {
  Trophy, Star, Heart, BookOpen, Code, Mic2,
  Download, Share2, ExternalLink, Award, TrendingUp, Globe
} from "lucide-react";

const portfolioData = {
  student: "Ahmed Al-Rashid",
  grade: "Grade 7",
  gpa: "3.8",
  year: "2025–2026",
  leadershipPts: 847,
  tarbiyahScore: 92,
  missionsCompleted: 24,
};

const academicAchievements = [
  { subject: "Quran & Tajweed", grade: "A", pct: 94, note: "Memorized Surah Al-Mulk with full Tajweed" },
  { subject: "Mathematics", grade: "B+", pct: 87, note: "Completed Algebra I curriculum" },
  { subject: "English Language Arts", grade: "A-", pct: 91, note: "Published 2 essays in school journal" },
  { subject: "Islamic Studies", grade: "A", pct: 96, note: "Led Tafsir study circle" },
  { subject: "Arabic Language", grade: "B", pct: 82, note: "Conversational proficiency achieved" },
  { subject: "Science", grade: "B+", pct: 85, note: "Science Fair: 2nd place, plant biology project" },
];

const projects = [
  {
    title: "Islamic Geometry Art Installation",
    subject: "Arts & STEM",
    description: "Designed a digital mashrabiya pattern using Processing code, exploring the mathematics of Islamic geometric art.",
    date: "January 2026",
    skills: ["Coding", "Geometry", "Islamic Art"],
    color: "gold",
    icon: Code,
  },
  {
    title: "Community Iftar Organizer",
    subject: "Leadership",
    description: "Organized the school's annual Iftar dinner, coordinating 15 volunteers and serving 200+ community members.",
    date: "March 2025",
    skills: ["Event Planning", "Leadership", "Community Service"],
    color: "emerald",
    icon: Globe,
  },
  {
    title: "The Science of Salah",
    subject: "STEM + Islamic Studies",
    description: "Research paper exploring the physical and mental health benefits of the five daily prayers using peer-reviewed studies.",
    date: "November 2025",
    skills: ["Research", "Writing", "Islamic Studies"],
    color: "blue",
    icon: BookOpen,
  },
  {
    title: "Public Speaking: Muslim Youth Summit",
    subject: "Leadership",
    description: "Delivered a 10-minute speech on 'Leadership Lessons from the Seerah' at the NYC Muslim Youth Summit.",
    date: "October 2025",
    skills: ["Public Speaking", "Islamic History", "Leadership"],
    color: "purple",
    icon: Mic2,
  },
];

const tarbiyahHighlights = [
  { badge: "Prayer Streak Champion", icon: "🕌", desc: "7-day consecutive Fajr prayer streak", earned: true },
  { badge: "Acts of Kindness Star", icon: "💚", desc: "Logged 12+ acts of kindness this semester", earned: true },
  { badge: "Community Leader", icon: "🤝", desc: "Volunteered 20+ hours in community service", earned: true },
  { badge: "Quran Memorizer", icon: "📖", desc: "Memorized 3 new Surahs this year", earned: true },
  { badge: "Knowledge Seeker", icon: "⭐", desc: "Completed all Islamic Studies bonus missions", earned: true },
  { badge: "Night Warrior", icon: "🌙", desc: "Prayed Qiyam al-Layl 3 times", earned: false },
];

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
};

export default function PortfolioPage() {
  return (
    <DashboardShell role="student" userName="Ahmed Al-Rashid" userInitial="A" subtitle="Leader's Portfolio">
      <div className="p-4 lg:p-8 space-y-8">

        {/* Portfolio Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl border border-gold-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px]" />

          <div className="relative p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center text-4xl font-bold text-nexus-bg shadow-gold-glow">
                    A
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-400 border-2 border-nexus-card flex items-center justify-center">
                    <Trophy size={13} className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-gold-400/60 text-xs font-semibold uppercase tracking-widest mb-1">
                    Leader&apos;s Portfolio · {portfolioData.year}
                  </div>
                  <h1 className="font-display text-3xl font-bold text-white">{portfolioData.student}</h1>
                  <p className="text-white/50 text-sm mt-1">
                    {portfolioData.grade} · Al-Madinah School, Queens NYC · NYS Certified
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="glass border border-white/10 rounded-xl px-4 py-2.5 text-white/60 text-sm flex items-center gap-2 hover:text-white hover:border-white/20 transition-all">
                  <Share2 size={15} /> Share
                </button>
                <button className="bg-gradient-to-r from-gold-600 to-gold-400 rounded-xl px-4 py-2.5 text-nexus-bg text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition-all shadow-gold-glow">
                  <Download size={15} /> Export PDF
                </button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Cumulative GPA", value: portfolioData.gpa, color: "gold", icon: "📊" },
                { label: "Leadership Points", value: portfolioData.leadershipPts.toString(), color: "emerald", icon: "⭐" },
                { label: "Tarbiyah Score", value: `${portfolioData.tarbiyahScore}%`, color: "blue", icon: "💚" },
                { label: "Missions Complete", value: portfolioData.missionsCompleted.toString(), color: "purple", icon: "🎯" },
              ].map((stat) => {
                const c = colorMap[stat.color];
                return (
                  <div key={stat.label} className={`glass rounded-xl p-4 border ${c.border} text-center`}>
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-2xl font-bold ${c.text}`}>{stat.value}</div>
                    <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Quote */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="font-arabic text-xl text-gold-400/60 text-center mb-1">
                إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلاً أَن يُتْقِنَهُ
              </div>
              <p className="text-white/25 text-xs text-center italic">
                "Indeed Allah loves that when one of you does a deed, he perfects it." — Prophet Muhammad ﷺ
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Academic Achievements — left 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-gold-400" />
                Academic Achievements
              </h2>
              <div className="glass rounded-2xl border border-nexus-border overflow-hidden">
                <div className="divide-y divide-nexus-border">
                  {academicAchievements.map((item, i) => (
                    <motion.div
                      key={item.subject}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors"
                    >
                      <div className="text-center w-10 flex-shrink-0">
                        <span className="text-gold-400 font-bold text-lg">{item.grade}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm">{item.subject}</div>
                        <div className="text-white/40 text-xs mt-0.5 truncate">{item.note}</div>
                        <ProgressBar value={item.pct} variant="gold" size="sm" className="mt-2" animated />
                      </div>
                      <div className="text-white/30 text-xs flex-shrink-0">{item.pct}%</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Star size={18} className="text-gold-400" />
                Projects & Accomplishments
              </h2>
              <div className="space-y-4">
                {projects.map((project, i) => {
                  const Icon = project.icon;
                  const c = colorMap[project.color];
                  return (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className={`glass rounded-xl p-5 border ${c.border} relative overflow-hidden group cursor-pointer`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 ${c.bg} rounded-full blur-2xl opacity-40`} />
                      <div className="relative flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-white font-semibold text-sm">{project.title}</h3>
                            <ExternalLink size={13} className="text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0 mt-0.5" />
                          </div>
                          <Badge variant={project.color as "gold" | "emerald" | "blue" | "purple"} className="mb-2">{project.subject}</Badge>
                          <p className="text-white/50 text-xs leading-relaxed mb-3">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1.5">
                              {project.skills.map((skill) => (
                                <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <span className="text-white/20 text-xs flex-shrink-0">{project.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 2 cols — Tarbiyah badges + skills */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tarbiyah Highlights */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Heart size={18} className="text-emerald-400" />
                Character Badges
              </h2>
              <div className="space-y-3">
                {tarbiyahHighlights.map((badge, i) => (
                  <motion.div
                    key={badge.badge}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`glass rounded-xl p-3.5 border flex items-center gap-3 ${
                      badge.earned
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-white/5 opacity-50"
                    }`}
                  >
                    <div className="text-2xl flex-shrink-0">{badge.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold ${badge.earned ? "text-white" : "text-white/40"}`}>
                        {badge.badge}
                      </div>
                      <div className="text-white/30 text-xs truncate">{badge.desc}</div>
                    </div>
                    {badge.earned && (
                      <Award size={16} className="text-emerald-400 flex-shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Skills radar */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Award size={18} className="text-gold-400" />
                Core Competencies
              </h2>
              <div className="glass rounded-2xl p-5 border border-gold-500/10 space-y-3">
                {[
                  { skill: "Islamic Knowledge", pct: 94, color: "gold" as const },
                  { skill: "Critical Thinking",  pct: 85, color: "emerald" as const },
                  { skill: "Leadership",          pct: 88, color: "blue" as const },
                  { skill: "Arabic Proficiency",  pct: 75, color: "gold" as const },
                  { skill: "STEM Skills",          pct: 82, color: "emerald" as const },
                  { skill: "Communication",        pct: 90, color: "blue" as const },
                  { skill: "Character (Tarbiyah)", pct: 92, color: "gold" as const },
                ].map((item, i) => (
                  <motion.div
                    key={item.skill}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60 text-xs">{item.skill}</span>
                      <span className={`text-xs font-semibold ${colorMap[item.color].text}`}>{item.pct}%</span>
                    </div>
                    <ProgressBar value={item.pct} variant={item.color} size="sm" animated />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* University readiness */}
            <div className="glass rounded-2xl p-5 border border-gold-500/20 bg-gold-500/5">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
                <Trophy size={15} className="text-gold-400" />
                University Readiness Score
              </h3>
              <div className="text-5xl font-bold text-gold-gradient mb-2 text-center py-2">89%</div>
              <ProgressBar value={89} variant="gold" animated />
              <p className="text-white/40 text-xs mt-3 text-center">
                On track for top university admission by Grade 12
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
