"use client";
import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { useSchool } from "@/lib/db/hooks";
import {
  Shield, School, Bell, Brain, BookOpen,
  Heart, Star, Code, CheckCircle2, Save
} from "lucide-react";

const SCHOOL_ID = "almadinah-queens";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { school, loading } = useSchool(SCHOOL_ID);

  const firstName   = user?.displayName?.split(" ")[0] ?? "Admin";
  const userInitial = (user?.displayName ?? "A")[0].toUpperCase();

  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    tarbiyahEnabled:           true,
    missionsEnabled:           true,
    aiMualimEnabled:           true,
    kidsCodeGiftEnabled:       true,
    leadershipProgramEnabled:  true,
    leadershipProgramMinGrade: 5,
    parentNotificationsEnabled:true,
    attendanceReminderTime:    "08:30",
    currentAcademicYear:       "2025-2026",
    maxClassSize:              18,
  });

  const handleSave = async () => {
    // Would write to adminSettings/{schoolId} in production
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange, label, description, icon: Icon, color = "emerald" }: {
    value: boolean; onChange: (v: boolean) => void; label: string; description: string;
    icon: React.ElementType; color?: string;
  }) => (
    <div className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={`text-${color}-400`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium">{label}</div>
        <div className="text-white/40 text-xs mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${value ? "bg-emerald-500" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );

  return (
    <DashboardShell role="admin" userName={firstName} userInitial={userInitial} subtitle="Settings">
      <div className="p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Shield size={22} className="text-purple-400" />
            Platform Settings
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Configure school-wide platform features and behaviour</p>
        </div>

        {/* School Info */}
        <div>
          <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <School size={13} /> School Information
          </h2>
          <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
            {loading ? (
              <div className="h-20 animate-pulse bg-white/5 rounded-xl" />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-medium block mb-1.5">School Name</label>
                    <input
                      type="text"
                      value={school?.name ?? "Al-Madinah Islamic School"}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium block mb-1.5">Phone</label>
                    <input
                      type="text"
                      value={school?.phone ?? "(347) 507-0167"}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/60 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-medium block mb-1.5">Current Academic Year</label>
                    <select
                      value={settings.currentAcademicYear}
                      onChange={(e) => setSettings({ ...settings, currentAcademicYear: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    >
                      <option className="bg-nexus-surface">2024-2025</option>
                      <option className="bg-nexus-surface">2025-2026</option>
                      <option className="bg-nexus-surface">2026-2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium block mb-1.5">Max Class Size</label>
                    <input
                      type="number"
                      value={settings.maxClassSize}
                      onChange={(e) => setSettings({ ...settings, maxClassSize: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-medium block mb-1.5">Attendance Reminder Time</label>
                  <input
                    type="time"
                    value={settings.attendanceReminderTime}
                    onChange={(e) => setSettings({ ...settings, attendanceReminderTime: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Platform Features */}
        <div>
          <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Star size={13} /> Platform Features
          </h2>
          <div className="space-y-2">
            <Toggle
              value={settings.tarbiyahEnabled}
              onChange={(v) => setSettings({ ...settings, tarbiyahEnabled: v })}
              label="Tarbiyah System"
              description="Daily Islamic character tracking for all students"
              icon={Heart}
              color="gold"
            />
            <Toggle
              value={settings.missionsEnabled}
              onChange={(v) => setSettings({ ...settings, missionsEnabled: v })}
              label="Missions"
              description="Gamified assignment and learning missions"
              icon={BookOpen}
              color="emerald"
            />
            <Toggle
              value={settings.aiMualimEnabled}
              onChange={(v) => setSettings({ ...settings, aiMualimEnabled: v })}
              label="AI Mualim"
              description="AI-powered tutoring assistant for students"
              icon={Brain}
              color="purple"
            />
            <Toggle
              value={settings.kidsCodeGiftEnabled}
              onChange={(v) => setSettings({ ...settings, kidsCodeGiftEnabled: v })}
              label="KidsCodeGift Integration"
              description="Exclusive coding platform access for all students"
              icon={Code}
              color="blue"
            />
            <Toggle
              value={settings.leadershipProgramEnabled}
              onChange={(v) => setSettings({ ...settings, leadershipProgramEnabled: v })}
              label="Leadership Academy"
              description={`Available from Grade ${settings.leadershipProgramMinGrade}+`}
              icon={Star}
              color="rose"
            />
            {settings.leadershipProgramEnabled && (
              <div className="glass rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3">
                <span className="text-white/50 text-sm">Leadership starts from Grade</span>
                <select
                  value={settings.leadershipProgramMinGrade}
                  onChange={(e) => setSettings({ ...settings, leadershipProgramMinGrade: parseInt(e.target.value) })}
                  className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none"
                >
                  {[3,4,5,6,7].map((g) => (
                    <option key={g} value={g} className="bg-nexus-surface">{g}</option>
                  ))}
                </select>
                <span className="text-white/30 text-xs">(Website: Grade 5+)</span>
              </div>
            )}
            <Toggle
              value={settings.parentNotificationsEnabled}
              onChange={(v) => setSettings({ ...settings, parentNotificationsEnabled: v })}
              label="Parent Notifications"
              description="Real-time alerts for parents on student activity"
              icon={Bell}
              color="teal"
            />
          </div>
        </div>

        {/* Grading Scale */}
        <div>
          <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Grading Scale (NYS)</h2>
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-2.5 text-white/40 text-xs font-medium">Grade</th>
                  <th className="text-left px-4 py-2.5 text-white/40 text-xs font-medium">Min %</th>
                  <th className="text-left px-4 py-2.5 text-white/40 text-xs font-medium">GPA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { grade: "A+", min: 97, gpa: 4.0 },
                  { grade: "A",  min: 93, gpa: 4.0 },
                  { grade: "A-", min: 90, gpa: 3.7 },
                  { grade: "B+", min: 87, gpa: 3.3 },
                  { grade: "B",  min: 83, gpa: 3.0 },
                  { grade: "B-", min: 80, gpa: 2.7 },
                  { grade: "C+", min: 77, gpa: 2.3 },
                  { grade: "C",  min: 73, gpa: 2.0 },
                ].map((row, i) => (
                  <tr key={row.grade} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                    <td className="px-4 py-2.5 text-white font-semibold">{row.grade}</td>
                    <td className="px-4 py-2.5 text-white/50">{row.min}%</td>
                    <td className="px-4 py-2.5 text-white/50">{row.gpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-all"
          >
            {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
