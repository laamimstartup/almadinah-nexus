"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Heart, Flame, CheckCircle2, Circle, Plus, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStudentProfile, useTodayTarbiyah, toggleTarbiyahTask, ensureTodayTarbiyah } from "@/lib/db/hooks";
import { useEffect } from "react";
import type { TarbiyahDayDoc } from "@/lib/db/types";

const CATEGORY_META: Record<string, { title: string; arabic: string; icon: string; color: string; badges: { label: string; desc: string }[] }> = {
  prayer:    { title: "Salah & Worship",       arabic: "الصَّلاة",   icon: "🕌", color: "gold",   badges: [{ label: "Fajr Champion", desc: "Prayed Fajr 7 days in a row" }, { label: "Night Warrior", desc: "Prayed Qiyam al-Layl 3 times" }, { label: "Masjid Regular", desc: "Visit masjid 10 times" }] },
  character: { title: "Character & Akhlaq",    arabic: "الأَخْلاق", icon: "💚", color: "emerald", badges: [{ label: "Kindness Star", desc: "3 acts of kindness logged" }, { label: "Gentle Speaker", desc: "30 days of kind speech" }, { label: "Forgiver", desc: "Forgave a classmate" }] },
  community: { title: "Community Leadership",  arabic: "الْخِدْمَة", icon: "🤝", color: "blue",    badges: [{ label: "Volunteer", desc: "Completed 2 community service hours" }, { label: "Class Leader", desc: "Lead 3 class projects" }, { label: "Mentor", desc: "Help 5 younger students" }] },
  knowledge: { title: "Knowledge & Growth",    arabic: "الْعِلْم",   icon: "📖", color: "purple",  badges: [{ label: "Quran Memorizer", desc: "Memorized Surah Al-Mulk" }, { label: "Arabic Reader", desc: "Read 10 pages of Arabic text" }, { label: "Islamic Scholar", desc: "Complete all Islamic Studies missions" }] },
};

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",    bg: "bg-gold-500/10",    border: "border-gold-500/20",    gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20",  gradient: "from-purple-700 to-purple-400" },
};

const DEFAULT_TARBIYAH_TEMPLATE: TarbiyahDayDoc = {
  studentUid: "",
  date: "",
  totalPoints: 0,
  totalMax: 160,
  overallPct: 0,
  createdAt: {} as TarbiyahDayDoc["createdAt"],
  updatedAt: {} as TarbiyahDayDoc["updatedAt"],
  categories: [
    { id: "prayer",    pointsEarned: 0, tasks: [{ task: "Fajr Prayer", done: false }, { task: "Dhuhr Prayer", done: false }, { task: "Asr Prayer", done: false }, { task: "Maghrib Prayer", done: false }, { task: "Isha Prayer", done: false }] },
    { id: "character", pointsEarned: 0, tasks: [{ task: "Daily Dhikr (33x Subhanallah)", done: false }, { task: "Act of Kindness", done: false }, { task: "Help a classmate", done: false }, { task: "Avoid backbiting", done: false }] },
    { id: "community", pointsEarned: 0, tasks: [{ task: "Help set up classroom", done: false }, { task: "Check on a struggling classmate", done: false }, { task: "Community service log", done: false }] },
    { id: "knowledge", pointsEarned: 0, tasks: [{ task: "Quran recitation (1 page)", done: false }, { task: "Islamic Studies reading", done: false }, { task: "Arabic vocabulary practice", done: false }, { task: "Read a Hadith", done: false }] },
  ],
};

