"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Student Pathfinder", href: "/dashboard/student" },
    { label: "Parent Horizon", href: "/dashboard/parent" },
    { label: "Educator Command", href: "/dashboard/educator" },
    { label: "AI Mualim Tutor", href: "/dashboard/student/mualim" },
  ],
  Programs: [
    { label: "NYS Core Curriculum", href: "/#programs" },
    { label: "Quran & Islamic Studies", href: "/#programs" },
    { label: "STEM Excellence", href: "/#programs" },
    { label: "Leadership Development", href: "/#programs" },
  ],
  School: [
    { label: "About Al-Madinah", href: "/#about" },
    { label: "Admissions", href: "/#admissions" },
    { label: "Events", href: "/#events" },
    { label: "Contact", href: "/#contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-nexus-surface border-t border-nexus-border overflow-hidden">
      {/* Geometric overlay */}
      <div className="absolute inset-0 mashrabiya-overlay opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl rotate-45" />
                <div className="absolute inset-1 bg-nexus-surface rounded-lg rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-gold-400 font-bold text-base z-10">
                  م
                </span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">Al-Madinah</div>
                <div className="text-gold-400 text-xs font-medium tracking-widest uppercase mt-0.5">
                  Nexus Platform
                </div>
              </div>
            </div>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              The Leadership Intelligence Platform where Islamic values meet world-class education. 
              Building tomorrow's leaders, today.
            </p>

            <div className="font-arabic text-gold-400/70 text-lg mb-2">
              طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
            </div>
            <p className="text-white/30 text-xs italic">
              "Seeking knowledge is an obligation upon every Muslim." — Prophet Muhammad ﷺ
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin size={14} className="text-gold-400 flex-shrink-0" />
                <span>Queens, New York City, NY</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={14} className="text-gold-400 flex-shrink-0" />
                <span>(718) 555-0190</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={14} className="text-gold-400 flex-shrink-0" />
                <span>nexus@almadinah.edu</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-gold-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      {link.label}
                      <ExternalLink
                        size={11}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="geo-divider mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2025 Al-Madinah School, Queens. All rights reserved. NYS Approved Institution.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">Terms of Use</Link>
            <Link href="https://almadinah-school-website.vercel.app" target="_blank" className="text-white/30 hover:text-gold-400 text-xs transition-colors flex items-center gap-1">
              School Website <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
