"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Target, Star, BookOpen, Brain, Trophy, Users, BarChart3,
  Bell, Settings, LogOut, Menu, ChevronRight, Zap, Heart,
  Shield, GraduationCap, CalendarDays, Megaphone, UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  role: "student" | "parent" | "educator" | "admin";
  userName: string;
  userInitial: string;
  subtitle?: string;
}

const studentNav: NavItem[] = [
  { label: "Command Center", icon: LayoutDashboard, href: "/dashboard/student" },
  { label: "My Missions",    icon: Target,          href: "/dashboard/student/missions", badge: "3" },
  { label: "Growth Map",     icon: Star,            href: "/dashboard/student/growth" },
  { label: "Tarbiyah",       icon: Heart,           href: "/dashboard/student/tarbiyah" },
  { label: "AI Mualim",      icon: Brain,           href: "/dashboard/student/mualim", badge: "AI" },
  { label: "Portfolio",      icon: Trophy,          href: "/dashboard/student/portfolio" },
  { label: "Courses",        icon: BookOpen,        href: "/dashboard/student/courses" },
];

const parentNav: NavItem[] = [
  { label: "Pulse Dashboard", icon: LayoutDashboard, href: "/dashboard/parent" },
  { label: "Progress Feed",   icon: Zap,             href: "/dashboard/parent/progress" },
  { label: "Attendance",      icon: Target,          href: "/dashboard/parent/attendance" },
  { label: "Messages",        icon: Users,           href: "/dashboard/parent/messages", badge: "2" },
  { label: "Portfolio",       icon: Trophy,          href: "/dashboard/parent/portfolio" },
];

const educatorNav: NavItem[] = [
  { label: "Command Suite", icon: LayoutDashboard, href: "/dashboard/educator" },
  { label: "My Classes",   icon: BookOpen,         href: "/dashboard/educator/classes" },
  { label: "Analytics",    icon: BarChart3,        href: "/dashboard/educator/analytics" },
  { label: "AI Assistant", icon: Brain,            href: "/dashboard/educator/ai", badge: "AI" },
  { label: "Students",     icon: Users,            href: "/dashboard/educator/students" },
  { label: "Messages",     icon: Target,           href: "/dashboard/educator/messages", badge: "5" },
];

const adminNav: NavItem[] = [
  { label: "Overview",     icon: LayoutDashboard, href: "/dashboard/admin" },
  { label: "Students",     icon: GraduationCap,   href: "/dashboard/admin/students" },
  { label: "Classes",      icon: BookOpen,        href: "/dashboard/admin/classes" },
  { label: "Staff",        icon: Users,           href: "/dashboard/admin/staff" },
  { label: "Enrollment",   icon: UserPlus,        href: "/dashboard/admin/enrollment" },
  { label: "Programs",     icon: Star,            href: "/dashboard/admin/programs" },
  { label: "Announcements",icon: Megaphone,       href: "/dashboard/admin/announcements" },
  { label: "Calendar",     icon: CalendarDays,    href: "/dashboard/admin/calendar" },
  { label: "Settings",     icon: Shield,          href: "/dashboard/admin/settings" },
];

const navByRole = { student: studentNav, parent: parentNav, educator: educatorNav, admin: adminNav };

const roleColors = {
  student:  { accent: "text-gold-400",    border: "border-gold-500/20",    bg: "bg-gold-500/10",    gradient: "from-gold-600 to-gold-400" },
  parent:   { accent: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10", gradient: "from-emerald-700 to-emerald-400" },
  educator: { accent: "text-blue-400",    border: "border-blue-500/20",    bg: "bg-blue-500/10",    gradient: "from-blue-700 to-blue-400" },
  admin:    { accent: "text-purple-400",  border: "border-purple-500/20",  bg: "bg-purple-500/10",  gradient: "from-purple-700 to-purple-400" },
};

export default function DashboardShell({ children, role, userName, userInitial, subtitle }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = navByRole[role];
  const rc = roleColors[role];

  const displayName = user?.displayName || userName;
  const displayInitial = user?.displayName?.[0]?.toUpperCase() || userInitial;

  const handleSignOut = async () => {
    await logOut();
    router.push("/login");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-nexus-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl rotate-45" />
            <div className="absolute inset-1 bg-nexus-surface rounded-lg rotate-45" />
            <span className="absolute inset-0 flex items-center justify-center text-gold-400 font-bold text-xs z-10">م</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-none">Al-Madinah</div>
            <div className="text-gold-400 text-[10px] font-medium tracking-widest uppercase">Nexus</div>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className={`mx-4 mt-4 p-3 rounded-xl border ${rc.border} ${rc.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white font-bold text-sm`}>
            {displayInitial}
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{displayName}</div>
            <div className={`text-xs capitalize ${rc.accent}`}>{role} Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                isActive
                  ? `${rc.bg} ${rc.border} border ${rc.accent} font-medium`
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={17} className={isActive ? rc.accent : "text-inherit"} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  item.badge === "AI" ? "bg-purple-500/20 text-purple-400" : `${rc.bg} ${rc.accent}`
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-nexus-border space-y-1">
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={17} />
          Settings
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-nexus-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-nexus-surface border-r border-nexus-border flex-col">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-nexus-surface border-r border-nexus-border z-50 lg:hidden flex flex-col"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-nexus-surface/80 backdrop-blur border-b border-nexus-border px-4 lg:px-8 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <Menu size={20} />
            </button>
            {subtitle && (
              <div className="hidden sm:flex items-center gap-2 text-white/40 text-sm">
                <span>Dashboard</span>
                <ChevronRight size={14} />
                <span className="text-white/70">{subtitle}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold-400" />
            </button>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white font-bold text-xs`}>
              {displayInitial}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
