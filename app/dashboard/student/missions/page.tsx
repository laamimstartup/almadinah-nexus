"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Target, Clock, Star, Zap, CheckCircle2, Lock, Play, Filter } from "lucide-react";

type MissionStatus = "active" | "completed" | "locked";
type MissionColor = "gold" | "emerald" | "blue" | "purple";

interface Mission {
  id: string;
  title: string;
  subject: string;
  description: string;
  progress: number;
  dueIn: string;
  xp: number;
  difficulty: string;
  status: MissionStatus;
  color: MissionColor;
  tasks: { label: string; done: boolean }[];
}

const missions: Mission[] = [
  {
    id: "1",
    title: "The Algebra Conquest",
    subject: "Mathematics",
    description: "Master linear equations and inequalities through real-world problem sets.",
    progress: 65,
    dueIn: "2 days",
    xp: 120,
    difficulty: "Medium",
    status: "active",
    color: "gold",
    tasks: [
      { label: "Watch: Introduction to Algebra", done: true },
      { label: "Complete Practice Set A (10 problems)", done: true },
      { label: "Practice Set B (15 problems)", done: false },
      { label: "Word Problem Challenge", done: false },
      { label: "Submit Final Quiz", done: false },
    ],
  },
  {
    id: "2",
    title: "The Badr Expedition",
    subject: "Islamic History",
    description: "Explore the Battle of Badr — its causes, events, and lasting lessons for Muslim leadership.",
    progress: 40,
    dueIn: "4 days",
    xp: 90,
    difficulty: "Medium",
    status: "active",
    color: "emerald",
    tasks: [
      { label: "Read: Context of Badr (Chapter 4)", done: true },
      { label: "Watch documentary excerpt", done: true },
      { label: "Map activity: The march to Badr", done: false },
      { label: "Reflection essay (300 words)", done: false },
    ],
  },
  {
    id: "3",
    title: "Shakespeare's Code",
    subject: "English Language Arts",
    description: "Analyze themes of ambition and morality in Macbeth through an Islamic leadership lens.",
    progress: 80,
    dueIn: "1 day",
    xp: 80,
    difficulty: "Hard",
    status: "active",
    color: "blue",
    tasks: [
      { label: "Read Acts I-II", done: true },
      { label: "Character analysis worksheet", done: true },
      { label: "Read Acts III-V", done: true },
      { label: "Final essay: Leadership & Moral Courage", done: false },
    ],
  },
  {
    id: "4",
    title: "The Quran Recitation Challenge",
    subject: "Quran & Tajweed",
    description: "Perfect your recitation of Surah Al-Mulk with proper Tajweed rules.",
    progress: 100,
    dueIn: "Completed",
    xp: 150,
    difficulty: "Hard",
    status: "completed",
    color: "gold",
    tasks: [
      { label: "Learn Makharij al-Huruf rules", done: true },
      { label: "Practice Surah Al-Mulk verses 1-10", done: true },
      { label: "Practice verses 11-20", done: true },
      { label: "Full recitation recording submitted", done: true },
    ],
  },
  {
    id: "5",
    title: "The Photosynthesis Lab",
    subject: "Science",
    description: "Conduct virtual experiments on plant biology and document your findings.",
    progress: 100,
    dueIn: "Completed",
    xp: 100,
    difficulty: "Easy",
    status: "completed",
    color: "emerald",
    tasks: [
      { label: "Virtual lab experiment", done: true },
      { label: "Data recording worksheet", done: true },
      { label: "Lab report submitted", done: true },
    ],
  },
  {
    id: "6",
    title: "The Arabic Vocabulary Quest",
    subject: "Arabic Language",
    description: "Master 100 new Arabic vocabulary words and use them in context.",
    progress: 0,
    dueIn: "Next week",
    xp: 110,
    difficulty: "Medium",
    status: "locked",
    color: "purple",
    tasks: [
      { label: "Vocabulary flashcards set 1 (25 words)", done: false },
      { label: "Vocabulary flashcards set 2 (25 words)", done: false },
      { label: "Flashcards set 3 & 4 (50 words)", done: false },
      { label: "Context sentences quiz", done: false },
    ],
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
};

const difficultyColor: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-gold-400 bg-gold-500/10 border-gold-500/20",
  Hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

type FilterType = "all" | "active" | "completed" | "locked";

export default function MissionsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const filtered = filter === "all" ? missions : missions.filter((m) => m.status === filter);
  const activeCount    = missions.filter((m) => m.status === "active").length;
  const completedCount = missions.filter((m) => m.status === "completed").length;
  const totalXP        = missions.filter((m) => m.status === "completed").reduce((s, m) => s + m.xp, 0);

  return (
    <DashboardShell role="student" userName="Ahmed Al-Rashid" userInitial="A" subtitle="My Missions">
      <div className="p-4 lg:p-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-gold-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                My <span className="text-gold-gradient">Missions</span>
              </h1>
              <p className="text-white/50 text-sm">
                Every mission completed is a step closer to your leadership destiny.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">{activeCount}</div>
                <div className="text-white/40 text-xs">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
                <div className="text-white/40 text-xs">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{totalXP}</div>
                <div className="text-white/40 text-xs">XP Earned</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-white/30" />
          {(["all", "active", "completed", "locked"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                filter === f
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "text-white/40 hover:text-white/70 border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Mission cards */}
        <div className="space-y-4">
          {filtered.map((mission, i) => {
            const c = colorMap[mission.color];
            const isExpanded = expandedId === mission.id;
            const isLocked = mission.status === "locked";
            const isDone = mission.status === "completed";

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`glass rounded-2xl border ${c.border} overflow-hidden ${isLocked ? "opacity-60" : ""}`}
              >
                {/* Mission header — clickable */}
                <button
                  onClick={() => !isLocked && setExpandedId(isExpanded ? null : mission.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Status icon */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isDone ? "bg-gradient-to-br from-emerald-700 to-emerald-400" :
                        isLocked ? "bg-nexus-border" :
                        `bg-gradient-to-br ${c.gradient}`
                      }`}>
                        {isDone    ? <CheckCircle2 size={20} className="text-white" /> :
                         isLocked  ? <Lock size={20} className="text-white/40" /> :
                                     <Target size={20} className="text-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant={mission.color as "gold" | "emerald" | "blue" | "purple"}>{mission.subject}</Badge>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[mission.difficulty]}`}>
                            {mission.difficulty}
                          </span>
                          {!isLocked && !isDone && (
                            <span className="text-white/30 text-xs flex items-center gap-1">
                              <Clock size={11} /> Due in {mission.dueIn}
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">{mission.title}</h3>
                        <p className="text-white/40 text-sm mt-0.5 line-clamp-1">{mission.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className={`font-bold ${c.text}`}>+{mission.xp} XP</div>
                        {!isLocked && <div className="text-white/30 text-xs">{mission.progress}%</div>}
                      </div>
                      {!isLocked && !isDone && (
                        <div className={`w-8 h-8 rounded-full ${c.bg} border ${c.border} flex items-center justify-center`}>
                          <Play size={14} className={c.text} />
                        </div>
                      )}
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="mt-4">
                      <ProgressBar
                        value={mission.progress}
                        variant={isDone ? "emerald" : mission.color}
                        animated
                        showLabel
                      />
                    </div>
                  )}
                </button>

                {/* Expanded task list */}
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border-t ${c.border} ${c.bg} px-5 py-4`}
                  >
                    <h4 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
                      Mission Tasks
                    </h4>
                    <div className="space-y-2.5">
                      {mission.tasks.map((task, ti) => (
                        <div key={ti} className="flex items-center gap-3">
                          {task.done ? (
                            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full border-2 ${c.border} flex-shrink-0`} />
                          )}
                          <span className={`text-sm ${task.done ? "text-white/40 line-through" : "text-white/80"}`}>
                            {task.label}
                          </span>
                          {!task.done && !isDone && (
                            <button className={`ml-auto text-xs ${c.text} hover:brightness-125 transition-colors flex items-center gap-1`}>
                              <Zap size={12} /> Start
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {!isDone && (
                      <div className="mt-4 flex gap-3">
                        <button className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${c.gradient} text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all`}>
                          <Play size={15} /> Continue Mission
                        </button>
                        <button className="px-4 py-2.5 rounded-xl glass border border-white/10 text-white/50 text-sm hover:text-white transition-colors">
                          Ask Mualim
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
