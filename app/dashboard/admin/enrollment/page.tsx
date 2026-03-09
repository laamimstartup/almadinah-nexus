"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { useEnrollments, useAllClasses, updateEnrollmentStatus, createEnrollment } from "@/lib/db/hooks";
import { UserPlus, X, CheckCircle2, Search, Clock, AlertTriangle } from "lucide-react";
import type { EnrollmentStatus } from "@/lib/db/types";

const SCHOOL_ID = "almadinah-queens";
const ACADEMIC_YEAR = "2025-2026";

const STATUS_COLORS: Record<EnrollmentStatus, "gold" | "emerald" | "blue" | "purple"> = {
  pending:     "gold",
  accepted:    "blue",
  active:      "emerald",
  withdrawn:   "purple",
  graduated:   "emerald",
  transferred: "purple",
};

const STATUS_LABELS: Record<EnrollmentStatus, string> = {
  pending:     "⏳ Pending",
  accepted:    "✅ Accepted",
  active:      "🟢 Active",
  withdrawn:   "🔴 Withdrawn",
  graduated:   "🎓 Graduated",
  transferred: "↔️ Transferred",
};

export default function AdminEnrollmentPage() {
  const { user } = useAuth();
  const { enrollments, loading } = useEnrollments(SCHOOL_ID, ACADEMIC_YEAR);
  const { classes } = useAllClasses(SCHOOL_ID, ACADEMIC_YEAR);

  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState<"all" | EnrollmentStatus>("all");
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [form, setForm] = useState({
    studentName: "", studentUid: "", classId: "",
    grade: "7", notes: "",
  });

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const filtered = enrollments.filter((e) => {
    const matchSearch = !search || e.studentName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:      enrollments.length,
    pending:  enrollments.filter((e) => e.status === "pending").length,
    active:   enrollments.filter((e) => e.status === "active").length,
    accepted: enrollments.filter((e) => e.status === "accepted").length,
  };

  const handleCreate = async () => {
    if (!form.studentName || !form.classId) return;
    setSaving(true);
    try {
      const cls = classes.find((c) => c.id === form.classId);
      await createEnrollment({
        studentUid:   form.studentUid || `stu-${Date.now()}`,
        studentName:  form.studentName,
        classId:      form.classId,
        className:    cls?.name ?? "",
        schoolId:     SCHOOL_ID,
        academicYear: ACADEMIC_YEAR,
        grade:        form.grade,
        status:       "pending",
        enrollmentDate: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as never,
        notes:        form.notes || undefined,
        createdBy:    user?.uid ?? "admin",
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowModal(false);
        setForm({ studentName: "", studentUid: "", classId: "", grade: "7", notes: "" });
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (enrollmentId: string, newStatus: string) => {
    await updateEnrollmentStatus(enrollmentId, newStatus, user?.uid ?? "admin");
  };

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Enrollment">
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus size={22} className="text-blue-400" />
              Enrollment Management
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{enrollments.length} enrollments · {ACADEMIC_YEAR}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all"
          >
            <UserPlus size={16} /> New Enrollment
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "pending", "active", "accepted"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "glass border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {s === "pending" && counts.pending > 0 && <AlertTriangle size={12} className="text-gold-400" />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterStatus === s ? "bg-white/20" : "bg-white/5"}`}>
                {counts[s] ?? enrollments.filter((e) => e.status === s).length}
              </span>
            </button>
          ))}
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search student…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/50 w-48 transition-all"
            />
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Student</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Grade</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Class</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Status</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Enrolled</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="h-4 bg-white/5 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : filtered.map((enr, i) => (
                      <motion.tr
                        key={enr.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {enr.studentName?.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">{enr.studentName}</div>
                              {enr.notes && <div className="text-white/30 text-[10px] truncate max-w-[150px]">{enr.notes}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-white/60 text-sm">Gr. {enr.grade}</td>
                        <td className="px-4 py-3.5 text-white/60 text-xs">{enr.className}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant={STATUS_COLORS[enr.status]}>
                            {STATUS_LABELS[enr.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-white/40 text-xs">
                          {enr.enrollmentDate?.toDate?.()?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) ?? "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={enr.status}
                            onChange={(e) => handleStatusChange(enr.id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/60 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
                          >
                            <option value="pending"     className="bg-nexus-surface">Pending</option>
                            <option value="accepted"    className="bg-nexus-surface">Accepted</option>
                            <option value="active"      className="bg-nexus-surface">Active</option>
                            <option value="withdrawn"   className="bg-nexus-surface">Withdrawn</option>
                            <option value="graduated"   className="bg-nexus-surface">Graduated</option>
                            <option value="transferred" className="bg-nexus-surface">Transferred</option>
                          </select>
                        </td>
                      </motion.tr>
                    ))
                }
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Clock size={24} className="text-white/20 mx-auto mb-2" />
                      <p className="text-white/20 text-sm">No enrollments found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Enrollment Modal */}
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
                  <h2 className="text-white font-display font-bold text-lg">New Enrollment</h2>
                  <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs font-medium block mb-1.5">Student Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Yusuf Al-Amin"
                      value={form.studentName}
                      onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Grade *</label>
                      <select
                        value={form.grade}
                        onChange={(e) => setForm({ ...form, grade: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                      >
                        {["preK","K","1","2","3","4","5","6","7","8","9"].map((g) => (
                          <option key={g} value={g} className="bg-nexus-surface">{g === "preK" ? "Pre-K" : g === "K" ? "Kindergarten" : `Grade ${g}`}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Assign Class *</label>
                      <select
                        value={form.classId}
                        onChange={(e) => setForm({ ...form, classId: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                      >
                        <option value="" className="bg-nexus-surface">Select class…</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id} className="bg-nexus-surface">{c.name}</option>
                        ))}
                        {classes.length === 0 && (
                          <option value="grade-7a-2026" className="bg-nexus-surface">Grade 7A</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-medium block mb-1.5">Notes (optional)</label>
                    <textarea
                      placeholder="Admission notes, special requirements…"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm resize-none focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={saving || !form.studentName || !form.classId}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saved ? <><CheckCircle2 size={15} /> Enrolled!</> : saving ? "Enrolling…" : <><UserPlus size={15} /> Enroll Student</>}
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