export default function TarbiyahPage() {
  const { user } = useAuth();
  const { profile } = useStudentProfile(user?.uid ?? null);
  const { tarbiyah, loading } = useTodayTarbiyah(user?.uid ?? null);

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const firstName   = profile?.displayName?.split(" ")[0] ?? "Student";
  const userInitial = firstName[0]?.toUpperCase() ?? "S";

  // Ensure today's doc exists
  useEffect(() => {
    if (!user?.uid || tarbiyah || loading) return;
    ensureTodayTarbiyah(user.uid, { ...DEFAULT_TARBIYAH_TEMPLATE, studentUid: user.uid });
  }, [user?.uid, tarbiyah, loading]);

  const categories = tarbiyah?.categories ?? DEFAULT_TARBIYAH_TEMPLATE.categories;
  const totalPoints = tarbiyah?.totalPoints ?? 0;
  const totalMax    = tarbiyah?.totalMax    ?? DEFAULT_TARBIYAH_TEMPLATE.totalMax;
  const overallPct  = tarbiyah?.overallPct  ?? 0;

  const handleToggle = async (categoryId: string, taskIndex: number) => {
    if (!user?.uid || !tarbiyah) return;
    await toggleTarbiyahTask(user.uid, categoryId, taskIndex, tarbiyah);
  };

  return (
    <DashboardShell role="student" userName={profile?.displayName ?? firstName} userInitial={userInitial} subtitle="Tarbiyah Tracker">
      <div className="p-4 lg:p-8 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart size={18} className="text-emerald-400" />
                <h1 className="font-display text-2xl font-bold text-white">Tarbiyah Tracker</h1>
              </div>
              <p className="text-white/50 text-sm max-w-md">
                Character development is the foundation of true leadership.
                Track your spiritual and personal growth every day.
              </p>
              <div className="font-arabic text-lg text-emerald-400/60 mt-2">
                إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلاق
              </div>
              <p className="text-white/25 text-xs italic mt-1">
                &ldquo;I was sent to perfect good character.&rdquo; — Prophet Muhammad ﷺ
              </p>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">{overallPct}%</div>
                <div className="text-white/40 text-xs">Today&apos;s Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold-400">{profile?.streak ?? 0}🔥</div>
                <div className="text-white/40 text-xs">Day Streak</div>
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            <ProgressBar value={totalPoints} max={totalMax || 1} variant="emerald" showLabel animated />
          </div>
        </motion.div>

        {/* Daily Check-in overview */}
        <div className="glass rounded-2xl p-6 border border-gold-500/15">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <Flame size={18} className="text-gold-400" />
            Today&apos;s Check-In
            <Badge variant="gold">{today}</Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat.id];
              if (!meta) return null;
              const c = colorMap[meta.color];
              const doneTasks = cat.tasks.filter((t) => t.done).length;
              return (
                <div key={cat.id} className={`rounded-xl p-4 border ${c.border} ${c.bg}`}>
                  <div className="text-2xl mb-2">{meta.icon}</div>
                  <div className={`font-semibold text-sm ${c.text} mb-1`}>{meta.title}</div>
                  <div className="text-white/40 text-xs mb-3">{doneTasks}/{cat.tasks.length} tasks</div>
                  <ProgressBar value={doneTasks} max={cat.tasks.length || 1} variant={meta.color as "gold" | "emerald" | "blue"} size="sm" animated />
                </div>
              );
            })}
          </div>
        </div>

        {/* Category detail cards */}
        <div className="space-y-6">
          {categories.map((cat, catIdx) => {
            const meta = CATEGORY_META[cat.id];
            if (!meta) return null;
            const c = colorMap[meta.color];
            const doneTasks = cat.tasks.filter((t) => t.done).length;
            const maxPts    = cat.tasks.length * 10;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className={`glass rounded-2xl border ${c.border} overflow-hidden`}
              >
                <div className={`px-6 py-4 border-b ${c.border} ${c.bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{meta.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{meta.title}</h3>
                      <span className={`font-arabic text-sm ${c.text}`}>{meta.arabic}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${c.text}`}>{cat.pointsEarned}</div>
                    <div className="text-white/30 text-xs">/ {maxPts} pts</div>
                  </div>
                </div>

                <div className="p-6 grid sm:grid-cols-2 gap-6">
                  {/* Daily Tasks — interactive */}
                  <div>
                    <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">
                      Daily Tasks
                    </h4>
                    <div className="space-y-2.5">
                      {cat.tasks.map((task, ti) => (
                        <motion.div
                          key={task.task}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * ti }}
                          className="flex items-center gap-3 group cursor-pointer"
                          onClick={() => handleToggle(cat.id, ti)}
                        >
                          {task.done ? (
                            <CheckCircle2 size={17} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle size={17} className="text-white/20 flex-shrink-0 group-hover:text-white/40 transition-colors" />
                          )}
                          <span className={`text-sm ${task.done ? "text-white/40 line-through" : "text-white/70"}`}>
                            {task.task}
                          </span>
                          {!task.done && (
                            <Plus size={13} className="text-white/20 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">
                      Leadership Badges
                    </h4>
                    <div className="space-y-2">
                      {meta.badges.map((badge, bi) => {
                        const earned = bi === 0 && doneTasks >= Math.ceil(cat.tasks.length * 0.7);
                        return (
                          <motion.div
                            key={badge.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * bi }}
                            className={`flex items-center gap-3 p-2.5 rounded-xl ${earned ? `${c.bg} border ${c.border}` : "border border-white/5"}`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${earned ? `bg-gradient-to-br ${c.gradient}` : "bg-white/5"}`}>
                              <Trophy size={14} className={earned ? "text-white" : "text-white/20"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-semibold ${earned ? "text-white" : "text-white/30"}`}>
                                {badge.label}
                              </div>
                              <div className="text-white/30 text-[10px] truncate">{badge.desc}</div>
                            </div>
                            {earned && <Badge variant={meta.color as "gold" | "emerald" | "blue" | "purple"}>Earned</Badge>}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <ProgressBar value={doneTasks} max={cat.tasks.length || 1} variant={meta.color as "gold" | "emerald" | "blue"} showLabel label={`${meta.title} Progress`} animated />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
