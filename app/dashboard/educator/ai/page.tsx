"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Brain, Send, Sparkles, RefreshCw, FileText, BarChart3, Zap } from "lucide-react";

interface Message { id: string; role: "user" | "ai"; content: string; }

const quickActions = [
  { label: "Grade this essay", icon: FileText, prompt: "Help me grade this student essay with detailed rubric feedback…" },
  { label: "Generate a quiz", icon: Zap, prompt: "Create a 10-question quiz on the Five Pillars of Islam for Grade 7…" },
  { label: "Analyze class data", icon: BarChart3, prompt: "Analyze the engagement trends for my Grade 7B class this month…" },
  { label: "Write lesson plan", icon: Sparkles, prompt: "Write a lesson plan for teaching the Hijrah to Grade 7 students…" },
];

const WELCOME = `Bismillah! I'm the Al-Madinah AI Teaching Assistant, ready to help you:\n\n• **Grade and give feedback** on student work with detailed rubrics\n• **Generate quizzes and assessments** aligned to your curriculum\n• **Write lesson plans** incorporating Islamic values\n• **Analyze class data** and identify learning trends\n• **Draft parent communications** professionally\n\nWhat can I assist you with today, Ustadh?`;

const initial: Message[] = [{ id: "1", role: "ai", content: WELCOME }];

async function streamChat(
  history: { role: "user" | "assistant"; content: string }[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history,
      role: "educator",
      model: "mistralai/mistral-7b-instruct",
    }),
  });
  if (!res.ok || !res.body) throw new Error(await res.text());
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) onChunk(delta);
      } catch {}
    }
  }
}

export default function EducatorAIPage() {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || typing) return;
    setError(null);

    const updatedMessages = [...messages, { id: Date.now().toString(), role: "user" as const, content }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);

    const aiId = (Date.now() + 1).toString();
    setMessages((p) => [...p, { id: aiId, role: "ai" as const, content: "" }]);

    try {
      const history = updatedMessages
        .filter((m) => m.id !== "1")
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        }));

      await streamChat(history, (chunk) => {
        setMessages((p) => p.map((m) => m.id === aiId ? { ...m, content: m.content + chunk } : m));
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    } catch {
      setError("Could not reach AI assistant. Please check your connection.");
      setMessages((p) => p.filter((m) => m.id !== aiId));
    } finally {
      setTyping(false);
    }
  };

  return (
    <DashboardShell role="educator" userName="Ustadh Yusuf" userInitial="Y" subtitle="AI Assistant">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="px-4 lg:px-8 py-5 border-b border-nexus-border glass flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg relative">
              <Brain size={22} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-nexus-surface" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg flex items-center gap-2">
                AI Teaching Assistant
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">GPT-4o</span>
              </h1>
              <p className="text-white/40 text-xs">Grading · Lesson Plans · Analytics · Parent Comms</p>
            </div>
          </div>
          <button onClick={() => setMessages(initial)} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Quick actions */}
        {messages.length === 1 && (
          <div className="px-4 lg:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-nexus-border">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.label} onClick={() => send(a.prompt)}
                  className="glass rounded-xl p-3 border border-purple-500/15 text-left hover:border-purple-500/40 hover:bg-purple-500/5 transition-all flex items-center gap-2 text-sm text-white/60 hover:text-white">
                  <Icon size={15} className="text-purple-400 flex-shrink-0" />
                  {a.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-5">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "ai" ? "bg-gradient-to-br from-purple-600 to-purple-400" : "bg-gradient-to-br from-blue-600 to-blue-400"}`}>
                  {msg.role === "ai" ? <Brain size={16} className="text-white" /> : <span className="text-white font-bold text-xs">Y</span>}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "ai" ? "glass border border-purple-500/15 text-white/85" : "bg-blue-500/20 border border-blue-500/30 text-white"}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center flex-shrink-0">
                <Brain size={16} className="text-white" />
              </div>
              <div className="glass border border-purple-500/15 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                {[0, 150, 300].map((d) => (
                  <motion.div key={d} className="w-2 h-2 rounded-full bg-purple-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: d / 1000 }} />
                ))}
              </div>
            </motion.div>
          )}
          {error && (
            <div className="text-red-400 text-xs text-center py-2">{error}</div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 lg:px-8 py-4 border-t border-nexus-border glass flex gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Ask the AI to grade, plan, or analyze…"
            className="flex-1 bg-nexus-border/50 border border-nexus-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 transition-all" />
          <button onClick={() => send()} disabled={!input.trim() || typing}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white hover:brightness-110 transition-all disabled:opacity-40">
            <Send size={18} />
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
