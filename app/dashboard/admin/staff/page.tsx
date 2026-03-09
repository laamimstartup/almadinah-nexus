"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { useAllStaff } from "@/lib/db/hooks";
import { Users, Search, BookOpen, Shield, HeartHandshake } from "lucide-react";

const SCHOOL_ID = "almadinah-queens";

const DEPT_COLORS: Record<string, string> = {
  "Islamic Studies": "text-gold-400 bg-gold-500/10 border-gold-500/20",
  "STEM":            "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "Arabic Language": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Administration":  "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Leadership":      "text-rose-400 bg-rose-500/10 border-rose-500/20",
  "Support":         "text-teal-400 bg-teal-500/10 border-teal-500/20",
};

export default function AdminStaffPage() {
  const { user } = useAuth();
  const { staff, loading } = useAllStaff(SCHOOL_ID);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const filtered = staff.filter((s) => {
    const matchSearch = !search || s.uid.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole === "all" || s.role === filterRole;
    return matchSearch && matchRole;
  });

  const RoleIcon = ({ role }: { role: string }) => {
    if (role === "admin")    return <Shield size={14} className="text-purple-400" />;
    if (role === "support")  return <HeartHandshake size={14} className="text-teal-400" />;
    return <BookOpen size={14} className="text-blue-400" />;
  };

  // Demo staff from seed (shown when Firestore staff collection is empty)
  const DEMO_STAFF = [
    { uid: "educator-yusuf-001", role: "educator", title: "Ustadh", department: "Islamic Studies", subjectsTaught: ["Quran & Tajweed", "Islamic Studies", "Arabic Language"], classIds: ["grade-7a-2026"], isActive: true, hireDate: null },
  ];

  const displayStaff = staff.length > 0 ? filtered : DEMO_STAFF;

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Staff">
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Users size={22} className="text-gold-400" />
              Staff Directory
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{staff.length > 0 ? staff.length : "—"} staff members</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Educators",  count: staff.filter((s) => s.role === "educator").length  || 1,  color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"  },
            { label: "Admin",      count: staff.filter((s) => s.role === "admin").length     || 1,  color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20"},
            { label: "Support",    count: staff.filter((s) => s.role === "support").length   || 0,  color: "text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-500/20"  },
          ].map((item) => (
            <div key={item.label} className={`glass rounded-2xl p-4 border ${item.border}`}>
              <div className={`text-2xl font-display font-bold ${item.color}`}>{item.count}</div>
              <div className="text-white/50 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search staff…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>
          {["all","educator","admin","support"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filterRole === r ? "bg-gold-500/20 text-gold-400 border border-gold-500/30" : "glass border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Staff Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl h-36 animate-pulse border border-white/5" />
              ))
            : displayStaff.map((s, i) => {
                const deptClass = DEPT_COLORS[s.department ?? ""] ?? "text-white/50 bg-white/5 border-white/10";
                return (
                  <motion.div
                    key={s.uid}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                        {s.uid.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate">{s.title ? `${s.title} ` : ""}{s.uid.replace(/-\d+$/, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <RoleIcon role={s.role} />
                          <span className="text-white/40 text-xs capitalize">{s.role}</span>
                        </div>
                      </div>
                    </div>
                    {s.department && (
                      <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border font-medium ${deptClass}`}>
                        {s.department}
                      </span>
                    )}
                    {s.subjectsTaught?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {s.subjectsTaught.slice(0, 3).map((sub) => (
                          <span key={sub} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{sub}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-white/20 text-[10px]">{s.classIds?.length ?? 0} class{s.classIds?.length !== 1 ? "es" : ""}</span>
                      <span className={`text-[10px] font-medium ${s.isActive ? "text-emerald-400" : "text-red-400"}`}>
                        {s.isActive ? "● Active" : "● Inactive"}
                      </span>
                    </div>
                  </motion.div>
                );
              })
          }
        </div>

        {!loading && staff.length === 0 && (
          <div className="glass rounded-2xl p-10 border border-dashed border-white/10 text-center">
            <Users size={28} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm font-medium mb-1">Staff directory is empty</p>
            <p className="text-white/20 text-xs">Staff members will appear here once added via the seed script or Firebase Auth</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
