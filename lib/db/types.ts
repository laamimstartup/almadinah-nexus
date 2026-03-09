import { Timestamp } from "firebase/firestore";

// ─── Core role type ────────────────────────────────────────────────────────
export type UserRole = "student" | "parent" | "educator" | "admin";

// ─── users/{uid} ──────────────────────────────────────────────────────────
export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string | null;
  schoolId?: string;
  // parent-specific: links a parent to their child
  childUid?: string;
  // educator-specific
  classIds?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ─── schools/{schoolId} ───────────────────────────────────────────────────
export interface SchoolDoc {
  name: string;
  address: string;
  city: string;
  state: string;
  principalUid?: string;
  createdAt: Timestamp;
}

// ─── classes/{classId} ────────────────────────────────────────────────────
export interface ClassDoc {
  name: string;           // e.g. "Grade 7A"
  grade: string;          // e.g. "7"
  schoolId: string;
  educatorUid: string;
  educatorName: string;
  subjects: string[];     // e.g. ["Mathematics", "Islamic Studies"]
  academicYear: string;   // e.g. "2025-2026"
  studentUids: string[];
  createdAt: Timestamp;
}

// ─── missions/{missionId} ─────────────────────────────────────────────────
export type MissionStatus = "active" | "completed" | "locked";
export type MissionColor  = "gold" | "emerald" | "blue" | "purple";
export type Difficulty    = "Easy" | "Medium" | "Hard";

export interface MissionTask {
  id: string;
  label: string;
  order: number;
}

export interface MissionDoc {
  title: string;
  subject: string;
  description: string;
  xp: number;
  difficulty: Difficulty;
  color: MissionColor;
  tasks: MissionTask[];
  classId: string;
  educatorUid: string;
  dueDate: Timestamp;
  createdAt: Timestamp;
  isPublished: boolean;
}

// ─── studentProfiles/{uid} ────────────────────────────────────────────────
export interface SubjectGrade {
  subject: string;
  grade: string;          // e.g. "A", "B+"
  pct: number;            // 0-100
  color: MissionColor;
}

export interface StudentProfileDoc {
  uid: string;
  displayName: string;
  classId: string;
  className: string;      // denormalized
  educatorUid: string;    // denormalized
  educatorName: string;   // denormalized
  grade: string;          // e.g. "7"
  // aggregate stats (updated by cloud functions / client writes)
  leadershipPts: number;
  tarbiyahScore: number;  // 0-100
  streak: number;         // consecutive daily check-in days
  classRank: number;
  totalXP: number;
  aiSessionCount: number;
  activeMissionCount: number;
  completedMissionCount: number;
  attendancePct: number;
  subjectGrades: SubjectGrade[];
  weeklyGoals: WeeklyGoal[];
  updatedAt: Timestamp;
}

export interface WeeklyGoal {
  id: string;
  label: string;
  done: boolean;
  weekOf: string; // ISO date string of Monday
}

// ─── studentProfiles/{uid}/missionProgress/{missionId} ───────────────────
export interface TaskProgress {
  taskId: string;
  done: boolean;
  completedAt?: Timestamp;
}

export interface MissionProgressDoc {
  missionId: string;
  studentUid: string;
  status: MissionStatus;
  progress: number;       // 0-100 computed from tasks
  tasksProgress: TaskProgress[];
  xpEarned: number;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  submittedAt?: Timestamp;
  score?: number;         // grade 0-100 after educator review
  feedback?: string;
  updatedAt: Timestamp;
}

// ─── studentProfiles/{uid}/tarbiyah/{date} ────────────────────────────────
// date format: "YYYY-MM-DD"
export interface TarbiyahCategory {
  id: "prayer" | "character" | "community" | "knowledge";
  tasks: { task: string; done: boolean }[];
  pointsEarned: number;
}

export interface TarbiyahDayDoc {
  studentUid: string;
  date: string;           // "YYYY-MM-DD"
  categories: TarbiyahCategory[];
  totalPoints: number;
  totalMax: number;
  overallPct: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── studentProfiles/{uid}/aiSessions/{sessionId} ─────────────────────────
export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Timestamp;
}

export interface AISessionDoc {
  studentUid: string;
  messages: AIChatMessage[];
  model: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── attendance/{uid}_{date} ──────────────────────────────────────────────
export interface AttendanceDoc {
  studentUid: string;
  date: string;           // "YYYY-MM-DD"
  status: "present" | "absent" | "late" | "excused";
  note?: string;
  recordedBy: string;     // educator uid
  createdAt: Timestamp;
}

// ─── activityFeed/{feedId} ────────────────────────────────────────────────
export type ActivityType =
  | "mission_completed"
  | "mission_started"
  | "tarbiyah_checkin"
  | "badge_earned"
  | "streak_milestone"
  | "grade_posted"
  | "attendance"
  | "message"
  | "alert";

export interface ActivityFeedDoc {
  studentUid: string;
  type: ActivityType;
  title: string;
  detail: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp;
}

// ─── messages/{threadId} ──────────────────────────────────────────────────
export interface MessageThreadDoc {
  participantUids: string[];
  participantNames: Record<string, string>; // uid → name
  subject: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
  unreadCount: Record<string, number>;      // uid → unread count
  createdAt: Timestamp;
}

export interface MessageDoc {
  senderUid: string;
  senderName: string;
  content: string;
  attachmentUrl?: string;
  readBy: string[];
  createdAt: Timestamp;
}

// ─── programs/{programId} ─────────────────────────────────────────────────
export type ProgramColor = "gold" | "emerald" | "blue" | "purple" | "rose" | "teal";
export type GradeBand = "preK-2" | "3-5" | "5-9" | "6-9" | "all";

export interface ProgramDoc {
  id: string;
  slug: string;             // e.g. "quran-islamic-studies"
  title: string;            // e.g. "Quran & Islamic Studies"
  subtitle: string;         // e.g. "Moral & Spiritual Foundations of Leadership"
  description: string;
  arabicTitle?: string;     // e.g. "لُغَةُ القُرآنِ"
  arabicSubtitle?: string;
  gradeBand: GradeBand;     // grade range string
  gradeMin: number;         // 0 = Pre-K
  gradeMax: number;         // 9
  color: ProgramColor;
  icon: string;             // lucide icon name
  subjectIds: string[];     // references to subjects/{subjectId}
  order: number;            // display order
  isActive: boolean;
  schoolId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── subjects/{subjectId} ─────────────────────────────────────────────────
export interface SubjectDoc {
  id: string;
  programId: string;
  name: string;             // e.g. "Quran Recitation & Tajweed"
  nameArabic?: string;
  description: string;
  color: ProgramColor;
  gradeBand: GradeBand;
  gradeMin: number;
  gradeMax: number;
  weeklyHours: number;      // sessions per week
  icon: string;
  order: number;            // within program
  schoolId: string;
  createdAt: Timestamp;
}

// ─── curriculumUnits/{unitId} ──────────────────────────────────────────────
export type UnitType = "lesson" | "project" | "assessment" | "activity" | "lab" | "recitation";

export interface CurriculumUnit {
  id: string;
  subjectId: string;
  programId: string;
  title: string;
  description: string;
  type: UnitType;
  gradeBand: GradeBand;
  gradeMin: number;
  gradeMax: number;
  durationWeeks: number;
  objectives: string[];     // learning objectives
  islamicConnections?: string[]; // how it connects to Islamic values
  order: number;
  schoolId: string;
  academicYear: string;
  createdAt: Timestamp;
}

// ─── notifications/{uid}/items/{itemId} ───────────────────────────────────
export interface NotificationDoc {
  type: ActivityType;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: Timestamp;
}
