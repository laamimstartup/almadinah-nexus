"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAuth } from "@/lib/auth-context";
import { useAllStudents, useAllClasses } from "@/lib/db/hooks";
import { GraduationCap, Search, Filter, AlertTriangle, Star, TrendingUp } from "lucide-react";

const SCHOOL_ID = "almadinah-queens";
const ACADEMIC_YEAR = "2025-2026";

function gradeFromPct(pct: number): string {
  if (pct >= 97) return "A+"; if (pct >= 93) return "A"; if (pct >= 90) return "A-";
  if (pct >= 87) return "B+"; if (pct >= 83) return "B"; if (pct >= 80) return "B-";
  if (pct >= 77) return "C+"; return "C";
}

export default function AdminStudentsPage() {
  const { user } = useAuth();
  const { students, loading } = useAllStudents(SCHOOL_ID);
  const { classes } = useAllClasses(SCHOOL_ID, ACADEMIC_YEAR);

  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));
  const gradeOptions = ["all", ...Array.from(new Set(students.map((s) => s.grade))).sort()];

  const filtered = students.filter((s) => {
    const matchSearch = !search || s.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (s.studentId ?? "").toLowerCase().includes(search.toLowerCase());
    const matchGrade  = filterGrade === "all" || s.grade === filterGrade;
    const matchStatus = filterStatus === "all"
      || (filterStatus === "atrisk" && ((s.attendancePct ?? 100) < 75 || (s.tarbiyahScore ?? 100) < 60))
      || (filterStatus === "top"    && (s.leadershipPts ?? 0) > 700);
    return matchSearch && matchGrade && matchStatus;
  });

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Students">
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <GraduationCap size={22} className="text-blue-400" />
              Student Roster
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{students.length} students · {ACADEMIC_YEAR}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 border border-white/5 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-white/30" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            >
              {gradeOptions.map((g) => <option key={g} value={g} className="bg-nexus-surface">{g === "all" ? "All Grades" : `Grade ${g}`}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            >
              <option value="all" className="bg-nexus-surface">All Students</option>
              <option value="atrisk" className="bg-nexus-surface">⚠️ At-Risk</option>
              <option value="top" className="bg-nexus-surface">⭐ Top Performers</option>
            </select>
          </div>
          <span className="text-white/30 text-sm ml-auto">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Student</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Grade</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Class</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Attendance</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Leadership</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Avg. Grade</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td colSpan={7} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                      </tr>
                    ))
                  : filtered.map((s, i) => {
                      const avgPct = s.subjectGrades?.length
                        ? Math.round(s.subjectGrades.reduce((acc, g) => acc + g.pct, 0) / s.subjectGrades.length)
                        : 0;
                      const isAtRisk = (s.attendancePct ?? 100) < 75 || (s.tarbiyahScore ?? 100) < 60;
                      const isTop = (s.leadershipPts ?? 0) > 700;
                      return (
                        <motion.tr
                          key={s.uid}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {s.displayName?.charAt(0)}
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium">{s.displayName}</div>
                                {s.studentId && <div className="text-white/30 text-[10px]">{s.studentId}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-white/60 text-sm">Gr. {s.grade}</td>
                          <td className="px-4 py-3.5 text-white/60 text-xs">{classMap[s.classId] ?? s.className}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${(s.attendancePct ?? 0) < 75 ? "text-red-400" : "text-emerald-400"}`}>{s.attendancePct ?? 0}%</span>
                              <ProgressBar value={s.attendancePct ?? 0} variant={(s.attendancePct ?? 0) < 75 ? "rose" : "emerald"} size="sm" animated className="w-16" />
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-gold-400 text-sm font-semibold">{s.leadershipPts ?? 0}</span>
                            <span className="text-white/30 text-xs ml-1">pts</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant={avgPct >= 90 ? "emerald" : avgPct >= 80 ? "gold" : "purple"}>
                              {gradeFromPct(avgPct)} ({avgPct}%)
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5">
                            {isAtRisk ? (
                              <span className="flex items-center gap-1 text-gold-400 text-xs font-medium">
                                <AlertTriangle size={12} /> At-Risk
                              </span>
                            ) : isTop ? (
                              <span className="flex items-center gap-1 text-gold-400 text-xs font-medium">
                                <Star size={12} /> Top
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                                <TrendingUp size={12} /> Active
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })
                }
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-white/20 text-sm">
                      No students found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
