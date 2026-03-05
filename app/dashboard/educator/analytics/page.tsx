"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import { BarChart3, TrendingUp, Users, Zap, AlertTriangle } from "lucide-react";

const classPerformance = [
  { class: "Grade 7A", avgGrade: 91, engagement: 94, missions: 47, at_risk: 0 },
  { class: "Grade 7B", avgGrade: 84, engagement: 82, missions: 38, at_risk: 2 },
  { class: "Grade 7C", avgGrade: 88, engagement: 87, missions: 41, at_risk: 1 },
];

const weeklyEngagement = [
  { week: "W1 Jan", pct: 78 }, { week: "W2 Jan", pct: 82 }, { week: "W3 Jan", pct: 75 },
  { week: "W4 Jan", pct: 85 }, { week: "W1 Feb", pct: 88 }, { week: "W2 Feb", pct: 84 },
  { week: "W3 Feb", pct: 90 }, { week: "W4 Feb", pct: 87 }, { week: "W1 Mar", pct: 92 },
];
const maxPct = Math.max(...weeklyEngagement.map((w) => w.pct));

const subjectBreakdown = [
  { subject: "Islamic Studies", avg: 91, color: "gold" as const },
  { subject: "Mathematics",     avg: 84, color: "emerald" as const },
  { subject: "Quiz Completion", avg: 88, color: "blue" as const },
  { subject: "Homework Rate",   avg: 79, color: "gold" as const },
  { subject: "Mission XP/Week", avg: 86, color: "emerald" as const },
];

export default function AnalyticsPage() {
  return (
    <DashboardShell role="educator" userName="Ustadh Yusuf" userInitial="Y" subtitle="Analytics">
      <div className="p-4 lg:p-8 space-y-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-blue-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <h1 className="relative font-display text-2xl font-bold text-white mb-1">
            Class <span className="text-blue-400">Analytics</span>
          </h1>
          <p className="relative text-white/50 text-sm">Performance data across all 3 classes · Week of March 5, 2026</p>
        </motion.div>

        {/* Class comparison */}
        <div>
          <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <Users size={18} className="text-blue-400" />
            Class Comparison
          </h2>
          <div className="glass rounded-2xl border border-nexus-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-nexus-border">
                  {["Class", "Avg. Grade", "Engagement", "Missions Done", "At Risk"].map((h) => (
                    <th key={h} className="text-left text-white/30 text-xs font-medium px-5 py-3 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-nexus-border">
                {classPerformance.map((cls, i) => (
                  <motion.tr key={cls.class} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 text-white font-semibold text-sm">{cls.class}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-gold-400 font-bold text-sm w-8">{cls.avgGrade}%</span>
                        <div className="w-20 hidden sm:block"><ProgressBar value={cls.avgGrade} variant="gold" size="sm" animated /></div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold text-sm w-8">{cls.engagement}%</span>
                        <div className="w-20 hidden sm:block"><ProgressBar value={cls.engagement} variant="emerald" size="sm" animated /></div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/60 text-sm">{cls.missions}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold ${cls.at_risk > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {cls.at_risk > 0 ? <span className="flex items-center gap-1"><AlertTriangle size={13} /> {cls.at_risk}</span> : "✓ None"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly engagement chart */}
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-gold-400" />
              Weekly Engagement Trend
            </h2>
            <div className="glass rounded-2xl p-5 border border-gold-500/10">
              <div className="flex items-end gap-2 h-36">
                {weeklyEngagement.map((w, i) => (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(w.pct / maxPct) * 112}px` }}
                      transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }}
                      className="w-full rounded-t-md bg-gradient-to-t from-gold-600 to-gold-400"
                      style={{ minHeight: "4px" }}
                    />
                    <span className="text-white/25 text-[9px]">{w.week.split(" ")[0]}</span>
                    <span className="text-gold-400 text-[9px] font-bold">{w.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject breakdown */}
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-blue-400" />
              Performance by Area
            </h2>
            <div className="glass rounded-2xl p-5 border border-blue-500/10 space-y-4">
              {subjectBreakdown.map((item, i) => (
                <motion.div key={item.subject} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white/60 text-sm">{item.subject}</span>
                    <span className={`font-bold text-sm ${item.color === "gold" ? "text-gold-400" : item.color === "emerald" ? "text-emerald-400" : "text-blue-400"}`}>{item.avg}%</span>
                  </div>
                  <ProgressBar value={item.avg} variant={item.color} size="sm" animated />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
