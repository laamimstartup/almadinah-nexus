"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative py-32 bg-nexus-bg overflow-hidden">
      {/* Geometric background */}
      <div className="absolute inset-0 mashrabiya-overlay opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold-500/8 rounded-full blur-[120px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      {/* Rotating geometric ornament */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.5"
          />
          <polygon
            points="50,15 58,38 83,38 63,53 71,77 50,62 29,77 37,53 17,38 42,38"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.3"
          />
        </svg>
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="font-arabic text-3xl text-gold-400/60 mb-4">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>

          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Child&apos;s
            <br />
            <span className="text-gold-gradient">Leadership Journey</span>
            <br />
            Starts Now.
          </h2>

          <p className="text-white/50 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the Al-Madinah Nexus. Where Islamic values meet world-class education, 
            and where every student is seen, supported, and inspired to lead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/login">
              <Button variant="gold" size="lg" icon={<Sparkles size={20} />} iconPosition="left">
                Enter the Nexus
              </Button>
            </Link>
            <Link href="https://almadinah-school-website.vercel.app" target="_blank">
              <Button variant="outline" size="lg" icon={<ArrowRight size={20} />}>
                Visit School Website
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              "NYS Approved Institution",
              "Pre-K through Grade 9",
              "Queens, New York City",
              "500+ Students Enrolled",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/30 text-sm">
                <div className="w-1 h-1 rounded-full bg-gold-500" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
