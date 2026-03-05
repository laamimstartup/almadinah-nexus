"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Brain, Send, Sparkles, BookOpen, Star, RefreshCw, Mic } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "mualim";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Can you explain the concept of Barakah in Islam?",
  "Help me solve this algebra equation: 2x + 5 = 15",
  "What are the Five Pillars of Islam?",
  "Explain photosynthesis in a simple way",
  "How can I improve my Arabic reading?",
  "Tell me about the leadership qualities of Prophet Muhammad ﷺ",
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "mualim",
    content:
      "Assalamu Alaikum wa Rahmatullahi wa Barakatuh, Ahmed! 🌟\n\nI am your AI Mualim — here to guide you through any subject, at any time. Whether it's Mathematics, Quran, Science, Arabic, or Islamic Studies, I am trained on Al-Madinah's full curriculum.\n\nHow can I help you grow today?",
    timestamp: new Date(),
  },
];

async function streamChat(
  history: { role: "user" | "assistant"; content: string }[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history,
      role: "student",
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

export default function MualimPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;
    setError(null);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = { id: aiMsgId, role: "mualim", content: "", timestamp: new Date() };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const history = updatedMessages
        .filter((m) => m.role !== "mualim" || m.id !== "1")
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        }));

      await streamChat(history, (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: m.content + chunk } : m))
        );
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    } catch {
      setError("Could not reach Al-Mualim. Please check your connection.");
      setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <DashboardShell role="student" userName="Ahmed Al-Rashid" userInitial="A" subtitle="AI Mualim">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="px-4 lg:px-8 py-5 border-b border-nexus-border glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg relative">
                <Brain size={22} className="text-white" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-nexus-surface" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg flex items-center gap-2">
                  AI Mualim
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    GPT-4o
                  </span>
                </h1>
                <p className="text-white/40 text-xs">Trained on Al-Madinah curriculum · Available 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setMessages(initialMessages)}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Suggested questions (show only at start) */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
            >
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="glass rounded-xl p-3 border border-white/5 text-left text-white/60 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 text-sm transition-all duration-200 flex items-start gap-2"
                >
                  <Sparkles size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "mualim"
                    ? "bg-gradient-to-br from-purple-600 to-purple-400"
                    : "bg-gradient-to-br from-gold-600 to-gold-400"
                }`}>
                  {msg.role === "mualim" ? (
                    <Brain size={16} className="text-white" />
                  ) : (
                    <span className="text-white font-bold text-xs">A</span>
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "mualim"
                      ? "glass border border-purple-500/15 text-white/85"
                      : "bg-gold-500/20 border border-gold-500/30 text-white"
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-white/20 text-[10px] px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center flex-shrink-0">
                <Brain size={16} className="text-white" />
              </div>
              <div className="glass border border-purple-500/15 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <motion.div
                    key={delay}
                    className="w-2 h-2 rounded-full bg-purple-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: delay / 1000 }}
                  />
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
        <div className="px-4 lg:px-8 py-4 border-t border-nexus-border glass">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask your Mualim anything… (Enter to send)"
                rows={1}
                className="w-full bg-nexus-border/50 border border-nexus-border rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:border-purple-500/50 transition-all duration-200 min-h-[48px] max-h-[120px]"
                style={{ height: "auto" }}
              />
              <button className="absolute right-3 bottom-3 text-white/20 hover:text-purple-400 transition-colors">
                <Mic size={16} />
              </button>
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-white/20 text-[10px] mt-2 text-center">
            Al-Madinah AI Mualim · Powered by OpenRouter · Guided by Islamic values
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
