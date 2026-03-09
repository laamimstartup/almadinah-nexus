"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import {
  Users, BookOpen, GraduationCap, BarChart3,
  UserPlus, Settings, Star, AlertTriangle,
  ChevronRight, Zap, Shield, Megaphone, CalendarDays
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  useAllStudents, useAllClasses, useAllStaff,
  useEnrollments, useSchool, useAnnouncements, useEvents,
} from "@/lib/db/hooks";

const SCHOOL_ID = "almadinah-queens";
const ACADEMIC_YEAR = "2025-2026";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { school }                    = useSchool(SCHOOL_ID);
  const { students, loading: sLoad }  = useAllStudents(SCHOOL_ID);
  const { classes,  loading: cLoad }  = useAllClasses(SCHOOL_ID, ACADEMIC_YEAR);
  const { staff,    loading: stLoad } = useAllStaff(SCHOOL_ID);
  const { enrollments }               = useEnrollments(SCHOOL_ID, ACADEMIC_YEAR);
  const { announcements }             = useAnnouncements(SCHOOL_ID);
  const { events }                    = useEvents(SCHOOL_ID);

  const loading = sLoad || cLoad || stLoad;

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalStudents   = students.length;
  const totalClasses    = classes.length;
  const totalStaff      = staff.length;
  const totalEducators  = staff.filter((s) => s.role === "educator").length;

  const activeEnrollments = enrollments.filter((e) => e.status === "active").length;
  const pendingEnrollments = enrollments.filter((e) => e.status === "pending").length;

  const avgAttendance = totalStudents > 0
    ? Math.round(students.reduce((s, p) => s + (p.attendancePct ?? 0), 0) / totalStudents)
    : 0;
  const avgTarbiyah = totalStudents > 0
    ? Math.round(students.reduce((s, p) => s + (p.tarbiyahScore ?? 0), 0) / totalStudents)
    : 0;
  const atRisk = students.filter((p) => (p.attendancePct ?? 100) < 75 || (p.tarbiyahScore ?? 100) < 60);

  const topStudents = [...students]
    .sort((a, b) => (b.leadershipPts ?? 0) - (a.leadershipPts ?? 0))
    .slice(0, 5);

  const quickStats = [
    { label: "Total Students",   value: String(totalStudents),   icon: GraduationCap, color: "blue",   sub: `${activeEnrollments} active enrollments` },
    { label: "Classes",          value: String(totalClasses),    icon: BookOpen,      color: "emerald", sub: `${ACADEMIC_YEAR} academic year` },
    { label: "Staff Members",    value: String(totalStaff),      icon: Users,         color: "gold",    sub: `${totalEducators} educators` },
    { label: "Avg. Attendance",  value: `${avgAttendance}%`,     icon: Zap,           color: "purple",  sub: "School-wide rate" },
  ];

  const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
    gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
    emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
    blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
  };

  const weekStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Overview">
      <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">{weekStr}</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white">
              Administration <span className="text-purple-400">Control</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {school?.name ?? "Al-Madinah Islamic School"} — {ACADEMIC_YEAR}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pendingEnrollments > 0 && (
              <Link href="/dashboard/admin/enrollment" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium hover:bg-gold-500/20 transition-all">
                <AlertTriangle size={15} />
                {pendingEnrollments} Pending
              </Link>
            )}
            <Link href="/dashboard/admin/enrollment" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-all">
              <UserPlus size={15} />
              Enroll Student
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            const c = colorMap[stat.color];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`glass rounded-2xl p-5 border ${c.border} relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${c.bg} rounded-full blur-2xl`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-3`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className={`text-2xl font-display font-bold ${c.text} mb-0.5`}>
                    {loading ? "—" : stat.value}
                  </div>
                  <div className="text-white/60 text-xs font-medium">{stat.label}</div>
                  <div className="text-white/25 text-[10px] mt-1">{stat.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* School Health */}
        <div className="glass rounded-2xl p-5 border border-purple-500/10">
          <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <BarChart3 size={15} className="text-purple-400" />
            School Health Overview
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Avg. Attendance",    value: avgAttendance,  color: "blue" as const,   icon: "📅" },
              { label: "Avg. Tarbiyah Score",value: avgTarbiyah,    color: "gold" as const,   icon: "🌙" },
              { label: "Active Enrollments", value: Math.round((activeEnrollments / Math.max(totalStudents, 1)) * 100), color: "emerald" as const, icon: "✅" },
              { label: "At-Risk Students",   value: Math.round((atRisk.length / Math.max(totalStudents, 1)) * 100), color: "purple" as const,  icon: "⚠️" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-white/50 text-xs flex items-center gap-1">{item.icon} {item.label}</span>
                  <span className={`text-xs font-bold ${colorMap[item.color].text}`}>{item.value}%</span>
                </div>
                <ProgressBar value={item.value} variant={item.color} size="sm" animated />
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Classes list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-400" />
                Classes — {ACADEMIC_YEAR}
              </h2>
              <Link href="/dashboard/admin/classes" className="text-white/40 text-xs hover:text-white transition-all flex items-center gap-1">
                Manage all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="space-y-2">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass rounded-xl h-16 animate-pulse border border-white/5" />
                  ))
                : classes.slice(0, 8).map((cls, i) => {
                    const studentCount = cls.studentUids?.length ?? 0;
                    const capacity = cls.maxStudents ?? 20;
                    const fillPct = Math.round((studentCount / capacity) * 100);
                    return (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-xl px-4 py-3 border border-white/5 flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">{cls.grade}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium truncate">{cls.name}</span>
                            <span className="text-white/40 text-xs ml-2 flex-shrink-0">{studentCount}/{capacity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ProgressBar value={fillPct} variant="emerald" size="sm" animated className="flex-1" />
                            <span className="text-white/30 text-[10px] flex-shrink-0 truncate max-w-[100px]">{cls.leadEducatorName}</span>
                          </div>
                        </div>
                        <Link href={`/dashboard/admin/classes`} className="text-white/20 hover:text-white transition-all">
                          <ChevronRight size={15} />
                        </Link>
                      </motion.div>
                    );
                  })
              }
              {classes.length === 0 && !loading && (
                <div className="glass rounded-xl p-8 border border-dashed border-white/10 text-center">
                  <BookOpen size={24} className="text-white/20 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">No classes created yet</p>
                  <Link href="/dashboard/admin/classes" className="text-emerald-400 text-xs mt-2 inline-block hover:underline">Create first class →</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* At-Risk Alerts */}
            {atRisk.length > 0 && (
              <div>
                <h2 className="text-white font-semibold text-base flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-gold-400" />
                  At-Risk Students
                  <Badge variant="gold">{atRisk.length}</Badge>
                </h2>
                <div className="space-y-2">
                  {atRisk.slice(0, 4).map((s, i) => (
                    <motion.div
                      key={s.uid}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="glass rounded-xl px-3 py-2.5 border border-gold-500/10 flex items-center gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold flex-shrink-0">
                        {s.displayName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-medium truncate">{s.displayName}</div>
                        <div className="text-gold-400 text-[10px]">
                          {(s.attendancePct ?? 100) < 75 ? `Attendance ${s.attendancePct}%` : `Tarbiyah ${s.tarbiyahScore}%`}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Performers */}
            <div>
              <h2 className="text-white font-semibold text-base flex items-center gap-2 mb-3">
                <Star size={16} className="text-gold-400" />
                Top Students
              </h2>
              <div className="space-y-2">
                {topStudents.map((s, i) => (
                  <div key={s.uid} className="glass rounded-xl px-3 py-2.5 border border-white/5 flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 text-center ${i === 0 ? "text-gold-400" : i === 1 ? "text-white/50" : "text-white/25"}`}>#{i + 1}</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {s.displayName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-medium truncate">{s.displayName}</div>
                      <div className="text-white/30 text-[10px]">{s.leadershipPts ?? 0} pts</div>
                    </div>
                  </div>
                ))}
                {topStudents.length === 0 && !loading && (
                  <div className="text-white/20 text-xs text-center py-4">No student data yet</div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            {events.length > 0 && (
              <div>
                <h2 className="text-white font-semibold text-base flex items-center gap-2 mb-3">
                  <CalendarDays size={16} className="text-blue-400" />
                  Upcoming Events
                </h2>
                <div className="space-y-2">
                  {events.slice(0, 3).map((ev) => (
                    <div key={ev.id} className="glass rounded-xl px-3 py-2.5 border border-blue-500/10">
                      <div className="text-white text-xs font-medium">{ev.title}</div>
                      <div className="text-white/30 text-[10px] mt-0.5">
                        {ev.startDate?.toDate?.()?.toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? "TBD"}
                        {ev.location ? ` · ${ev.location}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <h2 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "New Class",       href: "/dashboard/admin/classes",      icon: BookOpen,    color: "emerald" },
                  { label: "Enroll",          href: "/dashboard/admin/enrollment",   icon: UserPlus,    color: "blue" },
                  { label: "Announce",        href: "/dashboard/admin/announcements",icon: Megaphone,   color: "gold" },
                  { label: "Settings",        href: "/dashboard/admin/settings",     icon: Settings,    color: "purple" },
                ].map((action) => {
                  const Icon = action.icon;
                  const c = colorMap[action.color];
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`glass rounded-xl p-3 border ${c.border} flex flex-col items-center gap-2 hover:${c.bg} transition-all group`}
                    >
                      <Icon size={18} className={`${c.text} group-hover:scale-110 transition-transform`} />
                      <span className="text-white/60 text-[11px] font-medium">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <Megaphone size={18} className="text-gold-400" />
                Recent Announcements
              </h2>
              <Link href="/dashboard/admin/announcements" className="text-white/40 text-xs hover:text-white flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.slice(0, 3).map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl p-4 border border-gold-500/10"
                >
                  {ann.isPinned && <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider mb-2 block">📌 Pinned</span>}
                  <h3 className="text-white font-semibold text-sm mb-1">{ann.title}</h3>
                  <p className="text-white/40 text-xs line-clamp-2">{ann.body}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-white/20 text-[10px]">{ann.authorName}</span>
                    <span className="text-white/10">·</span>
                    <span className="text-white/20 text-[10px]">
                      {ann.createdAt?.toDate?.()?.toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? ""}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
