"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { BookOpen, Users, BarChart3, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

const classes = [
  {
    id: "7a",
    name: "Grade 7A",
    subject: "Islamic Studies",
    students: 14,
    avgGrade: 91,
    avgEngagement: 94,
    nextLesson: "The Five Pillars — Deep Dive",
    time: "Today 9:00 AM",
    color: "gold" as const,
  },
  {
    id: "7b",
    name: "Grade 7B",
    subject: "Mathematics",
    students: 14,
    avgGrade: 84,
    avgEngagement: 82,
    nextLesson: "Algebra: Systems of Equations",
    time: "Today 11:00 AM",
    color: "emerald" as const,
  },
  {
    id: "7c",
    name: "Grade 7C",
    subject: "Islamic Studies",
    students: 13,
    avgGrade: 88,
    avgEngagement: 87,
    nextLesson: "Seerah: The Hijrah",
    time: "Tomorrow 9:00 AM",
    color: "blue" as const,
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:    { text: "text-gold-400",    bg: "bg-gold-500/10",    border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:    { text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
};

export default function ClassesPage() {
  return (
    <DashboardShell role="educator" userName="Ustadh Yusuf" userInitial="Y" subtitle="My Classes">
      <div className="p-4 lg:p-8 space-y-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-blue-500/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
          <h1 className="relative font-display text-2xl font-bold text-white mb-1">
            My <span className="text-blue-400">Classes</span>
          </h1>
          <p className="relative text-white/50 text-sm">3 active classes · 41 students total</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {classes.map((cls, i) => {
            const c = colorMap[cls.color];
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`glass rounded-2xl p-6 border ${c.border} relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${c.bg} rounded-full blur-2xl opacity-60`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-4`}>
                    <BookOpen size={22} className="text-white" />
                  </div>
                  <Badge variant={cls.color}>{cls.subject}</Badge>
                  <h3 className="text-white font-bold text-xl mt-2 mb-1">{cls.name}</h3>
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                    <Users size={13} />
                    <span>{cls.students} students</span>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Avg. Grade</span>
                        <span className={c.text}>{cls.avgGrade}%</span>
                      </div>
                      <ProgressBar value={cls.avgGrade} variant={cls.color} size="sm" animated />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Engagement</span>
                        <span className={c.text}>{cls.avgEngagement}%</span>
                      </div>
                      <ProgressBar value={cls.avgEngagement} variant={cls.color} size="sm" animated />
                    </div>
                  </div>

                  <div className={`rounded-xl p-3 ${c.bg} border ${c.border} mb-4`}>
                    <div className="text-white/40 text-xs mb-0.5 flex items-center gap-1">
                      <Clock size={10} /> Next Lesson
                    </div>
                    <div className="text-white text-sm font-medium">{cls.nextLesson}</div>
                    <div className={`text-xs mt-0.5 ${c.text}`}>{cls.time}</div>
                  </div>

                  <Link
                    href="/dashboard/educator"
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r ${c.gradient} text-white text-sm font-semibold hover:brightness-110 transition-all`}
                  >
                    <BarChart3 size={15} /> View Analytics <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
