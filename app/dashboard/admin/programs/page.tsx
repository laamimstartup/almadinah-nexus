"use client";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { usePrograms, useSubjects } from "@/lib/db/hooks";
import { Star, BookOpen } from "lucide-react";

const SCHOOL_ID = "almadinah-queens";

const COLOR_MAP: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  gold:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   gradient: "from-gold-600 to-gold-400" },
  emerald:{ text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20", gradient: "from-emerald-700 to-emerald-400" },
  blue:   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   gradient: "from-blue-700 to-blue-400" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "from-purple-700 to-purple-400" },
  rose:   { text: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20",   gradient: "from-rose-700 to-rose-400" },
  teal:   { text: "text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-500/20",   gradient: "from-teal-700 to-teal-400" },
};

export default function AdminProgramsPage() {
  const { user } = useAuth();
  const { programs, loading: pLoad } = usePrograms(SCHOOL_ID);
  const { subjects, loading: sLoad } = useSubjects(SCHOOL_ID);

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const loading = pLoad || sLoad;

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Programs">
      <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Star size={22} className="text-gold-400" />
              Academic Programs
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{programs.length} programs · {subjects.length} subjects</p>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              Managed via seed script
            </span>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Programs",        value: programs.length,  color: "gold" },
            { label: "Subjects",        value: subjects.length,  color: "emerald" },
            { label: "Active Programs", value: programs.filter((p) => p.isActive).length, color: "blue" },
            { label: "Grade Range",     value: "Pre-K → 9",     color: "purple" },
          ].map((item) => {
            const c = COLOR_MAP[item.color];
            return (
              <div key={item.label} className={`glass rounded-2xl p-4 border ${c.border}`}>
                <div className={`text-xl font-display font-bold ${c.text}`}>{loading ? "—" : item.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{item.label}</div>
              </div>
            );
          })}
        </div>

        {/* Programs grid */}
        <div className="space-y-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl h-32 animate-pulse border border-white/5" />
              ))
            : programs.map((prog, i) => {
                const c = COLOR_MAP[prog.color] ?? COLOR_MAP.gold;
                const progSubjects = subjects.filter((s) => s.programId === prog.id);
                return (
                  <motion.div
                    key={prog.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`glass rounded-2xl p-5 border ${c.border} relative overflow-hidden`}
                  >
                    <div className={`absolute top-0 right-0 w-40 h-40 ${c.bg} rounded-full blur-3xl pointer-events-none`} />
                    <div className="relative">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center flex-shrink-0`}>
                          <BookOpen size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-bold text-lg">{prog.title}</h3>
                            {prog.arabicTitle && <span className="text-white/30 text-sm font-arabic">{prog.arabicTitle}</span>}
                            {prog.isActive
                              ? <Badge variant="emerald">Active</Badge>
                              : <Badge variant="gold">Inactive</Badge>
                            }
                          </div>
                          <p className={`text-sm ${c.text} mb-1`}>{prog.subtitle}</p>
                          <p className="text-white/40 text-xs">Grades {prog.gradeMin === 0 ? "Pre-K" : prog.gradeMin}–{prog.gradeMax}</p>
                        </div>
                      </div>
                      {prog.description && (
                        <p className="text-white/40 text-sm mb-4 line-clamp-2">{prog.description}</p>
                      )}
                      {progSubjects.length > 0 && (
                        <div>
                          <p className="text-white/30 text-xs font-medium mb-2 uppercase tracking-wider">Subjects ({progSubjects.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {progSubjects.map((sub) => {
                              const sc = COLOR_MAP[sub.color] ?? COLOR_MAP.gold;
                              return (
                                <span key={sub.id} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${sc.text} ${sc.bg} ${sc.border}`}>
                                  {sub.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
          }
          {!loading && programs.length === 0 && (
            <div className="glass rounded-2xl p-12 border border-dashed border-white/10 text-center">
              <Star size={28} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm font-medium mb-1">No programs seeded yet</p>
              <p className="text-white/20 text-xs">Run <code className="bg-white/10 px-1 rounded">npx tsx scripts/seedPrograms.ts</code> to populate programs</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
