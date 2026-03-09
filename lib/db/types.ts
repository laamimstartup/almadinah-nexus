import { Timestamp } from "firebase/firestore";

// ─── Core role type ────────────────────────────────────────────────────────
export type UserRole = "student" | "parent" | "educator" | "admin";

// ─── users/{uid} ──────────────────────────────────────────────────────────
// Single doc per Firebase Auth user. Role-specific fields are optional.
export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  arabicName?: string;          // e.g. "أحمد الرشيد"
  role: UserRole;
  photoURL?: string | null;
  schoolId: string;             // always set — every user belongs to a school
  isActive: boolean;            // soft-delete / deactivation
  phoneNumber?: string;

  // ── Student-specific ──────────────────────────────────────────────────
  studentId?: string;           // school-assigned ID (e.g. "STU-2026-047")
  classId?: string;             // current enrolled class
  grade?: string;               // current grade level "preK"|"K"|"1"…"9"
  enrollmentDate?: Timestamp;
  graduationYear?: number;      // e.g. 2030
  dateOfBirth?: Timestamp;
  parentUids?: string[];        // array — supports 2-parent families

  // ── Parent-specific ───────────────────────────────────────────────────
  childUids?: string[];         // ARRAY — one parent can have multiple children

  // ── Educator-specific ─────────────────────────────────────────────────
  classIds?: string[];          // classes this educator teaches
  subjectSpecialties?: string[]; // e.g. ["Quran & Tajweed", "Arabic"]
  isHomeroom?: boolean;

  // ── Admin-specific ────────────────────────────────────────────────────
  adminPermissions?: AdminPermission[];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type AdminPermission =
  | "manage_users"
  | "manage_classes"
  | "manage_enrollment"
  | "manage_programs"
  | "manage_finances"
  | "view_analytics"
  | "super_admin";

// ─── schools/{schoolId} ───────────────────────────────────────────────────
export interface SchoolDoc {
  id: string;
  name: string;                 // "Al-Madinah Islamic School"
  arabicName?: string;          // "مدرسة المدينة الإسلامية"
  address: string;              // "123 Jamaica Ave"
  city: string;                 // "Queens"
  state: string;                // "NY"
  zip?: string;
  phone: string;                // "(347) 507-0167"
  email: string;                // "info@almadinahqueens.com"
  website?: string;
  logoUrl?: string;
  timezone: string;             // "America/New_York"
  gradeRange: { min: number; max: number }; // { min: 0, max: 9 } (0=PreK)
  accreditations: string[];     // ["NYS DOE"]
  currentAcademicYear: string;  // "2025-2026"
  principalUid?: string;
  vicePrincipalUid?: string;
  adminUids: string[];          // all admin user uids
  maxClassSize: number;         // 18 (from website: avg 18:1)
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── academicYears/{yearId} ────────────────────────────────────────────────
// yearId = "2025-2026"
export interface AcademicYearDoc {
  id: string;                   // "2025-2026"
  schoolId: string;
  label: string;                // "2025–2026 Academic Year"
  startDate: Timestamp;
  endDate: Timestamp;
  isCurrent: boolean;
  terms: GradingTerm[];
  createdAt: Timestamp;
}

export interface GradingTerm {
  id: string;                   // "q1", "q2", "q3", "q4"
  label: string;                // "Quarter 1", "Semester 1"
  startDate: Timestamp;
  endDate: Timestamp;
  reportCardDue?: Timestamp;
  isActive: boolean;
}

// ─── classes/{classId} ────────────────────────────────────────────────────
export interface ClassDoc {
  id: string;
  name: string;                 // "Grade 7A"
  displayName: string;          // "7th Grade — Section A"
  grade: string;                // "7" | "preK" | "K" | "1"…"9"
  gradeLevel: number;           // 0=PreK, 1=K, 2=1st … 10=9th
  schoolId: string;
  academicYear: string;         // "2025-2026"
  roomNumber?: string;          // "Room 204"
  schedule?: string;            // "Mon-Fri 8:00am-3:00pm"
  maxStudents: number;          // cap, default 20

  // Educator assignments
  leadEducatorUid: string;      // homeroom / lead teacher
  leadEducatorName: string;     // denormalized for display
  coEducatorUids?: string[];    // Quran teacher, Arabic teacher, etc.

