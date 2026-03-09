"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import {
  TrendingUp, Calendar, MessageSquare, Video, Star, Heart,
  CheckCircle2, AlertCircle, Clock, Zap, Bell, Globe
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useStudentProfile, useActivityFeed } from "@/lib/db/hooks";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const upcomingEvents = [
  { title: "Parent-Teacher Conference", date: "Mar 12", teacher: "Ustadh Yusuf", type: "meeting" },
  { title: "Quran Recitation Competition", date: "Mar 18", teacher: "All Faculty", type: "event" },
  { title: "Math Exam: Algebra Unit", date: "Mar 20", teacher: "Ms. Rahman", type: "exam" },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
};

// Map activity feed types to icons + status
const activityIconMap: Record<string, { icon: LucideIcon; color: string; status: string }> = {
  mission_completed: { icon: Star,         color: "gold",   status: "positive" },
  tarbiyah_checkin:  { icon: Heart,        color: "emerald",status: "positive" },
  attendance:        { icon: CheckCircle2, color: "blue",   status: "positive" },
  alert:             { icon: AlertCircle,  color: "gold",   status: "warning" },
  badge_earned:      { icon: Star,         color: "purple", status: "positive" },
};

function gradeFromPct(pct: number): string {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  return "C";
}

function timeAgo(ts: { seconds: number } | undefined): string {
  if (!ts) return "Recently";
  const diff = Date.now() / 1000 - ts.seconds;
  if (diff < 3600)  return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return `${Math.round(diff / 86400)} days ago`;
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");

  // Parent's child UID — stored in auth context user doc as childUid
  // For demo we use the seeded parent who is linked to student-ahmed-001
  const childUid = (user as unknown as { childUid?: string })?.childUid ?? "student-ahmed-001";

  const { profile: childProfile, loading } = useStudentProfile(childUid);
  const { feed } = useActivityFeed(childUid, 5);

  const parentName    = user?.displayName ?? "Parent";
  const userInitial   = parentName[0]?.toUpperCase() ?? "P";

  const childName     = childProfile?.displayName ?? "Your Child";
  const grade         = childProfile?.grade ? `Grade ${childProfile.grade}` : "Grade 7";
  const teacher       = childProfile?.educatorName ?? "Ustadh Yusuf Khalid";
  const attendance    = childProfile?.attendancePct ?? 96;
  const leadershipPts = childProfile?.leadershipPts ?? 0;
  const tarbiyahScore = childProfile?.tarbiyahScore ?? 0;
  const weekStreak    = childProfile?.streak ?? 0;

  // Overall grade from average pct
  const avgPct        = childProfile?.subjectGrades?.length
    ? Math.round(childProfile.subjectGrades.reduce((s, g) => s + g.pct, 0) / childProfile.subjectGrades.length)
    : 88;
  const overallGrade  = gradeFromPct(avgPct);

  const subjectGrades = (childProfile?.subjectGrades ?? []).map((sg, i) => ({
    subject: sg.subject,
    grade:   sg.grade ?? gradeFromPct(sg.pct),
    pct:     sg.pct,
    color:   (["gold","emerald","blue","gold","emerald","blue"] as const)[i % 6],
  }));

  // Build activity rows from feed
  const recentActivity = feed.map((item) => {
    const meta = activityIconMap[item.type] ?? activityIconMap.mission_completed;
    return {
      text:   item.title + (item.detail ? ` — ${item.detail}` : ""),
      time:   timeAgo(item.createdAt as unknown as { seconds: number }),
      icon:   meta.icon,
      color:  item.color ?? meta.color,
      status: meta.status,
    };
  });

  return (
    <DashboardShell role="parent" userName={parentName} userInitial={userInitial} subtitle="Horizon Portal">
      <div className="p-4 lg:p-8 space-y-8">

        {/* Live Pulse Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-emerald-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Live Pulse</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
                {loading ? "Loading..." : `${childName} is having an `}
                {!loading && <span className="text-emerald-gradient">excellent week.</span>}
              </h1>
              <p className="text-white/50 text-sm">{grade} · Lead Teacher: {teacher}</p>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{attendance}%</div>
                <div className="text-white/40 text-xs">Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400">{overallGrade}</div>
                <div className="text-white/40 text-xs">Overall Grade</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{leadershipPts}</div>
                <div className="text-white/40 text-xs">Leadership Pts</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Message Teacher", icon: MessageSquare, color: "emerald", desc: "Send a note" },
            { label: "Video Call", icon: Video, color: "blue", desc: "Schedule meeting" },
            { label: "Translate Page", icon: Globe, color: "gold", desc: "Arabic · Spanish" },
            { label: "Notifications", icon: Bell, color: "purple", desc: "3 new updates" },
          ].map((action, i) => {
            const Icon = action.icon;
            const c = colorMap[action.color];
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`glass rounded-2xl p-5 border ${c.border} ${c.bg} flex flex-col items-center gap-2 text-center group cursor-pointer`}
              >
                <Icon size={22} className={c.text} />
                <span className="text-white text-sm font-medium">{action.label}</span>
                <span className="text-white/40 text-xs">{action.desc}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <Zap size={18} className="text-emerald-400" />
              Live Activity Feed
            </h2>

            <div className="space-y-3">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                const c = colorMap[item.color];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`glass rounded-xl p-4 border ${item.status === "warning" ? "border-gold-500/30" : "border-white/5"} flex items-start gap-4`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={c.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm">{item.text}</p>
                      <span className="text-white/30 text-xs flex items-center gap-1 mt-1">
                        <Clock size={11} /> {item.time}
                      </span>
                    </div>
                    {item.status === "warning" && (
                      <Badge variant="gold">Action Needed</Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Subject Grades */}
            <div className="mt-6">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-emerald-400" />
                Subject Performance
              </h2>
              <div className="glass rounded-2xl p-6 border border-emerald-500/10 space-y-4">
                {subjectGrades.map((subj, i) => (
                  <motion.div
                    key={subj.subject}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-white/70 text-sm">{subj.subject}</span>
                      <span className={`font-bold text-sm ${colorMap[subj.color].text}`}>{subj.grade}</span>
                    </div>
                    <ProgressBar value={subj.pct} variant={subj.color} animated />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Tarbiyah Score */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Heart size={18} className="text-emerald-400" />
                Tarbiyah Score
              </h2>
              <div className="glass rounded-2xl p-6 border border-emerald-500/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
                <div className="relative">
                  <div className="text-6xl font-bold text-emerald-400 mb-2">{tarbiyahScore}</div>
                  <div className="text-white/40 text-sm mb-4">Character Score</div>
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gold-400 font-bold">{weekStreak}🔥</div>
                      <div className="text-white/30 text-xs">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold">3</div>
                      <div className="text-white/30 text-xs">Badges Earned</div>
                    </div>
                  </div>
                  <ProgressBar value={tarbiyahScore} variant="emerald" className="mt-4" animated />
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-blue-400" />
                Upcoming Events
              </h2>
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => {
                  const typeColors: Record<string, string> = {
                    meeting: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                    event:   "text-gold-400 bg-gold-500/10 border-gold-500/20",
                    exam:    "text-red-400 bg-red-500/10 border-red-500/20",
                  };
                  return (
                    <motion.div
                      key={event.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="glass rounded-xl p-4 border border-white/5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-white text-sm font-medium">{event.title}</h4>
                          <p className="text-white/40 text-xs mt-0.5">{event.teacher}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-lg border ${typeColors[event.type]} flex-shrink-0`}>
                          {event.date}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick message */}
            <div className="glass rounded-2xl p-5 border border-blue-500/20">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <MessageSquare size={15} className="text-blue-400" />
                Message Teacher
              </h3>
              <textarea
                placeholder={`Write a note to ${teacher}…`}
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-nexus-border/40 border border-nexus-border rounded-xl px-3 py-2 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:border-blue-500/50 transition-all"
              />
              <button className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                <Send size={15} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Send({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
