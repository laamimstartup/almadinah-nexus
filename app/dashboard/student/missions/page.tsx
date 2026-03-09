"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Target, Clock, Zap, CheckCircle2, Lock, Play, Filter } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStudentProfile, toggleMissionTask } from "@/lib/db/hooks";
import { getMissionsWithProgress } from "@/lib/db/hooks";
import type { MissionDoc, MissionProgressDoc } from "@/lib/db/types";

type MissionStatus = "active" | "completed" | "locked";
type MissionColor = "gold" | "emerald" | "blue" | "purple";

interface CombinedMission {
  id: string;
  title: string;
  subject: string;
  description: string;
  progress: number;
  xp: number;
  difficulty: string;
  status: MissionStatus;
  color: MissionColor;
  tasks: { id: string; label: string; done: boolean }[];
  rawProgress: MissionProgressDoc | null;
}

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
};

const difficultyColor: Record<string, string> = {
  Easy:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-gold-400 bg-gold-500/10 border-gold-500/20",
  Hard:   "text-red-400 bg-red-500/10 border-red-500/20",
};

type FilterType = "all" | "active" | "completed" | "locked";

export default function MissionsPage() {
  const { user } = useAuth();
  const { profile } = useStudentProfile(user?.uid ?? null);
  const [filter, setFilter]       = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [missions, setMissions]   = useState<CombinedMission[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.uid || !profile?.classId) return;
    getMissionsWithProgress(user.uid, profile.classId).then((items) => {
      const combined: CombinedMission[] = items.map(({ mission, progress }) => {
        const m = mission as MissionDoc & { id: string };
        const p = progress as MissionProgressDoc | null;
        const tasksProgress = p?.tasksProgress ?? [];
        return {
          id:          m.id,
          title:       m.title,
          subject:     m.subject,
          description: m.description,
          progress:    p?.progress ?? 0,
          xp:          m.xp,
          difficulty:  m.difficulty,
          status:      (p?.status ?? "locked") as MissionStatus,
          color:       m.color as MissionColor,
          tasks:       m.tasks.map((t) => ({
            id:    t.id,
            label: t.label,
            done:  tasksProgress.find((tp) => tp.taskId === t.id)?.done ?? false,
          })),
          rawProgress: p,
        };
      });
      combined.sort((a, b) => {
        const order: Record<MissionStatus, number> = { active: 0, locked: 1, completed: 2 };
        return order[a.status] - order[b.status];
      });
      setMissions(combined);
      if (combined.find((m) => m.status === "active")) {
        setExpandedId(combined.find((m) => m.status === "active")!.id);
      }
      setLoading(false);
    });
  }, [user?.uid, profile?.classId]);

  const handleToggleTask = async (mission: CombinedMission, taskId: string) => {
    if (!user?.uid || !mission.rawProgress) return;
    await toggleMissionTask(
      user.uid,
      mission.id,
      taskId,
      mission.rawProgress,
      mission.rawProgress.tasksProgress
    );
    // optimistic update
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== mission.id) return m;
        const updatedTasks = m.tasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t);
        const donePct = Math.round((updatedTasks.filter((t) => t.done).length / updatedTasks.length) * 100);
        return {
          ...m,
          tasks: updatedTasks,
          progress: donePct,
          status: donePct === 100 ? "completed" : "active",
        };
      })
    );
  };

  const filtered      = filter === "all" ? missions : missions.filter((m) => m.status === filter);
  const activeCount   = missions.filter((m) => m.status === "active").length;
  const completedCount= missions.filter((m) => m.status === "completed").length;
  const totalXP       = missions.filter((m) => m.status === "completed").reduce((s, m) => s + m.xp, 0);

  const firstName   = profile?.displayName?.split(" ")[0] ?? "Student";
  const userInitial = firstName[0]?.toUpperCase() ?? "S";

  return (
    <DashboardShell role="student" userName={profile?.displayName ?? firstName} userInitial={userInitial} subtitle="My Missions">
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

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-white/30 animate-pulse">Loading missions...</div>
        )}

        {/* Mission cards */}
        <div className="space-y-4">
          {filtered.map((mission, i) => {
            const c = colorMap[mission.color] ?? colorMap.gold;
            const isExpanded = expandedId === mission.id;
            const isLocked   = mission.status === "locked";
            const isDone     = mission.status === "completed";

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`glass rounded-2xl border ${c.border} overflow-hidden ${isLocked ? "opacity-60" : ""}`}
              >
                {/* Mission header */}
                <button
                  onClick={() => !isLocked && setExpandedId(isExpanded ? null : mission.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isDone   ? "bg-gradient-to-br from-emerald-700 to-emerald-400" :
                        isLocked ? "bg-white/5" :
                        `bg-gradient-to-br ${c.gradient}`
                      }`}>
                        {isDone   ? <CheckCircle2 size={20} className="text-white" /> :
                         isLocked ? <Lock size={20} className="text-white/40" /> :
                                    <Target size={20} className="text-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant={mission.color}>{mission.subject}</Badge>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[mission.difficulty] ?? difficultyColor.Medium}`}>
                            {mission.difficulty}
                          </span>
                          {!isLocked && !isDone && (
                            <span className="text-white/30 text-xs flex items-center gap-1">
                              <Clock size={11} /> {mission.progress}% done
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
                      {mission.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => !isDone && handleToggleTask(mission, task.id)}
                        >
                          {task.done ? (
                            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full border-2 ${c.border} flex-shrink-0 group-hover:border-white/40 transition-colors`} />
                          )}
                          <span className={`text-sm ${task.done ? "text-white/40 line-through" : "text-white/80"}`}>
                            {task.label}
                          </span>
                          {!task.done && !isDone && (
                            <span className={`ml-auto text-xs ${c.text} hover:brightness-125 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100`}>
                              <Zap size={12} /> Mark done
                            </span>
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