  // Program & subject linkage
  programIds: string[];         // which programs this class follows
  subjects: string[];           // subject names (denormalized for quick reads)

  // Roster — kept here as source of truth for small class sizes (≤30)
  studentUids: string[];

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── enrollments/{enrollmentId} ───────────────────────────────────────────
// One doc per student per academic year. Tracks enrollment lifecycle.
export interface EnrollmentDoc {
  id: string;
  studentUid: string;
  studentName: string;          // denormalized
  classId: string;
  className: string;            // denormalized
  schoolId: string;
  academicYear: string;
  grade: string;
  status: EnrollmentStatus;
  enrollmentDate: Timestamp;
  withdrawalDate?: Timestamp;
  withdrawalReason?: string;
  notes?: string;
  createdBy: string;            // admin uid who created enrollment
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type EnrollmentStatus =
  | "pending"       // application received
  | "accepted"      // accepted, not yet started
  | "active"        // currently enrolled
  | "withdrawn"     // left mid-year
  | "graduated"     // completed grade
  | "transferred";  // moved to another school

// ─── staff/{staffId} ──────────────────────────────────────────────────────
// Mirrors users/{uid} for staff but holds HR/professional info
export interface StaffDoc {
  uid: string;                  // same as users/{uid}
  schoolId: string;
  role: "educator" | "admin" | "support";
  title: string;                // "Ustadh", "Ms.", "Mr.", "Dr."
  department?: string;          // "Islamic Studies", "STEM", "Administration"
  subjectsTaught: string[];
  classIds: string[];
  hireDate: Timestamp;
  isActive: boolean;
  bio?: string;
  qualifications?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── missions/{missionId} ─────────────────────────────────────────────────
export type MissionStatus = "active" | "completed" | "locked";
export type MissionColor  = "gold" | "emerald" | "blue" | "purple" | "rose" | "teal";
export type Difficulty    = "Easy" | "Medium" | "Hard";

export interface MissionTask {
  id: string;
  label: string;
  order: number;
}

export interface MissionDoc {
  id?: string;
  title: string;
  subject: string;
  subjectId?: string;           // ref to subjects/{subjectId}
  programId?: string;           // ref to programs/{programId}
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
  // Template support — missions can be cloned from a template
  isTemplate?: boolean;
  templateId?: string;
}

// ─── missionTemplates/{templateId} ────────────────────────────────────────
// School-wide mission library that educators can clone from
export interface MissionTemplateDoc {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  programId: string;
  description: string;
  xp: number;
  difficulty: Difficulty;
  color: MissionColor;
  tasks: MissionTask[];
  schoolId: string;
  createdByUid: string;
  gradeMin: number;
  gradeMax: number;
  usageCount: number;           // how many classes have cloned this
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── studentProfiles/{uid} ────────────────────────────────────────────────
export interface SubjectGrade {
  subject: string;
  subjectId?: string;           // ref to subjects/{subjectId}
  grade: string;                // e.g. "A", "B+"
  pct: number;                  // 0-100
  color: MissionColor;
  term?: string;                // "q1", "q2", etc.
  updatedAt?: Timestamp;
}

export interface StudentProfileDoc {
  uid: string;
  displayName: string;
  arabicName?: string;
  studentId?: string;           // school-assigned ID
  classId: string;
  className: string;
  grade: string;
  gradeLevel?: number;
  schoolId: string;
  academicYear: string;

  // Denormalized educator refs
  leadEducatorUid: string;
  leadEducatorName: string;

  // Parent links (supports 2-parent families)
  parentUids?: string[];

  // Stats
  leadershipPts: number;
  tarbiyahScore: number;
  streak: number;
  classRank: number;
  totalXP: number;
  aiSessionCount: number;
  activeMissionCount: number;
  completedMissionCount: number;
  attendancePct: number;

  // Grades — kept here for fast dashboard reads (≤10 subjects)
  subjectGrades: SubjectGrade[];

  // Weekly goals — kept embedded (small array, updated weekly)
  weeklyGoals: WeeklyGoal[];

