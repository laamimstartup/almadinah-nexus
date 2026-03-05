"use client";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Fatima Al-Hassan",
    role: "Parent of Grade 7 Student",
    avatar: "F",
    color: "gold",
    quote:
      "The Horizon portal changed everything. I used to wait for report cards — now I see my son's growth in real time. When his engagement dropped one week, his teacher reached out before I even noticed.",
    stars: 5,
  },
  {
    name: "Ustadh Yusuf Khalid",
    role: "Lead Educator, Islamic Studies",
    avatar: "Y",
    color: "emerald",
    quote:
      "The AI grading assistant cut my feedback time in half. But more importantly, the early warning system flagged three students who were quietly struggling. We intervened and turned it around.",
    stars: 5,
  },
  {
    name: "Maryam Siddiqui",
    role: "Grade 8 Student",
    avatar: "M",
    color: "blue",
    quote:
      "I used to hate doing homework. Now I&apos;m completing Missions and watching my constellation light up. And when I talk to the Mualim at 11pm about a hard math problem, it actually explains it the way I understand.",
    stars: 5,
  },
  {
    name: "Dr. Amira Osman",
    role: "School Principal",
    avatar: "A",
    color: "purple",
    quote:
      "We set out to build something that could stand alongside Avenues and Riverdale — not just as a school, but as a platform. The Nexus is that platform. It represents who we are.",
    stars: 5,
  },
];

const colorMap: Record<string, { avatar: string; border: string; star: string }> = {
  gold:   { avatar: "from-gold-600 to-gold-400",     border: "border-gold-500/20",   star: "text-gold-400" },
  emerald:{ avatar: "from-emerald-700 to-emerald-400", border: "border-emerald-500/20", star: "text-emerald-400" },
  blue:   { avatar: "from-blue-700 to-blue-400",     border: "border-blue-500/20",   star: "text-blue-400" },
  purple: { avatar: "from-purple-700 to-purple-400", border: "border-purple-500/20", star: "text-purple-400" },
};

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-nexus-surface overflow-hidden">
      <div className="absolute inset-0 mashrabiya-overlay opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6"
          >
            <Quote size={14} className="text-gold-400" />
            <span className="text-gold-400 text-sm font-medium">Families Who Trust Us</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            The Community
            <br />
            <span className="text-gold-gradient">Has Spoken.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => {
            const c = colorMap[t.color];
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`glass rounded-2xl p-7 border ${c.border} relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                  <Quote size={96} className="text-white" />
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={14} className={`${c.star} fill-current`} />
                  ))}
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.avatar} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
