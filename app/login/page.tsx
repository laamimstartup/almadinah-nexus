"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Sparkles, Shield, GraduationCap, Users, BarChart3, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth, UserRole } from "@/lib/auth-context";
import { getUserDoc } from "@/lib/db/hooks";

const roles = [
  { id: "student",  label: "Student",  arabic: "الطَّالِب",    icon: GraduationCap, color: "gold",    href: "/dashboard/student" },
  { id: "parent",   label: "Parent",   arabic: "الْوَالِدَيْن", icon: Users,         color: "emerald", href: "/dashboard/parent" },
  { id: "educator", label: "Educator", arabic: "الْمُعَلِّم",   icon: BarChart3,     color: "blue",    href: "/dashboard/educator" },
  { id: "admin",    label: "Admin",    arabic: "الْإِدَارَة",   icon: Shield,        color: "purple",  href: "/dashboard/admin" },
];

const ROLE_HREF: Record<string, string> = {
  student:  "/dashboard/student",
  parent:   "/dashboard/parent",
  educator: "/dashboard/educator",
  admin:    "/dashboard/admin",
};

const colorMap: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  gold:    { border: "border-gold-500/40",    bg: "bg-gold-500/10",    text: "text-gold-400",    icon: "from-gold-600 to-gold-400" },
  emerald: { border: "border-emerald-500/40", bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "from-emerald-700 to-emerald-400" },
  blue:    { border: "border-blue-500/40",    bg: "bg-blue-500/10",    text: "text-blue-400",    icon: "from-blue-700 to-blue-400" },
  purple:  { border: "border-purple-500/40",  bg: "bg-purple-500/10",  text: "text-purple-400",  icon: "from-purple-700 to-purple-400" },
};

const greetings: Record<string, string> = {
  student:  `You are 4 steps away from your weekly Leadership Goal. Ready to lead?`,
  parent:   `Your child had an excellent week. 3 new Leadership Points earned.`,
  educator: `2 students need your attention today. Let's make a difference.`,
  admin:    `Welcome back. Your school dashboard is ready. Barak Allahu Feek.`,
};

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [mode, setMode]               = useState<AuthMode>("signin");
  const [selectedRole, setSelectedRole] = useState("student");
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [greeting, setGreeting]       = useState(false);
  const [greetName, setGreetName]     = useState("");

  const currentRole = roles.find((r) => r.id === selectedRole)!;
  const c = colorMap[currentRole.color];

  const friendlyError = (code: string) => {
    const map: Record<string, string> = {
      "auth/user-not-found":       "No account found with this email.",
      "auth/wrong-password":       "Incorrect password. Please try again.",
      "auth/invalid-credential":   "Invalid email or password.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password":        "Password must be at least 6 characters.",
      "auth/too-many-requests":    "Too many attempts. Please try again later.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    };
    return map[code] ?? "Something went wrong. Please try again.";
  };

  const redirectByRole = async (uid: string, fallbackRole: string) => {
    try {
      const userDoc = await getUserDoc(uid);
      const role = userDoc?.role ?? fallbackRole;
      router.push(ROLE_HREF[role] ?? ROLE_HREF.student);
    } catch {
      router.push(ROLE_HREF[fallbackRole] ?? ROLE_HREF.student);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const uid = mode === "signup"
        ? await signUp(email, password, name, selectedRole as UserRole)
        : await signIn(email, password);
      setGreetName(name || email.split("@")[0]);
      setGreeting(true);
      await new Promise((res) => setTimeout(res, 1800));
      await redirectByRole(uid, selectedRole);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(friendlyError(code));
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const uid = await signInWithGoogle(selectedRole as UserRole);
      setGreetName("");
      setGreeting(true);
      await new Promise((res) => setTimeout(res, 1800));
      await redirectByRole(uid, selectedRole);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(friendlyError(code));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-bg flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mashrabiya-overlay opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px]" />

      {/* Constellation dots */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            background: i % 2 === 0 ? "#C9A84C" : "#ffffff",
            opacity: 0.3,
          }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      <div className="relative w-full max-w-md mx-auto px-4 py-12">
        {/* Animated greeting overlay */}
        {greeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-nexus-bg/95 rounded-3xl backdrop-blur-xl"
          >
            <div className="text-center px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${c.icon} mx-auto mb-6 flex items-center justify-center shadow-gold-glow`}
              >
                <Sparkles size={32} className="text-white" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/50 text-sm mb-2"
              >
                Assalamu Alaikum,
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`font-display text-3xl font-bold ${c.text} mb-3`}
              >
                {greetName || email.split("@")[0] || "Ahlan"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-white/60 text-sm leading-relaxed"
              >
                {greetings[selectedRole]}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl rotate-45 group-hover:rotate-[60deg] transition-transform duration-300" />
              <div className="absolute inset-1 bg-nexus-bg rounded-lg rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center text-gold-400 font-bold z-10">م</span>
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-white leading-none">Al-Madinah</div>
              <div className="text-gold-400 text-xs font-medium tracking-widest uppercase">Nexus</div>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Enter the Nexus</h1>
          <p className="text-white/40 text-sm">Sign in to your Leadership Command Center</p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 border border-gold-500/10"
        >
          {/* Role selector */}
          <div className="mb-6">
            <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">I am a</p>
            <div className="grid grid-cols-4 gap-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const rc = colorMap[role.color];
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative rounded-xl p-3 flex flex-col items-center gap-1.5 border transition-all duration-200 ${
                      isActive
                        ? `${rc.border} ${rc.bg} ${rc.text}`
                        : "border-nexus-border bg-transparent text-white/40 hover:text-white/70 hover:border-white/20"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-medium">{role.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeRole"
                        className={`absolute inset-0 rounded-xl ${rc.border} border-2 pointer-events-none`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-nexus-border/40 rounded-xl">
            {(["signin", "signup"] as AuthMode[]).map((m) => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? `bg-gradient-to-r ${c.icon} text-white shadow-sm` : "text-white/40 hover:text-white"
                }`}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-widest">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmed Al-Rashid" required
                  className="w-full bg-nexus-border/50 border border-nexus-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold-500/50 transition-all" />
              </div>
            )}

            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@almadinah.edu"
                className="w-full bg-nexus-border/50 border border-nexus-border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-nexus-border/70 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-nexus-border/50 border border-nexus-border rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-nexus-border/70 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "signin" && (
              <div className="flex items-center justify-between text-xs">
                <span />
                <button type="button" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" variant="gold" size="lg" className="w-full"
              icon={loading ? undefined : <ArrowRight size={18} />} disabled={loading}>
              {loading ? "Entering the Nexus…" : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-nexus-border" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-nexus-border" />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl glass border border-nexus-border text-white/60 text-sm hover:text-white hover:border-white/20 transition-all disabled:opacity-40">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Security note */}
          <div className="mt-4 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10">
            <div className="flex items-center gap-2 text-gold-400/70 text-xs">
              <Shield size={12} />
              <span>Secured with Firebase Authentication · End-to-end encrypted</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-white/30 text-sm"
        >
          New to Al-Madinah?{" "}
          <Link href="/#admissions" className="text-gold-400 hover:text-gold-300 transition-colors">
            Apply for Admissions
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
