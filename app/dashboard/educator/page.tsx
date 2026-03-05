"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import {
  Users, Brain, AlertTriangle, BarChart3, CheckCircle2,
  Clock, ChevronRight, Zap, Star, BookOpen, MessageSquare
} from "lucide-react";

const classStats = [
  { label: "Total Students", value: "28", icon: Users, color: "blue", delta: "+2 this month" },
  { label: "Avg. Engagement", value: "87%", icon: Zap, color: "gold", delta: "+5% vs last week" },
  { label: "Missions Completed", value: "143", icon: CheckCircle2, color: "emerald", delta: "This week" },
  { label: "AI Assist Sessions", value: "34", icon: Brain, color: "purple", delta: "This week" },
];

const earlyWarnings = [
  { name: "Omar Hassan", grade: "7B", issue: "Engagement dropped 40% this week", severity: "high", subject: "Math" },
  { name: "Layla Karim", grade: "7A", issue: "3 missed assignments in Arabic", severity: "medium", subject: "Arabic" },
  { name: "Yusuf Siddiq", grade: "7C", issue: "Attendance below 85% this month", severity: "medium", subject: "All" },
];

const topStudents = [
  { name: "Ahmed Al-Rashid", pts: 847, grade: "A", streak: 7, rank: 1 },
  { name: "Maryam Siddiqui", pts: 790, grade: "A-", streak: 5, rank: 2 },
  { name: "Ibrahim Khalid",  pts: 724, grade: "B+", streak: 4, rank: 3 },
  { name: "Fatima Osman",    pts: 698, grade: "B+", streak: 6, rank: 4 },
  { name: "Zaid Rahman",     pts: 652, grade: "B",  streak: 3, rank: 5 },
];

const recentSubmissions = [
  { student: "Ahmed Al-Rashid", mission: "The Algebra Conquest", submitted: "2h ago", status: "graded", score: 95 },
  { student: "Maryam Siddiqui", mission: "Shakespeare's Code",   submitted: "4h ago", status: "pending", score: null },
  { student: "Ibrahim Khalid",  mission: "The Badr Expedition",  submitted: "Yesterday", status: "pending", score: null },
  { student: "Fatima Osman",    mission: "The Algebra Conquest",  submitted: "Yesterday", status: "graded", score: 88 },
];

const classEngagement = [
  { subject: "Quran & Islamic Studies", pct: 94, color: "gold" as const },
  { subject: "Mathematics",             pct: 78, color: "emerald" as const },
  { subject: "Arabic Language",         pct: 72, color: "blue" as const },
  { subject: "English Language Arts",   pct: 85, color: "gold" as const },
  { subject: "Science",                 pct: 80, color: "emerald" as const },
];

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
};

