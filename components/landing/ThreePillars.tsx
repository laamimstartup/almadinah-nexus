"use client";
import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, BarChart3 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const pillars = [
  {
    id: "student",
    icon: GraduationCap,
    arabic: "الطَّالِب",
    title: "Student Pathfinder",
    subtitle: "The Learning Experience",
    description:
      "Your personal Command Center. Track Missions, grow your constellation, and let the AI Mualim guide you 24/7 toward your leadership destiny.",
    features: [
      "Quest-Based Mission System",
      "Growth Constellation Map",
      "AI Mualim Tutor (GPT-4o)",
      "Leader's Portfolio Generator",
      "Tarbiyah Character Tracker",
    ],
    color: "gold",
    href: "/dashboard/student",
    cta: "Launch Command Center",
    bg: "from-gold-900/20 to-nexus-card",
    border: "border-gold-500/20",
    accentBg: "bg-gold-500/10",
    accentText: "text-gold-400",
    iconGradient: "from-gold-600 to-gold-400",
  },
  {
    id: "parent",
    icon: Users,
    arabic: "الْوَالِدَيْن",
    title: "Parent Horizon",
    subtitle: "The Transparency Portal",
    description:
      "Live pulse on your child's journey. Real-time progress, attendance, and leadership points — no more waiting for report cards.",
    features: [
      "Real-Time Pulse Dashboard",
      "Live Attendance Tracking",
      "Teacher Video Conferencing",
      "Instant Translation (Arabic/Spanish/French)",
      "Leadership Points Feed",
    ],
    color: "emerald",
    href: "/dashboard/parent",
    cta: "Open Horizon Portal",
    bg: "from-emerald-900/20 to-nexus-card",
    border: "border-emerald-500/20",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
    iconGradient: "from-emerald-700 to-emerald-400",
  },
  {
    id: "educator",
    icon: BarChart3,
    arabic: "الْمُعَلِّم",
    title: "Educator Command",
    subtitle: "The Analytics Suite",
    description:
      "Lead with data. AI-assisted grading, early warning systems, and a full analytics suite that lets you intervene before issues arise.",
    features: [
      "AI Grading Assistant",
      "Early Engagement Warning System",
      "Class Performance Analytics",
      "Curriculum Mission Builder",
      "Parent Communication Hub",
    ],
    color: "blue",
    href: "/dashboard/educator",
    cta: "Enter Command Suite",
    bg: "from-blue-900/20 to-nexus-card",
    border: "border-blue-500/20",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-400",
    iconGradient: "from-blue-700 to-blue-400",
  },
];

export default function ThreePillars() {
  return (
    <section id="platform" className="relative py-24 bg-nexus-bg overflow-hidden">
      <div className="absolute inset-0 mashrabiya-overlay opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6"
          >
            <BookOpen size={14} className="text-gold-400" />
            <span className="text-gold-400 text-sm font-medium">The Three Portals</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            One Platform.
            <br />
            <span className="text-gold-gradient">Three Worlds.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Designed for every stakeholder in a student&apos;s journey — from the learner to the parent to the guide.
          </motion.p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative glass rounded-3xl p-8 border ${pillar.border} bg-gradient-to-br ${pillar.bg} overflow-hidden`}
              >
                {/* Background glow */}
                <div
                  className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${pillar.accentBg}`}
                />

                {/* Arabic label */}
                <div className={`font-arabic text-4xl ${pillar.accentText} opacity-20 absolute top-6 right-6`}>
                  {pillar.arabic}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.iconGradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon size={26} className="text-white" />
                </div>

                {/* Content */}
                <div className={`text-xs font-semibold tracking-widest uppercase ${pillar.accentText} mb-2`}>
                  {pillar.subtitle}
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">{pillar.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{pillar.description}</p>

                {/* Feature list */}
                <ul className="space-y-2 mb-8">
                  {pillar.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${pillar.accentBg} border ${pillar.border.replace("border-", "border-")}`}>
                        <div className={`w-full h-full rounded-full ${pillar.accentText.replace("text-", "bg-")}`} />
                      </div>
                      <span className="text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={pillar.href}>
                  <Button
                    variant={pillar.color === "gold" ? "gold" : pillar.color === "emerald" ? "emerald" : "ghost"}
                    size="sm"
                    className="w-full"
                  >
                    {pillar.cta}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
