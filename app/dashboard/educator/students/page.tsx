"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Search, AlertTriangle, Star, TrendingUp, Heart, ChevronRight } from "lucide-react";

const students = [
  { name: "Ahmed Al-Rashid",  class: "7A", grade: "A",  pts: 847, tarbiyah: 92, engagement: 94, status: "excellent",  streak: 7  },
  { name: "Maryam Siddiqui",  class: "7A", grade: "A-", pts: 790, tarbiyah: 88, engagement: 91, status: "excellent",  streak: 5  },
  { name: "Ibrahim Khalid",   class: "7B", grade: "B+", pts: 724, tarbiyah: 80, engagement: 85, status: "good",       streak: 4  },
  { name: "Fatima Osman",     class: "7A", grade: "B+", pts: 698, tarbiyah: 85, engagement: 88, status: "good",       streak: 6  },
  { name: "Zaid Rahman",      class: "7C", grade: "B",  pts: 652, tarbiyah: 75, engagement: 79, status: "good",       streak: 3  },
  { name: "Aisha Noor",       class: "7B", grade: "B",  pts: 610, tarbiyah: 78, engagement: 80, status: "good",       streak: 4  },
  { name: "Omar Hassan",      class: "7B", grade: "C+", pts: 430, tarbiyah: 60, engagement: 52, status: "at_risk",    streak: 1  },
  { name: "Layla Karim",      class: "7A", grade: "B-", pts: 540, tarbiyah: 70, engagement: 65, status: "watch",      streak: 2  },
  { name: "Yusuf Siddiq",     class: "7C", grade: "C",  pts: 380, tarbiyah: 55, engagement: 48, status: "at_risk",    streak: 0  },
  { name: "Nour Al-Hassan",   class: "7C", grade: "B",  pts: 620, tarbiyah: 82, engagement: 81, status: "good",       streak: 5  },
];

const statusConfig = {
  excellent: { label: "Excellent",  color: "emerald" as const, bg: "bg-emerald-500/10 border-emerald-500/20" },
  good:      { label: "On Track",   color: "gold" as const,    bg: "bg-gold-500/10 border-gold-500/20" },
  watch:     { label: "Watch",      color: "blue" as const,    bg: "bg-blue-500/10 border-blue-500/20" },
  at_risk:   { label: "At Risk",    color: "red" as const,     bg: "bg-red-500/10 border-red-500/20" },
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchClass  = filterClass === "All" || s.class === filterClass;
    return matchSearch && matchClass;
  });

  const excellent = students.filter((s) => s.status === "excellent").length;
  const atRisk    = students.filter((s) => s.status === "at_risk").length;

  return (
    <DashboardShell role="educator" userName="Ustadh Yusuf" userInitial="Y" subtitle="Students">
      <div className="p-4 lg:p-8 space-y-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-blue-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">
                My <span className="text-blue-400">Students</span>
              </h1>
              <p className="text-white/50 text-sm">{students.length} students across 3 classes</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{excellent}</div>
                <div className="text-white/40 text-xs">Excellent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{atRisk}</div>
                <div className="text-white/40 text-xs">At Risk</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students…"
              className="w-full bg-nexus-border/50 border border-nexus-border rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["All", "7A", "7B", "7C"].map((cls) => (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filterClass === cls
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "glass border border-nexus-border text-white/50 hover:text-white"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Students table */}
        <div className="glass rounded-2xl border border-nexus-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-nexus-border">
                {["Student", "Class", "Grade", "Leadership Pts", "Tarbiyah", "Engagement", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-white/30 text-xs font-medium px-4 py-3 uppercase tracking-widest first:pl-5 last:pr-5 hidden sm:table-cell first:table-cell last:table-cell">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border">
              {filtered.map((student, i) => {
                const sc = statusConfig[student.status as keyof typeof statusConfig];
                return (
                  <motion.tr
                    key={student.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="pl-5 pr-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{student.name}</div>
                          {student.streak > 0 && (
                            <div className="text-gold-400 text-xs">{student.streak}🔥 streak</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <Badge variant="ghost">{student.class}</Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-gold-400 font-bold text-sm">{student.grade}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-white/70 text-sm flex items-center gap-1">
                        <Star size={12} className="text-gold-400" />{student.pts}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Heart size={12} className="text-emerald-400" />
                        <div className="w-16">
                          <ProgressBar value={student.tarbiyah} variant="emerald" size="sm" animated />
                        </div>
                        <span className="text-emerald-400 text-xs">{student.tarbiyah}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={12} className="text-blue-400" />
                        <div className="w-16">
                          <ProgressBar value={student.engagement} variant="blue" size="sm" animated />
                        </div>
                        <span className="text-blue-400 text-xs">{student.engagement}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg}`}>
                        {student.status === "at_risk" && <AlertTriangle size={11} />}
                        {sc.label}
                      </span>
                    </td>
                    <td className="pr-5 pl-4 py-3.5 text-right">
                      <button className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1 ml-auto transition-colors">
                        View <ChevronRight size={13} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