  // Flags
  isActive: boolean;
  hasIEP?: boolean;             // Individualized Education Plan
  notes?: string;               // educator notes (admin/educator visible only)

  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface WeeklyGoal {
  id: string;
  label: string;
  done: boolean;
  weekOf: string;               // ISO date string of Monday
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
  subjectId?: string;
  programId?: string;
  status: MissionStatus;
  progress: number;
  tasksProgress: TaskProgress[];
  xpEarned: number;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  submittedAt?: Timestamp;
  score?: number;
  feedback?: string;
  updatedAt: Timestamp;
}

// ─── studentProfiles/{uid}/tarbiyah/{date} ────────────────────────────────
export interface TarbiyahCategory {
  id: "prayer" | "character" | "community" | "knowledge";
  tasks: { task: string; done: boolean }[];
  pointsEarned: number;
}

export interface TarbiyahDayDoc {
  studentUid: string;
  date: string;
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

// ─── attendance/{classId}/records/{date} ──────────────────────────────────
// Restructured: class-scoped, date-keyed, with per-student entries
export interface AttendanceRecord {
  studentUid: string;
  studentName: string;          // denormalized
  status: AttendanceStatus;
  note?: string;
  arrivedAt?: string;           // "HH:MM" for late arrivals
  recordedBy: string;
  recordedAt: Timestamp;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused" | "early_dismissal";

export interface AttendanceDayDoc {
  classId: string;
  date: string;                 // "YYYY-MM-DD"
  academicYear: string;
  schoolId: string;
  records: Record<string, AttendanceRecord>; // uid → record
  submittedBy: string;          // educator uid
  submittedAt: Timestamp;
  isFinalized: boolean;
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
  | "enrollment"
  | "message"
  | "announcement"
  | "alert";

export interface ActivityFeedDoc {
  studentUid: string;
  classId?: string;
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
  participantNames: Record<string, string>;
  subject: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
  unreadCount: Record<string, number>;
  threadType: "direct" | "class_announcement" | "parent_teacher";
  classId?: string;
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

// ─── announcements/{announcementId} ───────────────────────────────────────
export interface AnnouncementDoc {
  id: string;
  schoolId: string;
  classId?: string;             // null = school-wide
  title: string;
  body: string;
  authorUid: string;
  authorName: string;
  targetRoles: UserRole[];      // who can see it
  isPinned: boolean;
  expiresAt?: Timestamp;
  createdAt: Timestamp;
}

// ─── events/{eventId} ─────────────────────────────────────────────────────
export interface EventDoc {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  eventType: "academic" | "islamic" | "community" | "exam" | "holiday" | "meeting";
  startDate: Timestamp;
  endDate?: Timestamp;
  location?: string;
  targetGrades?: string[];      // empty = all grades
  isPublic: boolean;            // visible on school website
  createdBy: string;
  createdAt: Timestamp;
}

// ─── programs/{programId} ─────────────────────────────────────────────────
export type ProgramColor = "gold" | "emerald" | "blue" | "purple" | "rose" | "teal";
export type GradeBand = "preK-2" | "3-5" | "5-9" | "6-9" | "all";

export interface ProgramDoc {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  arabicTitle?: string;
  arabicSubtitle?: string;
  gradeBand: GradeBand;
  gradeMin: number;
  gradeMax: number;
  color: ProgramColor;
  icon: string;
  subjectIds: string[];
  order: number;
  isActive: boolean;
  schoolId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── subjects/{subjectId} ─────────────────────────────────────────────────
export interface SubjectDoc {
  id: string;
  programId: string;
  name: string;
  nameArabic?: string;
  description: string;
  color: ProgramColor;
  gradeBand: GradeBand;
  gradeMin: number;
  gradeMax: number;
  weeklyHours: number;
  icon: string;
  order: number;
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
  objectives: string[];
  islamicConnections?: string[];
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

// ─── adminSettings/{schoolId} ─────────────────────────────────────────────
export interface AdminSettingsDoc {
  schoolId: string;
  currentAcademicYear: string;
  gradingScale: GradingScale[];
  tarbiyahEnabled: boolean;
  missionsEnabled: boolean;
  aiMualimEnabled: boolean;
  kidsCodeGiftEnabled: boolean;
  leadershipProgramEnabled: boolean;
  leadershipProgramMinGrade: number;  // 5 per website
  attendanceReminderTime: string;     // "08:30"
  parentNotificationsEnabled: boolean;
  updatedAt: Timestamp;
}

export interface GradingScale {
  grade: string;   // "A+"
  minPct: number;  // 97
  maxPct: number;  // 100
  gpa: number;     // 4.0
}

