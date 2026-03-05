"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import { TrendingUp, Star, CheckCircle2, Clock } from "lucide-react";

const weeklyProgress = [
  { subject: "Quran & Tajweed",   grade: "A",  pct: 94, change: "+2%", missions: 3, color: "gold" as const },
  { subject: "Mathematics",       grade: "B+", pct: 87, change: "+5%", missions: 2, color: "emerald" as const },
  { subject: "Islamic Studies",   grade: "A",  pct: 96, change: "+1%", missions: 2, color: "gold" as const },
  { subject: "English Language",  grade: "A-", pct: 91, change: "+3%", missions: 1, color: "blue" as const },
  { subject: "Arabic Language",   grade: "B",  pct: 82, change: "0%",  missions: 1, color: "blue" as const },
  { subject: "Science",           grade: "B+", pct: 85, change: "+2%", missions: 2, color: "emerald" as const },
];

const recentMissions = [
  { title: "The Algebra Conquest",    subject: "Math",    status: "In Progress", pct: 65,  dueIn: "2 days" },
  { title: "The Badr Expedition",     subject: "History", status: "In Progress", pct: 40,  dueIn: "4 days" },
  { title: "Shakespeare's Code",      subject: "ELA",     status: "In Progress", pct: 80,  dueIn: "1 day" },
  { title: "The Quran Recitation",    subject: "Quran",   status: "Completed",   pct: 100, dueIn: "Done" },
  { title: "The Photosynthesis Lab",  subject: "Science", status: "Completed",   pct: 100, dueIn: "Done" },
];

export default function ProgressPage() {
  return (
    <DashboardShell role="parent" userName="Sister Fatima" userInitial="F" subtitle="Progress Feed">
      <div className="p-4 lg:p-8 space-y-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-emerald-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <h1 className="relative font-display text-2xl font-bold text-white mb-1">
            Ahmed&apos;s <span className="text-emerald-gradient">Progress Feed</span>
          </h1>
          <p className="relative text-white/50 text-sm">Live academic performance — updated in real time</p>
        </motion.div>

        {/* Subject Cards */}
        <div>
          <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-400" />
            Subject Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyProgress.map((item, i) => (
              <motion.div
                key={item.subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-5 border border-white/5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{item.subject}</h3>
                    <span className={`text-xs ${item.change.startsWith("+") ? "text-emerald-400" : "text-white/40"}`}>
                      {item.change} this week
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gold-400">{item.grade}</span>
                </div>
                <ProgressBar value={item.pct} variant={item.color} showLabel animated />
                <div className="mt-3 text-white/30 text-xs flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  {item.missions} missions this week
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission progress */}
        <div>
          <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <Star size={18} className="text-gold-400" />
            Current Missions
          </h2>
          <div className="glass rounded-2xl border border-nexus-border overflow-hidden">
            <div className="divide-y divide-nexus-border">
              {recentMissions.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">{m.title}</div>
                    <div className="text-white/40 text-xs">{m.subject}</div>
                  </div>
                  <div className="w-32 hidden sm:block">
                    <ProgressBar value={m.pct} variant={m.pct === 100 ? "emerald" : "gold"} size="sm" animated />
                  </div>
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    m.status === "Completed"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-gold-500/15 text-gold-400"
                  }`}>{m.status}</div>
                  {m.status !== "Completed" && (
                    <span className="text-white/30 text-xs flex items-center gap-1 hidden md:flex">
                      <Clock size={11} /> {m.dueIn}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
