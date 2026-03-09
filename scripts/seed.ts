/**
 * Al-Madinah Nexus — Firestore Seed Script
 * Run: npx tsx scripts/seed.ts
 *
 * Creates:
 *  - 1 school
 *  - 1 educator
 *  - 1 parent
 *  - 1 class (Grade 7A)
 *  - 8 students with full profiles
 *  - 6 mission templates
 *  - mission progress for all students
 *  - tarbiyah check-ins (today) for all students
 *  - attendance records (last 30 days)
 *  - activity feed entries
 *  - weekly goals
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ── Init ──────────────────────────────────────────────────────────────────
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}
const db = getFirestore();

function ts(daysAgo = 0): Timestamp {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return Timestamp.fromDate(d);
}

function dateStr(daysAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function mondayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().split("T")[0];
}

// ── IDs ───────────────────────────────────────────────────────────────────
const SCHOOL_ID   = "almadinah-queens";
const CLASS_ID    = "grade-7a-2026";
const EDU_UID     = "educator-yusuf-001";
const PARENT_UID  = "parent-fatima-001";

const STUDENTS = [
  { uid: "student-ahmed-001",   name: "Ahmed Al-Rashid",  pts: 847, tarbiyah: 92, streak: 7,  rank: 1, grade: "A",  pct: 94, engagement: 94 },
  { uid: "student-maryam-001",  name: "Maryam Siddiqui",  pts: 790, tarbiyah: 88, streak: 5,  rank: 2, grade: "A-", pct: 91, engagement: 91 },
  { uid: "student-ibrahim-001", name: "Ibrahim Khalid",   pts: 724, tarbiyah: 80, streak: 4,  rank: 3, grade: "B+", pct: 87, engagement: 85 },
  { uid: "student-fatima-001",  name: "Fatima Osman",     pts: 698, tarbiyah: 85, streak: 6,  rank: 4, grade: "B+", pct: 85, engagement: 88 },
  { uid: "student-zaid-001",    name: "Zaid Rahman",      pts: 652, tarbiyah: 75, streak: 3,  rank: 5, grade: "B",  pct: 82, engagement: 79 },
  { uid: "student-aisha-001",   name: "Aisha Noor",       pts: 610, tarbiyah: 78, streak: 4,  rank: 6, grade: "B",  pct: 80, engagement: 80 },
  { uid: "student-omar-001",    name: "Omar Hassan",      pts: 430, tarbiyah: 60, streak: 1,  rank: 7, grade: "C+", pct: 65, engagement: 52 },
  { uid: "student-layla-001",   name: "Layla Karim",      pts: 540, tarbiyah: 70, streak: 2,  rank: 8, grade: "B-", pct: 75, engagement: 65 },
];

const SUBJECT_GRADES_TEMPLATE = [
  { subject: "Quran & Tajweed",       color: "gold" },
  { subject: "Mathematics",           color: "emerald" },
  { subject: "Arabic Language",       color: "blue" },
  { subject: "English Language Arts", color: "gold" },
  { subject: "Science",               color: "emerald" },
  { subject: "Islamic Studies",       color: "blue" },
];

function gradeFromPct(pct: number): string {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  return "C-";
}

const TARBIYAH_TEMPLATE = [
  {
    id: "prayer",
    tasks: [
      { task: "Fajr Prayer",    done: false },
      { task: "Dhuhr Prayer",   done: false },
      { task: "Asr Prayer",     done: false },
      { task: "Maghrib Prayer", done: false },
      { task: "Isha Prayer",    done: false },
    ],
    pointsEarned: 0,
  },
  {
    id: "character",
    tasks: [
      { task: "Daily Dhikr (33x Subhanallah)", done: false },
      { task: "Act of Kindness",               done: false },
      { task: "Help a classmate",              done: false },
      { task: "Avoid backbiting",              done: false },
    ],
    pointsEarned: 0,
  },
  {
    id: "community",
    tasks: [
      { task: "Help set up classroom",              done: false },
      { task: "Check on a struggling classmate",    done: false },
      { task: "Community service log",              done: false },
    ],
    pointsEarned: 0,
  },
  {
    id: "knowledge",
    tasks: [
      { task: "Quran recitation (1 page)",  done: false },
      { task: "Islamic Studies reading",    done: false },
      { task: "Arabic vocabulary practice", done: false },
      { task: "Read a Hadith",              done: false },
    ],
    pointsEarned: 0,
  },
];

// ── Mission templates ──────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: "mission-algebra-001",
    title: "The Algebra Conquest",
    subject: "Mathematics",
    description: "Master linear equations and inequalities through real-world problem sets.",
    xp: 120,
    difficulty: "Medium",
    color: "gold",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Watch: Introduction to Algebra", order: 1 },
      { id: "t2", label: "Complete Practice Set A (10 problems)", order: 2 },
      { id: "t3", label: "Practice Set B (15 problems)", order: 3 },
      { id: "t4", label: "Word Problem Challenge", order: 4 },
      { id: "t5", label: "Submit Final Quiz", order: 5 },
    ],
    dueDate: ts(-2),
  },
  {
    id: "mission-badr-001",
    title: "The Badr Expedition",
    subject: "Islamic History",
    description: "Explore the Battle of Badr — its causes, events, and lasting lessons for Muslim leadership.",
    xp: 90,
    difficulty: "Medium",
    color: "emerald",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Read: Context of Badr (Chapter 4)", order: 1 },
      { id: "t2", label: "Watch documentary excerpt", order: 2 },
      { id: "t3", label: "Map activity: The march to Badr", order: 3 },
      { id: "t4", label: "Reflection essay (300 words)", order: 4 },
    ],
    dueDate: ts(4),
  },
  {
    id: "mission-shakespeare-001",
    title: "Shakespeare's Code",
    subject: "English Language Arts",
    description: "Analyze themes of ambition and morality in Macbeth through an Islamic leadership lens.",
    xp: 80,
    difficulty: "Hard",
    color: "blue",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Read Acts I-II", order: 1 },
      { id: "t2", label: "Character analysis worksheet", order: 2 },
      { id: "t3", label: "Read Acts III-V", order: 3 },
      { id: "t4", label: "Final essay: Leadership & Moral Courage", order: 4 },
    ],
    dueDate: ts(1),
  },
  {
    id: "mission-quran-001",
    title: "The Quran Recitation Challenge",
    subject: "Quran & Tajweed",
    description: "Perfect your recitation of Surah Al-Mulk with proper Tajweed rules.",
    xp: 150,
    difficulty: "Hard",
    color: "gold",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Learn Makharij al-Huruf rules", order: 1 },
      { id: "t2", label: "Practice Surah Al-Mulk verses 1-10", order: 2 },
      { id: "t3", label: "Practice verses 11-20", order: 3 },
      { id: "t4", label: "Full recitation recording submitted", order: 4 },
    ],
    dueDate: ts(-10),
  },
  {
    id: "mission-photosynthesis-001",
    title: "The Photosynthesis Lab",
    subject: "Science",
    description: "Conduct virtual experiments on plant biology and document your findings.",
    xp: 100,
    difficulty: "Easy",
    color: "emerald",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Virtual lab experiment", order: 1 },
      { id: "t2", label: "Data recording worksheet", order: 2 },
      { id: "t3", label: "Lab report submitted", order: 3 },
    ],
    dueDate: ts(-7),
  },
  {
    id: "mission-arabic-001",
    title: "The Arabic Vocabulary Quest",
    subject: "Arabic Language",
    description: "Master 100 new Arabic vocabulary words and use them in context.",
    xp: 110,
    difficulty: "Medium",
    color: "purple",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Vocabulary flashcards set 1 (25 words)", order: 1 },
      { id: "t2", label: "Vocabulary flashcards set 2 (25 words)", order: 2 },
      { id: "t3", label: "Flashcards set 3 & 4 (50 words)", order: 3 },
      { id: "t4", label: "Context sentences quiz", order: 4 },
    ],
    dueDate: ts(-7),
  },
];

// Progress per student: how many tasks done per mission
const STUDENT_PROGRESS: Record<string, Record<string, number>> = {
  "student-ahmed-001":   { "mission-algebra-001": 3, "mission-badr-001": 2, "mission-shakespeare-001": 3, "mission-quran-001": 4, "mission-photosynthesis-001": 3, "mission-arabic-001": 0 },
  "student-maryam-001":  { "mission-algebra-001": 2, "mission-badr-001": 3, "mission-shakespeare-001": 4, "mission-quran-001": 4, "mission-photosynthesis-001": 3, "mission-arabic-001": 0 },
  "student-ibrahim-001": { "mission-algebra-001": 2, "mission-badr-001": 2, "mission-shakespeare-001": 2, "mission-quran-001": 3, "mission-photosynthesis-001": 3, "mission-arabic-001": 1 },
  "student-fatima-001":  { "mission-algebra-001": 4, "mission-badr-001": 2, "mission-shakespeare-001": 3, "mission-quran-001": 4, "mission-photosynthesis-001": 3, "mission-arabic-001": 0 },
  "student-zaid-001":    { "mission-algebra-001": 2, "mission-badr-001": 1, "mission-shakespeare-001": 2, "mission-quran-001": 3, "mission-photosynthesis-001": 3, "mission-arabic-001": 0 },
  "student-aisha-001":   { "mission-algebra-001": 2, "mission-badr-001": 2, "mission-shakespeare-001": 2, "mission-quran-001": 4, "mission-photosynthesis-001": 3, "mission-arabic-001": 0 },
  "student-omar-001":    { "mission-algebra-001": 1, "mission-badr-001": 0, "mission-shakespeare-001": 1, "mission-quran-001": 2, "mission-photosynthesis-001": 2, "mission-arabic-001": 0 },
  "student-layla-001":   { "mission-algebra-001": 2, "mission-badr-001": 1, "mission-shakespeare-001": 1, "mission-quran-001": 3, "mission-photosynthesis-001": 3, "mission-arabic-001": 0 },
};

// ── Seed Functions ─────────────────────────────────────────────────────────

async function seedSchool() {
  await db.doc(`schools/${SCHOOL_ID}`).set({
    name: "Al-Madinah Islamic School",
    address: "123 Jamaica Ave",
    city: "Queens",
    state: "NY",
    principalUid: EDU_UID,
    createdAt: ts(365),
  });
  console.log("✓ school");
}

async function seedUsers() {
  const batch = db.batch();

  // Educator
  batch.set(db.doc(`users/${EDU_UID}`), {
    uid: EDU_UID,
    email: "ustadh.yusuf@almadinah.edu",
    displayName: "Ustadh Yusuf Khalid",
    role: "educator",
    schoolId: SCHOOL_ID,
    classIds: [CLASS_ID],
    createdAt: ts(200),
  });

  // Parent (linked to Ahmed)
  batch.set(db.doc(`users/${PARENT_UID}`), {
    uid: PARENT_UID,
    email: "sister.fatima@gmail.com",
    displayName: "Sister Fatima Al-Rashid",
    role: "parent",
    childUid: "student-ahmed-001",
    schoolId: SCHOOL_ID,
    createdAt: ts(200),
  });

  // Students
  for (const s of STUDENTS) {
    batch.set(db.doc(`users/${s.uid}`), {
      uid: s.uid,
      email: `${s.name.toLowerCase().replace(/\s+/g, ".")}@student.almadinah.edu`,
      displayName: s.name,
      role: "student",
      schoolId: SCHOOL_ID,
      createdAt: ts(180),
    });
  }

  await batch.commit();
  console.log("✓ users");
}

async function seedClass() {
  await db.doc(`classes/${CLASS_ID}`).set({
    name: "Grade 7A",
    grade: "7",
    schoolId: SCHOOL_ID,
    educatorUid: EDU_UID,
    educatorName: "Ustadh Yusuf Khalid",
    subjects: ["Quran & Tajweed", "Mathematics", "Arabic Language", "English Language Arts", "Science", "Islamic Studies"],
    academicYear: "2025-2026",
    studentUids: STUDENTS.map((s) => s.uid),
    createdAt: ts(200),
  });
  console.log("✓ class");
}

async function seedStudentProfiles() {
  const batch = db.batch();
  for (const s of STUDENTS) {
    // Build subject grades with slight variance per student
    const subjectGrades = SUBJECT_GRADES_TEMPLATE.map((subj, i) => {
      const variance = Math.round((Math.random() - 0.5) * 14);
      const pct = Math.min(100, Math.max(55, s.pct + variance - i * 2));
      return { subject: subj.subject, color: subj.color, pct, grade: gradeFromPct(pct) };
    });

    const weeklyGoals = [
      { id: "g1", label: "Complete 2 Quran Missions",  done: s.streak >= 5, weekOf: mondayStr() },
      { id: "g2", label: "Submit Math Assignment",     done: s.pts > 700,   weekOf: mondayStr() },
      { id: "g3", label: "Earn 3 Leadership Points",   done: false,         weekOf: mondayStr() },
      { id: "g4", label: "Log Daily Dhikr",            done: s.streak >= 3, weekOf: mondayStr() },
    ];

    batch.set(db.doc(`studentProfiles/${s.uid}`), {
      uid: s.uid,
      displayName: s.name,
      classId: CLASS_ID,
      className: "Grade 7A",
      educatorUid: EDU_UID,
      educatorName: "Ustadh Yusuf Khalid",
      grade: "7",
      leadershipPts: s.pts,
      tarbiyahScore: s.tarbiyah,
      streak: s.streak,
      classRank: s.rank,
      totalXP: s.pts - 100,
      aiSessionCount: Math.floor(s.pts / 70),
      activeMissionCount: 3,
      completedMissionCount: 2,
      attendancePct: s.engagement,
      subjectGrades,
      weeklyGoals,
      updatedAt: ts(0),
    });
  }
  await batch.commit();
  console.log("✓ studentProfiles");
}

async function seedMissions() {
  for (const m of MISSIONS) {
    const { id, ...data } = m;
    await db.doc(`missions/${id}`).set({
      ...data,
      classId: CLASS_ID,
      educatorUid: EDU_UID,
      createdAt: ts(30),
    });
  }
  console.log("✓ missions");
}

async function seedMissionProgress() {
  for (const s of STUDENTS) {
    const batch = db.batch();
    const studentProg = STUDENT_PROGRESS[s.uid];

    for (const mission of MISSIONS) {
      const doneTasks = studentProg[mission.id] ?? 0;
      const tasksProgress = mission.tasks.map((t, i) => ({
        taskId: t.id,
        done: i < doneTasks,
        ...(i < doneTasks ? { completedAt: ts(Math.floor(Math.random() * 7)) } : {}),
      }));
      const pct = Math.round((doneTasks / mission.tasks.length) * 100);
      const isCompleted = doneTasks === mission.tasks.length;
      const isLocked = doneTasks === 0 && mission.id === "mission-arabic-001";

      batch.set(
        db.doc(`studentProfiles/${s.uid}/missionProgress/${mission.id}`),
        {
          missionId: mission.id,
          studentUid: s.uid,
          status: isCompleted ? "completed" : isLocked ? "locked" : "active",
          progress: pct,
          tasksProgress,
          xpEarned: isCompleted ? mission.xp : 0,
          ...(isCompleted ? { completedAt: ts(3) } : {}),
          updatedAt: ts(1),
        }
      );
    }
    await batch.commit();
  }
  console.log("✓ missionProgress");
}

async function seedTarbiyah() {
  for (const s of STUDENTS) {
    // Seed last 7 days of tarbiyah
    for (let day = 0; day < 7; day++) {
      const date = dateStr(day);
      const categories = TARBIYAH_TEMPLATE.map((cat) => {
        const completionRate = day === 0 ? 0.6 : (s.streak >= 5 ? 0.85 : 0.5);
        const tasks = cat.tasks.map((t) => ({
          ...t,
          done: Math.random() < completionRate,
        }));
        const done = tasks.filter((t) => t.done).length;
        return { ...cat, tasks, pointsEarned: done * 10 };
      });

      const totalPoints = categories.reduce((sum, c) => sum + c.pointsEarned, 0);
      const totalMax    = categories.reduce((sum, c) => sum + c.tasks.length * 10, 0);

      await db.doc(`studentProfiles/${s.uid}/tarbiyah/${date}`).set({
        studentUid: s.uid,
        date,
        categories,
        totalPoints,
        totalMax,
        overallPct: Math.round((totalPoints / totalMax) * 100),
        createdAt: ts(day),
        updatedAt: ts(day),
      });
    }
  }
  console.log("✓ tarbiyah");
}

async function seedAttendance() {
  for (const s of STUDENTS) {
    const batch = db.batch();
    for (let day = 0; day < 30; day++) {
      const date = dateStr(day);
      const d = new Date(); d.setDate(d.getDate() - day);
      if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends

      const roll = Math.random();
      const absent  = roll < (1 - s.engagement / 100);
      const late    = !absent && roll < (1 - s.engagement / 100) + 0.05;

      batch.set(db.doc(`attendance/${s.uid}_${date}`), {
        studentUid: s.uid,
        date,
        status: absent ? "absent" : late ? "late" : "present",
        recordedBy: EDU_UID,
        createdAt: ts(day),
      });
    }
    await batch.commit();
  }
  console.log("✓ attendance");
}

async function seedActivityFeed() {
  const batch = db.batch();
  const ACTIVITIES = [
    { sid: "student-ahmed-001", type: "mission_completed", title: "Completed 'The Algebra Conquest'",       detail: "Earned 120 XP",       color: "gold",    days: 0 },
    { sid: "student-ahmed-001", type: "tarbiyah_checkin",  title: "Daily Dhikr — 7th consecutive day 🕌", detail: "Tarbiyah streak!",   color: "emerald", days: 0 },
    { sid: "student-ahmed-001", type: "attendance",        title: "Present — on time",                      detail: "Fajr study session",  color: "blue",    days: 0 },
    { sid: "student-ahmed-001", type: "alert",             title: "Arabic assignment due soon",             detail: "Due tomorrow",        color: "gold",    days: 1 },
    { sid: "student-ahmed-001", type: "badge_earned",      title: "Badge Earned: Leadership Rising Star",   detail: "+50 Leadership Pts",  color: "purple",  days: 2 },
    { sid: "student-maryam-001", type: "mission_completed", title: "Completed 'Shakespeare's Code'",        detail: "Earned 80 XP",        color: "blue",    days: 1 },
    { sid: "student-omar-001",   type: "alert",             title: "Engagement dropped 40% this week",     detail: "Math class",          color: "gold",    days: 1 },
    { sid: "student-layla-001",  type: "alert",             title: "3 missed assignments in Arabic",        detail: "Arabic Language",     color: "gold",    days: 2 },
  ];

  for (const a of ACTIVITIES) {
    const ref = db.collection("activityFeed").doc();
    batch.set(ref, {
      studentUid: a.sid,
      type: a.type,
      title: a.title,
      detail: a.detail,
      color: a.color,
      createdAt: ts(a.days),
    });
  }
  await batch.commit();
  console.log("✓ activityFeed");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🌙 Al-Madinah Nexus — Seeding Firestore...\n");
  try {
    await seedSchool();
    await seedUsers();
    await seedClass();
    await seedStudentProfiles();
    await seedMissions();
    await seedMissionProgress();
    await seedTarbiyah();
    await seedAttendance();
    await seedActivityFeed();
    console.log("\n✅ Seed complete! Database is ready.\n");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
