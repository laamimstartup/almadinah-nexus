"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { MessageSquare, Send, Video, Clock, CheckCheck } from "lucide-react";

const conversations = [
  {
    id: "1",
    teacher: "Ustadh Yusuf Khalid",
    subject: "Islamic Studies & Math",
    avatar: "Y",
    color: "gold",
    lastMessage: "Ahmed did an excellent job on the Badr project. Very proud of his research.",
    time: "2h ago",
    unread: 1,
    messages: [
      { role: "teacher", text: "Assalamu Alaikum Sister Fatima, I wanted to share that Ahmed has been exceptionally engaged this week.", time: "10:30 AM" },
      { role: "parent", text: "Wa Alaikum Assalam Ustadh Yusuf! JazakAllahu Khayran for the update.", time: "11:00 AM" },
      { role: "teacher", text: "Ahmed did an excellent job on the Badr project. Very proud of his research.", time: "2:00 PM" },
    ],
  },
  {
    id: "2",
    teacher: "Ms. Aisha Rahman",
    subject: "English Language Arts",
    avatar: "A",
    color: "emerald",
    lastMessage: "Just a reminder — the Macbeth essay is due tomorrow. Ahmed is 80% complete.",
    time: "Yesterday",
    unread: 1,
    messages: [
      { role: "teacher", text: "Just a reminder — the Macbeth essay is due tomorrow. Ahmed is 80% complete.", time: "3:45 PM" },
    ],
  },
  {
    id: "3",
    teacher: "Br. Hassan Ali",
    subject: "Arabic Language",
    avatar: "H",
    color: "blue",
    lastMessage: "Great progress on conversational Arabic this month!",
    time: "3 days ago",
    unread: 0,
    messages: [
      { role: "teacher", text: "Great progress on conversational Arabic this month!", time: "Mon" },
      { role: "parent", text: "MashaAllah! He has been practicing at home too.", time: "Mon" },
    ],
  },
];

const colorMap: Record<string, { gradient: string; border: string; bg: string }> = {
  gold:    { gradient: "from-gold-600 to-gold-400",     border: "border-gold-500/30",    bg: "bg-gold-500/10" },
  emerald: { gradient: "from-emerald-700 to-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  blue:    { gradient: "from-blue-700 to-blue-400",     border: "border-blue-500/30",    bg: "bg-blue-500/10" },
};

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("1");
  const [input, setInput] = useState("");
  const active = conversations.find((c) => c.id === activeId)!;
  const c = colorMap[active.color];

  return (
    <DashboardShell role="parent" userName="Sister Fatima" userInitial="F" subtitle="Messages">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-nexus-border bg-nexus-surface/50 flex flex-col">
          <div className="px-4 py-4 border-b border-nexus-border">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" />
              Teacher Messages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const cc = colorMap[conv.color];
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full text-left p-4 border-b border-nexus-border hover:bg-white/3 transition-colors ${activeId === conv.id ? "bg-white/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cc.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-white text-sm font-medium truncate">{conv.teacher}</span>
                        <span className="text-white/30 text-[10px] flex-shrink-0 ml-2">{conv.time}</span>
                      </div>
                      <div className="text-white/40 text-xs truncate">{conv.subject}</div>
                      <div className="text-white/50 text-xs mt-1 truncate">{conv.lastMessage}</div>
                      {conv.unread > 0 && (
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                          {conv.unread} new
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className={`px-6 py-4 border-b border-nexus-border glass flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                {active.avatar}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{active.teacher}</div>
                <div className="text-white/40 text-xs">{active.subject}</div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors">
              <Video size={15} /> Schedule Call
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {active.messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex gap-3 ${msg.role === "parent" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 bg-gradient-to-br ${msg.role === "teacher" ? c.gradient : "from-emerald-700 to-emerald-400"}`}>
                  {msg.role === "teacher" ? active.avatar : "F"}
                </div>
                <div className={`max-w-[70%] flex flex-col gap-1 ${msg.role === "parent" ? "items-end" : "items-start"}`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm ${msg.role === "teacher" ? `glass border ${c.border} text-white/80` : "bg-emerald-500/20 border border-emerald-500/30 text-white"}`}>
                    {msg.text}
                  </div>
                  <span className="text-white/25 text-[10px] flex items-center gap-1 px-1">
                    <Clock size={9} /> {msg.time}
                    {msg.role === "parent" && <CheckCheck size={11} className="text-emerald-400" />}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-nexus-border glass">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${active.teacher}…`}
                className="flex-1 bg-nexus-border/50 border border-nexus-border rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
              />
              <button
                disabled={!input.trim()}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-400 flex items-center justify-center text-white hover:brightness-110 transition-all disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
