"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { Calendar, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";

const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const attendanceData = [
  { month: "Sep 2025", present: 19, absent: 1, late: 0, pct: 95 },
  { month: "Oct 2025", present: 21, absent: 0, late: 1, pct: 100 },
  { month: "Nov 2025", present: 18, absent: 2, late: 0, pct: 90 },
  { month: "Dec 2025", present: 15, absent: 0, late: 0, pct: 100 },
  { month: "Jan 2026", present: 21, absent: 0, late: 1, pct: 100 },
  { month: "Feb 2026", present: 19, absent: 1, late: 0, pct: 95 },
  { month: "Mar 2026", present: 4,  absent: 0, late: 0, pct: 100 },
];

const recentDays = [
  { date: "Mon, Mar 4",  status: "present", time: "8:02 AM" },
  { date: "Tue, Mar 3",  status: "present", time: "7:58 AM" },
  { date: "Mon, Mar 2",  status: "late",    time: "8:22 AM" },
  { date: "Fri, Feb 28", status: "present", time: "8:00 AM" },
  { date: "Thu, Feb 27", status: "present", time: "8:05 AM" },
  { date: "Wed, Feb 26", status: "present", time: "7:55 AM" },
  { date: "Tue, Feb 25", status: "absent",  time: "—" },
  { date: "Mon, Feb 24", status: "present", time: "8:01 AM" },
];

const overallPct = Math.round(attendanceData.reduce((s, m) => s + m.pct, 0) / attendanceData.length);

export default function AttendancePage() {
  return (
    <DashboardShell role="parent" userName="Sister Fatima" userInitial="F" subtitle="Attendance">
      <div className="p-4 lg:p-8 space-y-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-blue-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">
                Attendance <span className="text-blue-400">Record</span>
              </h1>
              <p className="text-white/50 text-sm">Ahmed Al-Rashid · Grade 7 · Academic Year 2025–2026</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">{overallPct}%</div>
                <div className="text-white/40 text-xs">Overall Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold-400">2</div>
                <div className="text-white/40 text-xs">Total Absences</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly chart */}
        <div>
          <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-400" />
            Monthly Attendance
          </h2>
          <div className="glass rounded-2xl p-6 border border-blue-500/10">
            <div className="flex items-end gap-3 h-36">
              {attendanceData.map((month, i) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5" style={{ height: "120px" }}>
                    <div className="flex-1 flex flex-col justify-end gap-0.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${month.pct}%` }}
                        transition={{ delay: i * 0.08, duration: 0.7, ease: "easeOut" }}
                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400"
                        style={{ minHeight: "4px" }}
                      />
                    </div>
                  </div>
                  <span className="text-white/30 text-[9px]">{months[i]}</span>
                  <span className={`text-[10px] font-bold ${month.pct === 100 ? "text-emerald-400" : month.pct >= 95 ? "text-gold-400" : "text-red-400"}`}>
                    {month.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent days */}
        <div>
          <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-blue-400" />
            Recent Days
          </h2>
          <div className="glass rounded-2xl border border-nexus-border overflow-hidden">
            <div className="divide-y divide-nexus-border">
              {recentDays.map((day, i) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  {day.status === "present" ? (
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  ) : day.status === "late" ? (
                    <Clock size={18} className="text-gold-400 flex-shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-white/70 text-sm flex-1">{day.date}</span>
                  <Badge variant={day.status === "present" ? "emerald" : day.status === "late" ? "gold" : "red"}>
                    {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                  </Badge>
                  <span className="text-white/30 text-xs w-16 text-right">{day.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
