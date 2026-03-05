"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Heart, Flame, CheckCircle2, Circle, Plus, Trophy } from "lucide-react";

const tarbiyahCategories = [
  {
    id: "prayer",
    title: "Salah & Worship",
    arabic: "الصَّلاة",
    icon: "🕌",
    color: "gold",
    points: 240,
    maxPoints: 300,
    badges: [
      { label: "Fajr Champion", earned: true, desc: "Prayed Fajr 7 days in a row" },
      { label: "Night Warrior", earned: true, desc: "Prayed Qiyam al-Layl 3 times" },
      { label: "Masjid Regular", earned: false, desc: "Visit masjid 10 times" },
    ],
    dailyTasks: [
      { task: "Fajr Prayer", done: true },
      { task: "Dhuhr Prayer", done: true },
      { task: "Asr Prayer", done: true },
      { task: "Maghrib Prayer", done: false },
      { task: "Isha Prayer", done: false },
    ],
  },
  {
    id: "character",
    title: "Character & Akhlaq",
    arabic: "الأَخْلاق",
    icon: "💚",
    color: "emerald",
    points: 180,
    maxPoints: 250,
    badges: [
      { label: "Kindness Star", earned: true, desc: "3 acts of kindness logged" },
      { label: "Gentle Speaker", earned: false, desc: "30 days of kind speech" },
      { label: "Forgiver", earned: true, desc: "Forgave a classmate" },
    ],
    dailyTasks: [
      { task: "Daily Dhikr (33x Subhanallah)", done: true },
      { task: "Act of Kindness", done: true },
      { task: "Help a classmate", done: false },
      { task: "Avoid backbiting", done: true },
    ],
  },
  {
    id: "community",
    title: "Community Leadership",
    arabic: "الْخِدْمَة",
    icon: "🤝",
    color: "blue",
    points: 120,
    maxPoints: 200,
    badges: [
      { label: "Volunteer", earned: true, desc: "Completed 2 community service hours" },
      { label: "Class Leader", earned: false, desc: "Lead 3 class projects" },
      { label: "Mentor", earned: false, desc: "Help 5 younger students" },
    ],
    dailyTasks: [
      { task: "Help set up classroom", done: false },
      { task: "Check on a struggling classmate", done: true },
      { task: "Community service log", done: false },
    ],
  },
  {
    id: "knowledge",
    title: "Knowledge & Growth",
    arabic: "الْعِلْم",
    icon: "📖",
    color: "purple",
    points: 210,
    maxPoints: 250,
    badges: [
      { label: "Quran Memorizer", earned: true, desc: "Memorized Surah Al-Mulk" },
      { label: "Arabic Reader", earned: true, desc: "Read 10 pages of Arabic text" },
      { label: "Islamic Scholar", earned: false, desc: "Complete all Islamic Studies missions" },
    ],
    dailyTasks: [
      { task: "Quran recitation (1 page)", done: true },
      { task: "Islamic Studies reading", done: true },
      { task: "Arabic vocabulary practice", done: false },
      { task: "Read a Hadith", done: true },
    ],
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
};

const totalPoints = tarbiyahCategories.reduce((s, c) => s + c.points, 0);
const totalMax    = tarbiyahCategories.reduce((s, c) => s + c.maxPoints, 0);
const overallPct  = Math.round((totalPoints / totalMax) * 100);

export default function TarbiyahPage() {
  return (
    <DashboardShell role="student" userName="Ahmed Al-Rashid" userInitial="A" subtitle="Tarbiyah Tracker">
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
                <div className="text-white/40 text-xs">Tarbiyah Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold-400">7🔥</div>
                <div className="text-white/40 text-xs">Day Streak</div>
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            <ProgressBar value={totalPoints} max={totalMax} variant="emerald" showLabel animated />
          </div>
        </motion.div>

        {/* Daily Check-in */}
        <div className="glass rounded-2xl p-6 border border-gold-500/15">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <Flame size={18} className="text-gold-400" />
            Today&apos;s Check-In
            <Badge variant="gold">March 5, 2026</Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tarbiyahCategories.map((cat) => {
              const c = colorMap[cat.color];
              const doneTasks = cat.dailyTasks.filter((t) => t.done).length;
              const _taskPct  = Math.round((doneTasks / cat.dailyTasks.length) * 100); void _taskPct;
              return (
                <div key={cat.id} className={`rounded-xl p-4 border ${c.border} ${c.bg}`}>
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className={`font-semibold text-sm ${c.text} mb-1`}>{cat.title}</div>
                  <div className="text-white/40 text-xs mb-3">{doneTasks}/{cat.dailyTasks.length} tasks</div>
                  <ProgressBar value={doneTasks} max={cat.dailyTasks.length} variant={cat.color as "gold" | "emerald" | "blue"} size="sm" animated />
                </div>
              );
            })}
          </div>
        </div>

        {/* Category cards */}
        <div className="space-y-6">
          {tarbiyahCategories.map((cat, catIdx) => {
            const c = colorMap[cat.color];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className={`glass rounded-2xl border ${c.border} overflow-hidden`}
              >
                {/* Card header */}
                <div className={`px-6 py-4 border-b ${c.border} ${c.bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h3 className={`font-semibold text-white`}>{cat.title}</h3>
                      <div className="font-arabic text-sm" style={{ color: colorMap[cat.color].text.replace("text-", "") }}>
                        <span className={c.text}>{cat.arabic}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${c.text}`}>{cat.points}</div>
                    <div className="text-white/30 text-xs">/ {cat.maxPoints} pts</div>
                  </div>
                </div>

                <div className="p-6 grid sm:grid-cols-2 gap-6">
                  {/* Daily Tasks */}
                  <div>
                    <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">
                      Daily Tasks
                    </h4>
                    <div className="space-y-2.5">
                      {cat.dailyTasks.map((task, ti) => (
                        <motion.div
                          key={task.task}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * ti }}
                          className="flex items-center gap-3 group cursor-pointer"
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
                      {cat.badges.map((badge, bi) => (
                        <motion.div
                          key={badge.label}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * bi }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl ${badge.earned ? `${c.bg} border ${c.border}` : "border border-white/5"}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${badge.earned ? `bg-gradient-to-br ${c.gradient}` : "bg-white/5"}`}>
                            <Trophy size={14} className={badge.earned ? "text-white" : "text-white/20"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold ${badge.earned ? "text-white" : "text-white/30"}`}>
                              {badge.label}
                            </div>
                            <div className="text-white/30 text-[10px] truncate">{badge.desc}</div>
                          </div>
                          {badge.earned && <Badge variant={cat.color as "gold" | "emerald" | "blue" | "purple"}>Earned</Badge>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <ProgressBar value={cat.points} max={cat.maxPoints} variant={cat.color as "gold" | "emerald" | "blue"} showLabel label={`${cat.title} Progress`} animated />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
