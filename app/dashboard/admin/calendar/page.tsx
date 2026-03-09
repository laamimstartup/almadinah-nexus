"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/db/hooks";
import { CalendarDays } from "lucide-react";

const SCHOOL_ID = "almadinah-queens";

const EVENT_TYPE_COLORS: Record<string, { text: string; bg: string; border: string; badge: "gold" | "emerald" | "blue" | "purple" }> = {
  academic:  { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   badge: "blue"    },
  islamic:   { text: "text-gold-400",   bg: "bg-gold-500/10",   border: "border-gold-500/20",   badge: "gold"    },
  community: { text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20",badge: "emerald" },
  exam:      { text: "text-rose-400",   bg: "bg-rose-500/5",    border: "border-rose-500/20",   badge: "purple"  },
  holiday:   { text: "text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-500/20",   badge: "emerald" },
  meeting:   { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", badge: "purple"  },
};

const EVENT_ICONS: Record<string, string> = {
  academic: "📚", islamic: "🌙", community: "🤝", exam: "📝", holiday: "🎉", meeting: "👥",
};

export default function AdminCalendarPage() {
  const { user } = useAuth();
  const { events, loading } = useEvents(SCHOOL_ID);
  const [filterType, setFilterType] = useState("all");

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const filtered = events.filter((e) => filterType === "all" || e.eventType === filterType);

  // Group by month
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, ev) => {
    const date = ev.startDate?.toDate?.();
    const key = date ? date.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Upcoming";
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Calendar">
      <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <CalendarDays size={22} className="text-blue-400" />
              School Calendar
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{events.length} events · 2025–2026</p>
          </div>
        </div>

        {/* Type filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "academic", "islamic", "exam", "community", "holiday", "meeting"].map((t) => {
            const c = EVENT_TYPE_COLORS[t] ?? { text: "text-white/50", bg: "", border: "" };
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  filterType === t
                    ? `${c.bg} ${c.border} ${c.text}`
                    : "glass border-white/10 text-white/40 hover:text-white"
                }`}
              >
                {t !== "all" ? EVENT_ICONS[t] + " " : ""}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Events by month */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl h-20 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([month, monthEvents]) => (
            <div key={month}>
              <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">{month}</h2>
              <div className="space-y-2">
                {monthEvents.map((ev, i) => {
                  const c = EVENT_TYPE_COLORS[ev.eventType] ?? EVENT_TYPE_COLORS.academic;
                  const date = ev.startDate?.toDate?.();
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`glass rounded-xl px-4 py-3.5 border ${c.border} flex items-center gap-4`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${c.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                        {date ? (
                          <>
                            <span className={`text-[10px] font-bold ${c.text} uppercase leading-none`}>
                              {date.toLocaleDateString("en-US", { month: "short" })}
                            </span>
                            <span className={`text-base font-display font-bold ${c.text} leading-none`}>
                              {date.getDate()}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg">{EVENT_ICONS[ev.eventType]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium text-sm">{ev.title}</span>
                          <Badge variant={c.badge}>{ev.eventType}</Badge>
                          {ev.isPublic && <span className="text-white/20 text-[10px]">Public</span>}
                        </div>
                        <p className="text-white/40 text-xs mt-0.5 truncate">{ev.description}</p>
                        {ev.location && <p className="text-white/25 text-[10px] mt-0.5">📍 {ev.location}</p>}
                      </div>
                      {ev.targetGrades && ev.targetGrades.length > 0 && (
                        <div className="flex-shrink-0 flex flex-wrap gap-1 max-w-[80px]">
                          {ev.targetGrades.slice(0, 2).map((g) => (
                            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">Gr.{g}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="glass rounded-2xl p-12 border border-dashed border-white/10 text-center">
            <CalendarDays size={28} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm font-medium mb-1">No events yet</p>
            <p className="text-white/20 text-xs">Events will appear here once seeded or created</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
