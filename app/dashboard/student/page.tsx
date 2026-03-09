"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import {
  Target, Star, Brain, Heart, Trophy, TrendingUp,
  BookOpen, Clock, ChevronRight, Zap, CheckCircle2, Circle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStudentProfile, useMissionProgress, toggleWeeklyGoal } from "@/lib/db/hooks";

const SUBJECT_COLORS: Record<string, string> = {
  "Quran & Tajweed":       "#C9A84C",
  "Mathematics":           "#10b981",
  "Arabic Language":       "#3b82f6",
  "English Language Arts": "#f97316",
  "Science":               "#a855f7",
  "Islamic Studies":       "#ec4899",
};

const colorMap: Record<string, { badge: string; icon: string; text: string; border: string }> = {
  gold:   { badge: "bg-gold-500/10 border-gold-500/20",    icon: "from-gold-600 to-gold-400",    text: "text-gold-400",   border: "border-gold-500/20" },
  emerald:{ badge: "bg-emerald-500/10 border-emerald-500/20", icon: "from-emerald-700 to-emerald-400", text: "text-emerald-400", border: "border-emerald-500/20" },
  blue:   { badge: "bg-blue-500/10 border-blue-500/20",    icon: "from-blue-700 to-blue-400",    text: "text-blue-400",   border: "border-blue-500/20" },
  purple: { badge: "bg-purple-500/10 border-purple-500/20", icon: "from-purple-700 to-purple-400", text: "text-purple-400", border: "border-purple-500/20" },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { profile, loading } = useStudentProfile(user?.uid ?? null);
  const { progress: missionProgress } = useMissionProgress(user?.uid ?? null);

  const firstName = profile?.displayName?.split(" ")[0] ?? user?.displayName?.split(" ")[0] ?? "Student";
  const userInitial = firstName[0]?.toUpperCase() ?? "S";

  const weeklyGoals = profile?.weeklyGoals ?? [];
  const completedGoals = weeklyGoals.filter((g) => g.done).length;

  // Active missions from progress docs
  const activeMissions = missionProgress
    .filter((p) => p.status === "active")
    .slice(0, 3);

  // Subject grades for constellation
  const subjectGrades = profile?.subjectGrades ?? [];

  const tarbiyahBadges = [
    { label: "Prayer Streak",    count: profile?.streak ?? 0,              icon: "🕌", color: "gold" },
    { label: "Tarbiyah Score",   count: `${profile?.tarbiyahScore ?? 0}%`, icon: "💚", color: "emerald" },
    { label: "Completed Missions", count: profile?.completedMissionCount ?? 0, icon: "🏆", color: "blue" },
    { label: "AI Sessions",      count: profile?.aiSessionCount ?? 0,      icon: "📖", color: "purple" },
  ];

  const handleToggleGoal = async (goalId: string) => {
    if (!user?.uid || !weeklyGoals.length) return;
    await toggleWeeklyGoal(user.uid, goalId, weeklyGoals);
  };

  if (loading) {
    return (
      <DashboardShell role="student" userName={firstName} userInitial={userInitial} subtitle="Command Center">
        <div className="p-8 flex items-center justify-center h-64">
          <div className="text-white/40 animate-pulse">Loading your dashboard...</div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="student" userName={profile?.displayName ?? firstName} userInitial={userInitial} subtitle="Command Center">
      <div className="p-4 lg:p-8 space-y-8">

        {/* Personalized greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-gold-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/40 text-sm mb-1">Assalamu Alaikum,</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                {firstName}. You are{" "}
                <span className="text-gold-gradient">{weeklyGoals.length - completedGoals} steps</span> away from your weekly goal.
              </h1>
              <p className="text-emerald-400 text-sm font-medium">Ready to lead? 🌟</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400">{profile?.leadershipPts ?? 0}</div>
                <div className="text-white/40 text-xs">Leadership Pts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{profile?.streak ?? 0}🔥</div>
                <div className="text-white/40 text-xs">Day Streak</div>
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span>Weekly Leadership Goal</span>
              <span className="text-gold-400 font-semibold">{completedGoals}/{weeklyGoals.length} complete</span>
            </div>
            <ProgressBar value={completedGoals} max={weeklyGoals.length || 1} variant="gold" animated />
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active Missions",  value: String(profile?.activeMissionCount ?? 0),  icon: Target, color: "gold",   sub: "In progress" },
            { label: "Tarbiyah Score",   value: `${profile?.tarbiyahScore ?? 0}%`,          icon: Heart,  color: "emerald", sub: "Character growth" },
            { label: "Class Rank",       value: `#${profile?.classRank ?? "-"}`,             icon: Trophy, color: "blue",   sub: `${profile?.className ?? ""}` },
            { label: "AI Sessions",      value: String(profile?.aiSessionCount ?? 0),        icon: Brain,  color: "purple", sub: "This month" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const c = colorMap[stat.color];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`glass rounded-2xl p-5 border ${c.badge}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.icon} flex items-center justify-center mb-3`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className={`text-2xl font-bold ${c.text} mb-0.5`}>{stat.value}</div>
                <div className="text-white/60 text-xs font-medium">{stat.label}</div>
                <div className="text-white/30 text-xs mt-1">{stat.sub}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Missions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <Target size={18} className="text-gold-400" />
                Active Missions
              </h2>
              <Link href="/dashboard/student/missions" className="text-gold-400 text-sm flex items-center gap-1 hover:text-gold-300 transition-colors">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {activeMissions.length === 0 && (
              <div className="glass rounded-xl p-8 border border-gold-500/10 text-center text-white/30">
                No active missions right now.
              </div>
            )}

            {activeMissions.map((prog, i) => {
              const col = (prog as unknown as { color?: string }).color ?? "gold";
              const mc = colorMap[col] ?? colorMap.gold;
              const missionData = prog as unknown as { title?: string; subject?: string; xp?: number; dueDate?: { seconds: number } };
              const title   = missionData.title   ?? prog.missionId;
              const subject = missionData.subject ?? "Mission";
              const xp      = missionData.xp      ?? prog.xpEarned;
              return (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className={`glass rounded-xl p-5 border ${mc.border} cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={col as "gold" | "emerald" | "blue" | "purple"}>{subject}</Badge>
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          <Clock size={11} /> {prog.progress}% done
                        </span>
                      </div>
                      <h3 className="text-white font-semibold">{title}</h3>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${mc.text}`}>+{xp} XP</div>
                    </div>
                  </div>
                  <ProgressBar value={prog.progress} variant={col as "gold" | "emerald" | "blue"} showLabel animated />
                </motion.div>
              );
            })}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Weekly Goals */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Zap size={18} className="text-gold-400" />
                Weekly Goals
              </h2>
              <div className="glass rounded-xl p-4 border border-gold-500/10 space-y-3">
                {weeklyGoals.map((goal, i) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleToggleGoal(goal.id)}
                  >
                    {goal.done ? (
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle size={18} className="text-white/20 flex-shrink-0 group-hover:text-white/40 transition-colors" />
                    )}
                    <span className={`text-sm ${goal.done ? "text-white/50 line-through" : "text-white/80"}`}>
                      {goal.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tarbiyah Badges */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Heart size={18} className="text-emerald-400" />
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {tarbiyahBadges.map((badge, i) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="glass rounded-xl p-3 border border-white/5 text-center"
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-white font-bold text-sm">{badge.count}</div>
                    <div className="text-white/40 text-xs">{badge.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Growth Constellation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <Star size={18} className="text-gold-400" />
              Growth Constellation
            </h2>
            <Link href="/dashboard/student/growth" className="text-gold-400 text-sm flex items-center gap-1 hover:text-gold-300 transition-colors">
              Full Map <ChevronRight size={14} />
            </Link>
          </div>
          <div className="glass rounded-2xl p-6 border border-gold-500/10 relative overflow-hidden">
            <div className="absolute inset-0 stars-bg opacity-30" />
            <div className="relative grid grid-cols-3 sm:grid-cols-6 gap-4">
              {subjectGrades.map((subj, i) => {
                const hexColor = SUBJECT_COLORS[subj.subject] ?? "#C9A84C";
                const stars = Math.round((subj.pct / 100) * 10);
                return (
                  <motion.div
                    key={subj.subject}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.08, type: "spring" }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="relative w-14 h-14">
                      <svg viewBox="0 0 56 56" className="w-full h-full">
                        <circle cx="28" cy="28" r="24" fill="none" stroke={hexColor} strokeWidth="1" strokeOpacity="0.2" />
                        <circle cx="28" cy="28" r={8 + (subj.pct / 100) * 16} fill={hexColor} fillOpacity="0.15" />
                        <motion.circle
                          cx="28" cy="28"
                          r={4 + (subj.pct / 100) * 10}
                          fill={hexColor}
                          fillOpacity="0.6"
                          animate={{ r: [4 + (subj.pct / 100) * 10, 4 + (subj.pct / 100) * 10 + 2, 4 + (subj.pct / 100) * 10] }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                        />
                        <text x="28" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                          {stars}★
                        </text>
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-xs font-medium">{subj.subject.split(" ")[0]}</div>
                      <div className="text-xs" style={{ color: hexColor }}>{subj.pct}%</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Ask AI Mualim", icon: Brain, href: "/dashboard/student/mualim", color: "purple" },
            { label: "View Portfolio", icon: Trophy, href: "/dashboard/student/portfolio", color: "gold" },
            { label: "Track Growth",  icon: TrendingUp, href: "/dashboard/student/growth", color: "blue" },
            { label: "My Missions",   icon: BookOpen, href: "/dashboard/student/missions", color: "emerald" },
          ].map((action, i) => {
            const Icon = action.icon;
            const colors: Record<string, string> = {
              gold:   "border-gold-500/20 hover:bg-gold-500/10 hover:border-gold-500/40",
              emerald:"border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40",
              blue:   "border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40",
              purple: "border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40",
            };
            const iconColors: Record<string, string> = {
              gold: "text-gold-400", emerald: "text-emerald-400", blue: "text-blue-400", purple: "text-purple-400"
            };
            return (
              <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <Link href={action.href}
                  className={`glass rounded-xl p-4 border ${colors[action.color]} flex flex-col items-center gap-2 text-center transition-all duration-200 group block`}
                >
                  <Icon size={20} className={iconColors[action.color]} />
                  <span className="text-white/60 group-hover:text-white text-xs font-medium transition-colors">{action.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </DashboardShell>
  );
}
