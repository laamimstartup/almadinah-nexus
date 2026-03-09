"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { useAnnouncements, useAllClasses, createAnnouncement } from "@/lib/db/hooks";
import { Megaphone, Plus, X, CheckCircle2, Pin } from "lucide-react";
import type { UserRole } from "@/lib/db/types";

const SCHOOL_ID = "almadinah-queens";
const ACADEMIC_YEAR = "2025-2026";

export default function AdminAnnouncementsPage() {
  const { user } = useAuth();
  const { announcements, loading } = useAnnouncements(SCHOOL_ID);
  const { classes } = useAllClasses(SCHOOL_ID, ACADEMIC_YEAR);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [form, setForm] = useState({
    title: "", body: "", classId: "all",
    targetRoles: ["student", "parent", "educator"] as UserRole[],
    isPinned: false,
  });

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const handleCreate = async () => {
    if (!form.title || !form.body) return;
    setSaving(true);
    try {
      await createAnnouncement({
        schoolId:    SCHOOL_ID,
        classId:     form.classId === "all" ? undefined : form.classId,
        title:       form.title,
        body:        form.body,
        authorUid:   user?.uid ?? "admin",
        authorName:  user?.displayName ?? "Admin",
        targetRoles: form.targetRoles,
        isPinned:    form.isPinned,
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowModal(false);
        setForm({ title: "", body: "", classId: "all", targetRoles: ["student", "parent", "educator"], isPinned: false });
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (role: UserRole) => {
    setForm((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Announcements">
      <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Megaphone size={22} className="text-gold-400" />
              Announcements
            </h1>
            <p className="text-white/40 text-sm mt-0.5">School-wide and class-specific announcements</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-nexus-bg text-sm font-semibold hover:bg-gold-400 transition-all"
          >
            <Plus size={16} /> New Announcement
          </button>
        </div>

        {/* Announcements list */}
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl h-28 animate-pulse border border-white/5" />
              ))
            : announcements.map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`glass rounded-2xl p-5 border ${ann.isPinned ? "border-gold-500/30" : "border-white/5"} relative`}
                >
                  {ann.isPinned && (
                    <div className="absolute top-3 right-4 flex items-center gap-1 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
                      <Pin size={11} /> Pinned
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Megaphone size={16} className="text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base mb-1">{ann.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{ann.body}</p>
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        <span className="text-white/30 text-xs">{ann.authorName}</span>
                        <span className="text-white/10">·</span>
                        <span className="text-white/30 text-xs">
                          {ann.createdAt?.toDate?.()?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) ?? ""}
                        </span>
                        {ann.classId && <span className="text-white/10">·</span>}
                        {ann.classId && <span className="text-blue-400 text-xs">{classes.find((c) => c.id === ann.classId)?.name ?? "Class"}</span>}
                        <div className="flex gap-1 ml-auto">
                          {ann.targetRoles?.map((role) => (
                            <Badge key={role} variant={role === "student" ? "blue" : role === "parent" ? "emerald" : "gold"}>
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
          }
          {!loading && announcements.length === 0 && (
            <div className="glass rounded-2xl p-12 border border-dashed border-white/10 text-center">
              <Megaphone size={28} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm font-medium mb-1">No announcements yet</p>
              <p className="text-white/20 text-xs">Create your first school-wide announcement</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
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
              <div className="bg-nexus-surface border border-nexus-border rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-display font-bold text-lg">New Announcement</h2>
                  <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs font-medium block mb-1.5">Title *</label>
                    <input
                      type="text"
                      placeholder="Announcement title…"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-medium block mb-1.5">Message *</label>
                    <textarea
                      placeholder="Write your announcement…"
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm resize-none focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Target (optional)</label>
                      <select
                        value={form.classId}
                        onChange={(e) => setForm({ ...form, classId: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                      >
                        <option value="all" className="bg-nexus-surface">🏫 School-wide</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id} className="bg-nexus-surface">{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Pin to top?</label>
                      <button
                        onClick={() => setForm({ ...form, isPinned: !form.isPinned })}
                        className={`w-full py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                          form.isPinned ? "bg-gold-500/20 border-gold-500/30 text-gold-400" : "bg-white/5 border-white/10 text-white/50"
                        }`}
                      >
                        <Pin size={14} /> {form.isPinned ? "Pinned" : "Pin it"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-medium block mb-2">Visible to</label>
                    <div className="flex gap-2">
                      {(["student", "parent", "educator"] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => toggleRole(role)}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                            form.targetRoles.includes(role)
                              ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                              : "bg-white/5 border-white/10 text-white/30"
                          }`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={saving || !form.title || !form.body}
                    className="flex-1 py-2.5 rounded-xl bg-gold-500 text-nexus-bg text-sm font-semibold hover:bg-gold-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saved ? <><CheckCircle2 size={15} /> Published!</> : saving ? "Publishing…" : <><Megaphone size={15} /> Publish</>}
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