export default function EducatorDashboard() {
  return (
    <DashboardShell role="educator" userName="Ustadh Yusuf" userInitial="Y" subtitle="Command Suite">
      <div className="p-4 lg:p-8 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-blue-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-white/40 text-sm mb-1">Bismillah,</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              Ustadh Yusuf.{" "}
              <span className="text-blue-400">2 students</span> need your attention today.
            </h1>
            <p className="text-white/50 text-sm">
              Grade 7 · Islamic Studies & Mathematics · 28 students · Week of March 5, 2026
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {classStats.map((stat, i) => {
            const Icon = stat.icon;
            const c = colorMap[stat.color];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`glass rounded-2xl p-5 border ${c.border}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-3`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className={`text-2xl font-bold ${c.text} mb-0.5`}>{stat.value}</div>
                <div className="text-white/60 text-xs font-medium">{stat.label}</div>
                <div className="text-white/30 text-xs mt-1">{stat.delta}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Early Warning + Submissions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Early Warning System */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-gold-400" />
                Early Warning System
                <Badge variant="gold">{earlyWarnings.length} Active</Badge>
              </h2>
              <div className="space-y-3">
                {earlyWarnings.map((warning, i) => (
                  <motion.div
                    key={warning.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className={`glass rounded-xl p-4 border ${warning.severity === "high" ? "border-red-500/30 bg-red-500/5" : "border-gold-500/20 bg-gold-500/5"} flex items-start gap-4`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${warning.severity === "high" ? "bg-gradient-to-br from-red-600 to-red-400" : "bg-gradient-to-br from-gold-600 to-gold-400"}`}>
                      {warning.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">{warning.name}</span>
                        <Badge variant={warning.severity === "high" ? "red" : "gold"}>
                          {warning.severity === "high" ? "High" : "Medium"}
                        </Badge>
                        <Badge variant="ghost">{warning.subject}</Badge>
                      </div>
                      <p className="text-white/50 text-sm">{warning.issue}</p>
                    </div>
                    <button className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1 flex-shrink-0 transition-colors">
                      <MessageSquare size={13} /> Contact
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Submissions */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-blue-400" />
                Recent Submissions
                <span className="text-white/30 text-sm font-normal">— AI grading available</span>
              </h2>
              <div className="glass rounded-2xl border border-nexus-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-nexus-border">
                      <th className="text-left text-white/30 text-xs font-medium px-5 py-3 uppercase tracking-widest">Student</th>
                      <th className="text-left text-white/30 text-xs font-medium px-5 py-3 uppercase tracking-widest hidden sm:table-cell">Mission</th>
                      <th className="text-left text-white/30 text-xs font-medium px-5 py-3 uppercase tracking-widest hidden md:table-cell">Time</th>
                      <th className="text-left text-white/30 text-xs font-medium px-5 py-3 uppercase tracking-widest">Status</th>
                      <th className="text-right text-white/30 text-xs font-medium px-5 py-3 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nexus-border">
                    {recentSubmissions.map((sub, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="hover:bg-white/2 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {sub.student.charAt(0)}
                            </div>
                            <span className="text-white/80 text-sm">{sub.student}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className="text-white/50 text-sm">{sub.mission}</span>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className="text-white/30 text-xs flex items-center gap-1">
                            <Clock size={11} /> {sub.submitted}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {sub.status === "graded" ? (
                            <Badge variant="emerald">Graded · {sub.score}</Badge>
                          ) : (
                            <Badge variant="gold">Pending</Badge>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1 ml-auto transition-colors">
                            {sub.status === "pending" ? (
                              <><Brain size={13} /> AI Grade</>
                            ) : (
                              <><ChevronRight size={13} /> Review</>
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Class Engagement */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-blue-400" />
                Class Engagement
              </h2>
              <div className="glass rounded-2xl p-5 border border-blue-500/10 space-y-4">
                {classEngagement.map((item, i) => (
                  <motion.div
                    key={item.subject}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white/60 text-xs">{item.subject}</span>
                      <span className={`font-semibold text-xs ${colorMap[item.color].text}`}>{item.pct}%</span>
                    </div>
                    <ProgressBar value={item.pct} variant={item.color} size="sm" animated />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Students Leaderboard */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Star size={18} className="text-gold-400" />
                Leadership Board
              </h2>
              <div className="space-y-2">
                {topStudents.map((student, i) => (
                  <motion.div
                    key={student.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="glass rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3"
                  >
                    <span className={`text-sm font-bold w-6 text-center ${i === 0 ? "text-gold-400" : i === 1 ? "text-white/60" : i === 2 ? "text-orange-400" : "text-white/30"}`}>
                      #{student.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{student.name}</div>
                      <div className="text-white/30 text-xs">{student.pts} pts · {student.streak}🔥</div>
                    </div>
                    <Badge variant={student.grade.startsWith("A") ? "emerald" : "gold"}>{student.grade}</Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Assistant shortcut */}
            <div className="glass rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                  <Brain size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Grading Assistant</h3>
                  <p className="text-white/40 text-xs">2 submissions ready to auto-grade</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-purple-500 text-white text-sm font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                <Brain size={15} />
                Run AI Grading
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
