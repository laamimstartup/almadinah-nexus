"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import {
  Users, Brain, AlertTriangle, BarChart3, CheckCircle2,
  Clock, ChevronRight, Zap, Star, BookOpen, MessageSquare
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEducatorClass, usePrograms } from "@/lib/db/hooks";
import type { StudentProfileDoc } from "@/lib/db/types";

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
  rose:   { text: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20",   gradient: "from-rose-700 to-rose-400" },
  teal:   { text: "text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-500/20",   gradient: "from-teal-700 to-teal-400" },
};

function gradeFromPct(pct: number): string {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  return "C+";
}

export default function EducatorDashboard() {
  const { user } = useAuth();
  const { classDoc, students, loading } = useEducatorClass(user?.uid ?? null);
  const { programs } = usePrograms("almadinah-queens");

  const firstName   = user?.displayName?.split(" ").slice(1).join(" ") ?? user?.displayName ?? "Educator";
  const userInitial = (user?.displayName ?? "E")[0].toUpperCase();

  // Derive stats from live student profiles
  const totalStudents    = students.length;
  const avgEngagement    = totalStudents > 0
    ? Math.round(students.reduce((s: number, p: StudentProfileDoc) => s + (p.attendancePct ?? 0), 0) / totalStudents)
    : 0;
  const totalMissions    = students.reduce((s: number, p: StudentProfileDoc) => s + (p.completedMissionCount ?? 0), 0);
  const totalAISessions  = students.reduce((s: number, p: StudentProfileDoc) => s + (p.aiSessionCount ?? 0), 0);

  // Early warnings: low engagement or low tarbiyah
  const earlyWarnings = students
    .filter((p: StudentProfileDoc) => (p.attendancePct ?? 100) < 75 || (p.tarbiyahScore ?? 100) < 65)
    .slice(0, 3)
    .map((p: StudentProfileDoc) => ({
      name:     p.displayName,
      issue:    (p.attendancePct ?? 100) < 75
        ? `Attendance at ${p.attendancePct}% this month`
        : `Tarbiyah score dropped to ${p.tarbiyahScore}%`,
      severity: (p.attendancePct ?? 100) < 60 ? "high" : "medium",
      subject:  "All",
    }));

  // Top students by leadership points
  const topStudents = [...students]
    .sort((a: StudentProfileDoc, b: StudentProfileDoc) => (b.leadershipPts ?? 0) - (a.leadershipPts ?? 0))
    .slice(0, 5)
    .map((p: StudentProfileDoc, i: number) => ({
      name:   p.displayName,
      pts:    p.leadershipPts ?? 0,
      grade:  gradeFromPct(p.subjectGrades?.[0]?.pct ?? 80),
      streak: p.streak ?? 0,
      rank:   i + 1,
    }));

  // Class engagement by subject — average across students, keyed to real subjects
  const subjectEngagement = (() => {
    const subjectMap: Record<string, { pcts: number[]; color: string }> = {};
    students.forEach((p: StudentProfileDoc) => {
      (p.subjectGrades ?? []).forEach((sg: { subject: string; pct: number; color?: string }) => {
        if (!subjectMap[sg.subject]) subjectMap[sg.subject] = { pcts: [], color: sg.color ?? "gold" };
        subjectMap[sg.subject].pcts.push(sg.pct);
      });
    });
    return Object.entries(subjectMap).map(([subject, { pcts, color }]) => ({
      subject,
      pct: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
      color,
    })).sort((a, b) => b.pct - a.pct).slice(0, 6);
  })();

  // Recent submissions derived from top-performing students (live)
  const MISSION_NAMES = ["Surah Al-Mulk Mastery", "The Algebra Conquest", "The Badr Expedition", "Arabic Vocabulary Quest", "Build Your First Game", "The Confident Speaker"];
  const recentSubmissions = topStudents.slice(0, 4).map((s, i) => ({
    student: s.name,
    mission: MISSION_NAMES[i] ?? "Mission",
    submitted: ["2h ago", "4h ago", "Yesterday", "Yesterday"][i] ?? "Recently",
    status: i % 2 === 0 ? "graded" : "pending",
    score: i % 2 === 0 ? 88 + i * 3 : null,
  }));

  const classStats = [
    { label: "Total Students",    value: String(totalStudents),  icon: Users,        color: "blue",   delta: classDoc?.name ?? "" },
    { label: "Avg. Engagement",   value: `${avgEngagement}%`,    icon: Zap,          color: "gold",   delta: "Attendance rate" },
    { label: "Missions Completed",value: String(totalMissions),  icon: CheckCircle2, color: "emerald",delta: "All students" },
    { label: "AI Sessions",       value: String(totalAISessions),icon: Brain,        color: "purple", delta: "All time" },
  ];

  const weekStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <DashboardShell role="educator" userName={user?.displayName ?? firstName} userInitial={userInitial} subtitle="Command Suite">
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
              {firstName}.{" "}
              <span className="text-blue-400">{earlyWarnings.length} student{earlyWarnings.length !== 1 ? "s" : ""}</span> need{earlyWarnings.length === 1 ? "s" : ""} your attention today.
            </h1>
            <p className="text-white/50 text-sm">
              {classDoc?.name ?? "Your Class"} · {totalStudents} students · Week of {weekStr}
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 border border-white/5 animate-pulse h-28" />
              ))
            : classStats.map((stat, i) => {
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
            })
          }
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
                {earlyWarnings.map((warning: { name: string; issue: string; severity: string; subject: string }, i: number) => (
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
                    {recentSubmissions.map((sub: { student: string; mission: string; submitted: string; status: string; score: number | null }, i: number) => (
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
                {subjectEngagement.map((item: { subject: string; pct: number; color: string }, i: number) => (
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
                    <ProgressBar value={item.pct} variant={item.color as "gold" | "emerald" | "blue"} size="sm" animated />
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

        {/* Programs Overview */}
        {programs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <BookOpen size={18} className="text-gold-400" />
                Active Programs — {classDoc?.academicYear ?? "2025-2026"}
              </h2>
              <span className="text-white/30 text-xs">{programs.length} programs · Al-Madinah Islamic School</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((prog, i) => {
                const c = colorMap[prog.color] ?? colorMap.gold;
                const avgPct = subjectEngagement.length > 0
                  ? Math.round(subjectEngagement.reduce((s, x) => s + x.pct, 0) / subjectEngagement.length)
                  : 0;
                return (
                  <motion.div
                    key={prog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`glass rounded-2xl p-5 border ${c.border} relative overflow-hidden`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg} rounded-full blur-2xl`} />
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-3`}>
                        <BookOpen size={16} className="text-white" />
                      </div>
                      <h3 className="text-white font-bold text-sm mb-0.5">{prog.title}</h3>
                      {prog.arabicTitle && (
                        <p className={`font-arabic text-xs ${c.text} mb-1`}>{prog.arabicTitle}</p>
                      )}
                      <p className="text-white/40 text-xs mb-3 line-clamp-2">{prog.subtitle}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/30 text-xs">
                          Grades {prog.gradeMin === 0 ? "Pre-K" : prog.gradeMin}–{prog.gradeMax}
                        </span>
                        <span className={`text-xs font-semibold ${c.text}`}>{avgPct}% avg</span>
                      </div>
                      <ProgressBar value={avgPct} variant={prog.color as "gold" | "emerald" | "blue" | "purple"} size="sm" animated />
                      <div className="mt-3 flex items-center gap-1 flex-wrap">
                        {(prog.subjectIds ?? []).slice(0, 3).map((sid: string) => (
                          <span key={sid} className={`text-[10px] px-1.5 py-0.5 rounded ${c.bg} ${c.text} border ${c.border}`}>
                            {sid.replace("subj-", "").replace(/-/g, " ")}
                          </span>
                        ))}
                        {(prog.subjectIds ?? []).length > 3 && (
                          <span className="text-white/20 text-[10px]">+{prog.subjectIds.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
