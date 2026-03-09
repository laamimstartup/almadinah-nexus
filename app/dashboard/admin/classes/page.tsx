"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAuth } from "@/lib/auth-context";
import { useAllClasses, useAllStaff, createClass } from "@/lib/db/hooks";
import { BookOpen, Plus, X, Users, CheckCircle2 } from "lucide-react";
import type { ClassDoc } from "@/lib/db/types";

const SCHOOL_ID = "almadinah-queens";
const ACADEMIC_YEAR = "2025-2026";

const GRADE_OPTIONS = [
  { value: "preK", label: "Pre-K", level: 0 },
  { value: "K",   label: "Kindergarten", level: 1 },
  { value: "1",   label: "Grade 1",  level: 2 },
  { value: "2",   label: "Grade 2",  level: 3 },
  { value: "3",   label: "Grade 3",  level: 4 },
  { value: "4",   label: "Grade 4",  level: 5 },
  { value: "5",   label: "Grade 5",  level: 6 },
  { value: "6",   label: "Grade 6",  level: 7 },
  { value: "7",   label: "Grade 7",  level: 8 },
  { value: "8",   label: "Grade 8",  level: 9 },
  { value: "9",   label: "Grade 9",  level: 10 },
];

export default function AdminClassesPage() {
  const { user } = useAuth();
  const { classes, loading } = useAllClasses(SCHOOL_ID, ACADEMIC_YEAR);
  const { staff } = useAllStaff(SCHOOL_ID);

  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [form, setForm] = useState({
    name: "", grade: "7", section: "A",
    leadEducatorUid: "", roomNumber: "", maxStudents: "20",
  });

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const educators = staff.filter((s) => s.role === "educator");

  const handleCreate = async () => {
    if (!form.name || !form.leadEducatorUid) return;
    setSaving(true);
    try {
      const educator = staff.find((s) => s.uid === form.leadEducatorUid);
      const gradeOption = GRADE_OPTIONS.find((g) => g.value === form.grade);
      const payload: Omit<ClassDoc, "id" | "createdAt" | "updatedAt" | "studentUids"> = {
        name: form.name,
        displayName: `${gradeOption?.label ?? form.grade} — Section ${form.section}`,
        grade: form.grade,
        gradeLevel: gradeOption?.level ?? 8,
        schoolId: SCHOOL_ID,
        academicYear: ACADEMIC_YEAR,
        roomNumber: form.roomNumber || undefined,
        maxStudents: parseInt(form.maxStudents) || 20,
        leadEducatorUid: form.leadEducatorUid,
        leadEducatorName: educator?.uid ? `${educator.title ?? ""} ${user?.displayName ?? ""}`.trim() : "TBD",
        programIds: [],
        subjects: [],
        isActive: true,
      };
      await createClass(payload);
      setSaved(true);
      setTimeout(() => { setSaved(false); setShowModal(false); setForm({ name: "", grade: "7", section: "A", leadEducatorUid: "", roomNumber: "", maxStudents: "20" }); }, 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Classes">
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen size={22} className="text-emerald-400" />
              Class Management
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{classes.length} classes · {ACADEMIC_YEAR}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-all"
          >
            <Plus size={16} /> Create Class
          </button>
        </div>

        {/* Classes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl h-40 animate-pulse border border-white/5" />
              ))
            : classes.map((cls, i) => {
                const studentCount = cls.studentUids?.length ?? 0;
                const capacity = cls.maxStudents ?? 20;
                const fillPct = Math.round((studentCount / capacity) * 100);
                return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass rounded-2xl p-5 border border-emerald-500/10 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 font-bold text-sm">{cls.grade}</span>
                        </div>
                        <Badge variant={cls.isActive ? "emerald" : "gold"}>{cls.isActive ? "Active" : "Inactive"}</Badge>
                      </div>
                      <h3 className="text-white font-bold text-base mb-0.5">{cls.name}</h3>
                      <p className="text-white/40 text-xs mb-1">{cls.displayName}</p>
                      <p className="text-white/30 text-xs mb-3">{cls.leadEducatorName}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/40 text-xs flex items-center gap-1"><Users size={11} /> {studentCount}/{capacity} students</span>
                        {cls.roomNumber && <span className="text-white/30 text-xs">{cls.roomNumber}</span>}
                      </div>
                      <ProgressBar value={fillPct} variant="emerald" size="sm" animated />
                      {cls.subjects?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {cls.subjects.slice(0, 3).map((sub) => (
                            <span key={sub} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{sub}</span>
                          ))}
                          {cls.subjects.length > 3 && <span className="text-[10px] text-white/20">+{cls.subjects.length - 3}</span>}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
          }
        </div>

        {!loading && classes.length === 0 && (
          <div className="glass rounded-2xl p-12 border border-dashed border-white/10 text-center">
            <BookOpen size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-base font-medium mb-1">No classes yet</p>
            <p className="text-white/20 text-sm mb-4">Create your first class for {ACADEMIC_YEAR}</p>
            <button onClick={() => setShowModal(true)} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-all">
              Create First Class
            </button>
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-nexus-surface border border-nexus-border rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-display font-bold text-lg">Create New Class</h2>
                  <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs font-medium block mb-1.5">Class Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Grade 7A"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Grade *</label>
                      <select
                        value={form.grade}
                        onChange={(e) => setForm({ ...form, grade: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                      >
                        {GRADE_OPTIONS.map((g) => (
                          <option key={g.value} value={g.value} className="bg-nexus-surface">{g.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Section</label>
                      <input
                        type="text"
                        placeholder="A"
                        value={form.section}
                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-medium block mb-1.5">Lead Educator *</label>
                    <select
                      value={form.leadEducatorUid}
                      onChange={(e) => setForm({ ...form, leadEducatorUid: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                    >
                      <option value="" className="bg-nexus-surface">Select educator…</option>
                      {educators.map((e) => (
                        <option key={e.uid} value={e.uid} className="bg-nexus-surface">{e.uid}</option>
                      ))}
                      {educators.length === 0 && (
                        <option value="educator-yusuf-001" className="bg-nexus-surface">Ustadh Yusuf Khalid</option>
                      )}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Room Number</label>
                      <input
                        type="text"
                        placeholder="e.g. Room 204"
                        value={form.roomNumber}
                        onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Max Students</label>
                      <input
                        type="number"
                        placeholder="20"
                        value={form.maxStudents}
                        onChange={(e) => setForm({ ...form, maxStudents: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={saving || !form.name || !form.leadEducatorUid}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saved ? <><CheckCircle2 size={15} /> Created!</> : saving ? "Creating…" : <><Plus size={15} /> Create Class</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
