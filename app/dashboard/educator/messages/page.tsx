"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { MessageSquare, Send, CheckCheck, Clock, Users } from "lucide-react";

const conversations = [
  {
    id: "1", name: "Sister Fatima Al-Hassan", role: "Parent of Ahmed (7A)", avatar: "F",
    color: "gold", time: "2h ago", unread: 1,
    messages: [
      { role: "parent", text: "Assalamu Alaikum Ustadh Yusuf! How is Ahmed doing this week?", time: "9:30 AM" },
      { role: "teacher", text: "Wa Alaikum Assalam Sister Fatima! Ahmed has been exceptional. His Badr project was outstanding — one of the best in the class.", time: "10:15 AM" },
      { role: "parent", text: "MashaAllah! He worked very hard on it. We are so proud.", time: "10:45 AM" },
    ],
  },
  {
    id: "2", name: "Br. Khalid Siddiqui", role: "Parent of Maryam (7A)", avatar: "K",
    color: "emerald", time: "Yesterday", unread: 2,
    messages: [
      { role: "parent", text: "JazakAllahu Khayran for the progress report, Ustadh.", time: "Mon 3PM" },
      { role: "parent", text: "Is there anything Maryam should focus on for the upcoming exam?", time: "Mon 3:02PM" },
    ],
  },
  {
    id: "3", name: "Omar Hassan (Student)", role: "Grade 7B Student", avatar: "O",
    color: "blue", time: "2 days ago", unread: 0,
    messages: [
      { role: "student", text: "Ustadh, can you explain the concept we covered on Monday about the Hijrah again? I'm confused.", time: "Sat" },
      { role: "teacher", text: "Of course Omar! Let's break it down. The Hijrah was the migration from Makkah to Madinah in 622 CE. It marks the beginning of the Islamic calendar because it was a turning point — from persecution to building a new community.", time: "Sat" },
      { role: "student", text: "JazakAllahu Khayran Ustadh! That makes a lot more sense now.", time: "Sat" },
    ],
  },
  {
    id: "4", name: "Ms. Aisha Rahman", role: "Fellow Educator · ELA", avatar: "A",
    color: "purple", time: "3 days ago", unread: 0,
    messages: [
      { role: "other", text: "Yusuf, want to co-plan the end-of-year leadership symposium together? I think our classes could collaborate.", time: "Fri" },
      { role: "teacher", text: "Great idea! Let's schedule a planning session. I'm free Thursday after Dhuhr.", time: "Fri" },
    ],
  },
];

const colorMap: Record<string, { gradient: string; border: string }> = {
  gold:   { gradient: "from-gold-600 to-gold-400",     border: "border-gold-500/30" },
  emerald:{ gradient: "from-emerald-700 to-emerald-400", border: "border-emerald-500/30" },
  blue:   { gradient: "from-blue-700 to-blue-400",     border: "border-blue-500/30" },
  purple: { gradient: "from-purple-700 to-purple-400", border: "border-purple-500/30" },
};

export default function EducatorMessagesPage() {
  const [activeId, setActiveId] = useState("1");
  const [input, setInput]       = useState("");
  const active = conversations.find((c) => c.id === activeId)!;
  const c = colorMap[active.color];
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <DashboardShell role="educator" userName="Ustadh Yusuf" userInitial="Y" subtitle="Messages">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-nexus-border bg-nexus-surface/50 flex flex-col">
          <div className="px-4 py-4 border-b border-nexus-border flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              Messages
            </h2>
            {totalUnread > 0 && (
              <Badge variant="gold">{totalUnread} new</Badge>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const cc = colorMap[conv.color];
              return (
                <button key={conv.id} onClick={() => setActiveId(conv.id)}
                  className={`w-full text-left p-4 border-b border-nexus-border hover:bg-white/3 transition-colors ${activeId === conv.id ? "bg-white/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cc.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative`}>
                      {conv.avatar}
                      {conv.unread > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-400 text-nexus-bg text-[9px] font-bold flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="text-white text-sm font-medium truncate">{conv.name}</span>
                        <span className="text-white/30 text-[10px] flex-shrink-0 ml-1">{conv.time}</span>
                      </div>
                      <div className="text-white/40 text-xs truncate">{conv.role}</div>
                      <div className="text-white/40 text-xs mt-1 truncate">
                        {conv.messages[conv.messages.length - 1].text}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Compose broadcast */}
          <div className="p-4 border-t border-nexus-border">
            <button className="w-full py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-colors">
              <Users size={15} /> Broadcast to All Parents
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-nexus-border glass flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {active.avatar}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{active.name}</div>
              <div className="text-white/40 text-xs">{active.role}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {active.messages.map((msg, i) => {
              const isTeacher = msg.role === "teacher";
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex gap-3 ${isTeacher ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 bg-gradient-to-br ${isTeacher ? "from-blue-600 to-blue-400" : c.gradient}`}>
                    {isTeacher ? "Y" : active.avatar}
                  </div>
                  <div className={`max-w-[70%] flex flex-col gap-1 ${isTeacher ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm ${isTeacher ? `bg-blue-500/20 border border-blue-500/30 text-white` : `glass border ${c.border} text-white/80`}`}>
                      {msg.text}
                    </div>
                    <span className="text-white/25 text-[10px] flex items-center gap-1 px-1">
                      <Clock size={9} /> {msg.time}
                      {isTeacher && <CheckCheck size={11} className="text-blue-400" />}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-nexus-border glass flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { setInput(""); } }}
              placeholder={`Reply to ${active.name}…`}
              className="flex-1 bg-nexus-border/50 border border-nexus-border rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <button disabled={!input.trim()}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 flex items-center justify-center text-white hover:brightness-110 transition-all disabled:opacity-40 flex-shrink-0">
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
