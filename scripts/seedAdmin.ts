/**
 * Al-Madinah Nexus — Admin Seed Script
 * Run: npx tsx scripts/seedAdmin.ts
 *
 * Populates:
 *  - schools/{schoolId}            (full SchoolDoc)
 *  - academicYears/2025-2026       (AcademicYearDoc with 4 quarters)
 *  - users/admin-001               (admin user)
 *  - staff/educator-yusuf-001      (StaffDoc)
 *  - classes/grade-7a-2026         (updated ClassDoc with new schema)
 *  - enrollments (8 students)
 *  - events (10 school calendar events)
 *  - announcements (3 sample)
 *  - adminSettings/almadinah-queens
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

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

function ts(daysOffset = 0): Timestamp {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return Timestamp.fromDate(d);
}

function tsDate(month: number, day: number, year = 2025): Timestamp {
  return Timestamp.fromDate(new Date(year, month - 1, day));
}

const SCHOOL_ID    = "almadinah-queens";
const ADMIN_UID    = "admin-principal-001";
const EDU_UID      = "educator-yusuf-001";
const CLASS_ID     = "grade-7a-2026";
const ACADEMIC_YEAR = "2025-2026";

const STUDENTS = [
  { uid: "student-ahmed-001",   name: "Ahmed Al-Rashid"  },
  { uid: "student-maryam-001",  name: "Maryam Siddiqui"  },
  { uid: "student-ibrahim-001", name: "Ibrahim Khalid"   },
  { uid: "student-fatima-001",  name: "Fatima Osman"     },
  { uid: "student-zaid-001",    name: "Zaid Rahman"      },
  { uid: "student-aisha-001",   name: "Aisha Noor"       },
  { uid: "student-omar-001",    name: "Omar Hassan"      },
  { uid: "student-layla-001",   name: "Layla Karim"      },
];

// ── School ────────────────────────────────────────────────────────────────
async function seedSchool() {
  await db.doc(`schools/${SCHOOL_ID}`).set({
    id: SCHOOL_ID,
    name: "Al-Madinah Islamic School",
    arabicName: "مدرسة المدينة الإسلامية",
    address: "130-18 Sutphin Blvd",
    city: "Queens",
    state: "NY",
    zip: "11434",
    phone: "(347) 507-0167",
    email: "info@almadinahqueens.com",
    website: "https://almadinahqueens.com",
    timezone: "America/New_York",
    gradeRange: { min: 0, max: 9 },
    accreditations: ["NYS Department of Education"],
    currentAcademicYear: ACADEMIC_YEAR,
    principalUid: ADMIN_UID,
    adminUids: [ADMIN_UID],
    maxClassSize: 18,
    isActive: true,
    createdAt: ts(-365 * 25),
    updatedAt: ts(0),
  }, { merge: true });
  console.log("✓ school");
}

// ── Academic Year ─────────────────────────────────────────────────────────
async function seedAcademicYear() {
  await db.doc(`academicYears/${ACADEMIC_YEAR}`).set({
    id: ACADEMIC_YEAR,
    schoolId: SCHOOL_ID,
    label: "2025–2026 Academic Year",
    startDate: tsDate(9, 3, 2025),
    endDate:   tsDate(6, 19, 2026),
    isCurrent: true,
    terms: [
      {
        id: "q1",
        label: "Quarter 1",
        startDate:     tsDate(9, 3,  2025),
        endDate:       tsDate(11, 7, 2025),
        reportCardDue: tsDate(11, 14, 2025),
        isActive: false,
      },
      {
        id: "q2",
        label: "Quarter 2",
        startDate:     tsDate(11, 10, 2025),
        endDate:       tsDate(1, 23,  2026),
        reportCardDue: tsDate(1, 30,  2026),
        isActive: true,
      },
      {
        id: "q3",
        label: "Quarter 3",
        startDate:     tsDate(1, 26, 2026),
        endDate:       tsDate(3, 27, 2026),
        reportCardDue: tsDate(4, 3,  2026),
        isActive: false,
      },
      {
        id: "q4",
        label: "Quarter 4",
        startDate:     tsDate(3, 30, 2026),
        endDate:       tsDate(6, 19, 2026),
        reportCardDue: tsDate(6, 26, 2026),
        isActive: false,
      },
    ],
    createdAt: ts(0),
  }, { merge: true });
  console.log("✓ academicYear");
}

// ── Admin User ─────────────────────────────────────────────────────────────
async function seedAdminUser() {
  await db.doc(`users/${ADMIN_UID}`).set({
    uid: ADMIN_UID,
    email: "principal@almadinah.edu",
    displayName: "Principal Ibrahim Hassan",
    arabicName: "إبراهيم حسن",
    role: "admin",
    schoolId: SCHOOL_ID,
    isActive: true,
    adminPermissions: ["super_admin"],
    createdAt: ts(-200),
    updatedAt: ts(0),
  }, { merge: true });

  // Also patch the existing educator user to new schema
  await db.doc(`users/${EDU_UID}`).set({
    uid: EDU_UID,
    email: "ustadh.yusuf@almadinah.edu",
    displayName: "Ustadh Yusuf Khalid",
    arabicName: "يوسف خالد",
    role: "educator",
    schoolId: SCHOOL_ID,
    isActive: true,
    classIds: [CLASS_ID],
    subjectSpecialties: ["Quran & Tajweed", "Islamic Studies", "Arabic Language"],
    isHomeroom: true,
    createdAt: ts(-200),
    updatedAt: ts(0),
  }, { merge: true });

  console.log("✓ admin + educator users");
}

// ── Staff ──────────────────────────────────────────────────────────────────
async function seedStaff() {
  const staffMembers = [
    {
      uid: EDU_UID,
      role: "educator",
      title: "Ustadh",
      department: "Islamic Studies",
      subjectsTaught: ["Quran & Tajweed", "Islamic Studies", "Arabic Language"],
      classIds: [CLASS_ID],
      isActive: true,
      bio: "Lead educator for Grade 7A. Specializes in Quran, Islamic Studies, and Arabic.",
      qualifications: ["B.A. Islamic Studies — Al-Azhar University", "NYS Teaching Certification"],
    },
    {
      uid: ADMIN_UID,
      role: "admin",
      title: "Principal",
      department: "Administration",
      subjectsTaught: [],
      classIds: [],
      isActive: true,
      bio: "Principal of Al-Madinah Islamic School, Queens.",
      qualifications: ["M.Ed. Educational Leadership", "NYS Principal Certification"],
    },
  ];

  const batch = db.batch();
  for (const s of staffMembers) {
    batch.set(db.doc(`staff/${s.uid}`), {
      ...s,
      schoolId: SCHOOL_ID,
      hireDate: ts(-365),
      createdAt: ts(-365),
      updatedAt: ts(0),
    }, { merge: true });
  }
  await batch.commit();
  console.log("✓ staff");
}

// ── Class (updated schema) ─────────────────────────────────────────────────
async function seedClass() {
  await db.doc(`classes/${CLASS_ID}`).set({
    id: CLASS_ID,
    name: "Grade 7A",
    displayName: "7th Grade — Section A",
    grade: "7",
    gradeLevel: 8,
    schoolId: SCHOOL_ID,
    academicYear: ACADEMIC_YEAR,
    roomNumber: "Room 204",
    schedule: "Mon-Fri 8:00am-3:00pm",
    maxStudents: 20,
    leadEducatorUid: EDU_UID,
    leadEducatorName: "Ustadh Yusuf Khalid",
    coEducatorUids: [],
    programIds: ["quran-islamic-studies", "arabic-language", "core-academics", "stem-coding"],
    subjects: ["Quran & Tajweed", "Mathematics", "Arabic Language", "English Language Arts", "Science", "Islamic Studies"],
    studentUids: STUDENTS.map((s) => s.uid),
    isActive: true,
    createdAt: ts(-200),
    updatedAt: ts(0),
  }, { merge: true });
  console.log("✓ class (updated schema)");
}

// ── Patch StudentProfiles to new schema ───────────────────────────────────
async function patchStudentProfiles() {
  const batch = db.batch();
  for (const s of STUDENTS) {
    batch.update(db.doc(`studentProfiles/${s.uid}`), {
      schoolId: SCHOOL_ID,
      academicYear: ACADEMIC_YEAR,
      leadEducatorUid: EDU_UID,
      leadEducatorName: "Ustadh Yusuf Khalid",
      isActive: true,
      createdAt: ts(-180),
      updatedAt: ts(0),
    });
  }
  await batch.commit();
  console.log("✓ studentProfiles patched to new schema");
}

// ── Enrollments ────────────────────────────────────────────────────────────
async function seedEnrollments() {
  const batch = db.batch();
  for (const s of STUDENTS) {
    const ref = db.collection("enrollments").doc(`${s.uid}-${ACADEMIC_YEAR}`);
    batch.set(ref, {
      id: `${s.uid}-${ACADEMIC_YEAR}`,
      studentUid: s.uid,
      studentName: s.name,
      classId: CLASS_ID,
      className: "Grade 7A",
      schoolId: SCHOOL_ID,
      academicYear: ACADEMIC_YEAR,
      grade: "7",
      status: "active",
      enrollmentDate: tsDate(9, 3, 2025),
      createdBy: ADMIN_UID,
      createdAt: tsDate(8, 15, 2025),
      updatedAt: ts(0),
    }, { merge: true });
  }
  await batch.commit();
  console.log("✓ enrollments");
}

// ── Events ─────────────────────────────────────────────────────────────────
async function seedEvents() {
  const events = [
    {
      title: "First Day of School",
      description: "Welcome back assembly and class orientations",
      eventType: "academic",
      startDate: tsDate(9, 3, 2025),
      location: "Main Hall",
      targetGrades: [],
      isPublic: true,
    },
    {
      title: "Mawlid An-Nabi ﷺ Celebration",
      description: "School-wide celebration of the Prophet's birthday with Quran recitation, nasheeds, and community gathering",
      eventType: "islamic",
      startDate: tsDate(9, 15, 2025),
      location: "School Auditorium",
      targetGrades: [],
      isPublic: true,
    },
    {
      title: "Q1 Report Cards",
      description: "First quarter report cards distributed to parents",
      eventType: "academic",
      startDate: tsDate(11, 14, 2025),
      location: "Classrooms",
      targetGrades: [],
      isPublic: false,
    },
    {
      title: "Parent-Teacher Conference",
      description: "Individual parent-teacher meetings for all grades",
      eventType: "meeting",
      startDate: tsDate(11, 20, 2025),
      location: "School Building",
      targetGrades: [],
      isPublic: false,
    },
    {
      title: "Winter Break Begins",
      description: "School closed for winter recess",
      eventType: "holiday",
      startDate: tsDate(12, 24, 2025),
      endDate:   tsDate(1, 2, 2026),
      location: null,
      targetGrades: [],
      isPublic: true,
    },
    {
      title: "KidsCodeGift Demo Day",
      description: "Students showcase their coding projects built on KidsCodeGift to parents and community",
      eventType: "community",
      startDate: tsDate(2, 5, 2026),
      location: "STEM Lab",
      targetGrades: ["5","6","7","8","9"],
      isPublic: true,
    },
    {
      title: "Science Fair",
      description: "Annual school science fair — all grades present projects",
      eventType: "academic",
      startDate: tsDate(3, 12, 2026),
      location: "Gymnasium",
      targetGrades: [],
      isPublic: true,
    },
    {
      title: "Leadership Academy Graduation",
      description: "Graduation ceremony for Grade 5–9 Leadership Academy students",
      eventType: "community",
      startDate: tsDate(5, 28, 2026),
      location: "Main Hall",
      targetGrades: ["5","6","7","8","9"],
      isPublic: true,
    },
    {
      title: "Eid Al-Adha Celebration",
      description: "School-wide Eid celebration with prayer, activities, and community lunch",
      eventType: "islamic",
      startDate: tsDate(6, 6, 2026),
      location: "School Grounds",
      targetGrades: [],
      isPublic: true,
    },
    {
      title: "Last Day of School / Graduation",
      description: "Final day of the 2025-2026 academic year and Grade 9 graduation ceremony",
      eventType: "academic",
      startDate: tsDate(6, 19, 2026),
      location: "Main Hall",
      targetGrades: [],
      isPublic: true,
    },
  ];

  const batch = db.batch();
  for (const ev of events) {
    const ref = db.collection("events").doc();
    batch.set(ref, {
      id: ref.id,
      schoolId: SCHOOL_ID,
      endDate: ev.endDate ?? null,
      createdBy: ADMIN_UID,
      createdAt: ts(0),
      ...ev,
    });
  }
  await batch.commit();
  console.log("✓ events");
}

// ── Announcements ──────────────────────────────────────────────────────────
async function seedAnnouncements() {
  const announcements = [
    {
      title: "Welcome to the 2025–2026 School Year!",
      body: "Assalamu Alaikum dear families! We are thrilled to begin another blessed year at Al-Madinah Islamic School. This year we launch our new Nexus platform — your one-stop portal for tracking your child's academic progress, Islamic character development, and leadership growth. May Allah bless this year with knowledge, faith, and success. آمين",
      isPinned: true,
      targetRoles: ["student", "parent", "educator"],
      classId: null,
    },
    {
      title: "KidsCodeGift Access Now Live",
      body: "All Al-Madinah students from Grade 3 and above now have access to the KidsCodeGift platform. Students can begin building their first projects and earning coding achievements. Parents — encourage your child to explore! Login credentials were sent to your registered email.",
      isPinned: false,
      targetRoles: ["student", "parent"],
      classId: null,
    },
    {
      title: "Leadership Academy Applications Open — Grade 5+",
      body: "Applications for the 2025-2026 Leadership Academy are now open for students in Grades 5 through 9. The program includes mentorship circles, public speaking training, student government, and community service projects. Apply through the Nexus platform or contact the main office.",
      isPinned: false,
      targetRoles: ["student", "parent"],
      classId: null,
    },
  ];

  const batch = db.batch();
  for (const ann of announcements) {
    const ref = db.collection("announcements").doc();
    batch.set(ref, {
      id: ref.id,
      schoolId: SCHOOL_ID,
      authorUid: ADMIN_UID,
      authorName: "Principal Ibrahim Hassan",
      expiresAt: null,
      createdAt: ts(-5),
      ...ann,
    });
  }
  await batch.commit();
  console.log("✓ announcements");
}

// ── Admin Settings ─────────────────────────────────────────────────────────
async function seedAdminSettings() {
  await db.doc(`adminSettings/${SCHOOL_ID}`).set({
    schoolId: SCHOOL_ID,
    currentAcademicYear: ACADEMIC_YEAR,
    gradingScale: [
      { grade: "A+", minPct: 97, maxPct: 100, gpa: 4.0 },
      { grade: "A",  minPct: 93, maxPct: 96,  gpa: 4.0 },
      { grade: "A-", minPct: 90, maxPct: 92,  gpa: 3.7 },
      { grade: "B+", minPct: 87, maxPct: 89,  gpa: 3.3 },
      { grade: "B",  minPct: 83, maxPct: 86,  gpa: 3.0 },
      { grade: "B-", minPct: 80, maxPct: 82,  gpa: 2.7 },
      { grade: "C+", minPct: 77, maxPct: 79,  gpa: 2.3 },
      { grade: "C",  minPct: 73, maxPct: 76,  gpa: 2.0 },
      { grade: "C-", minPct: 70, maxPct: 72,  gpa: 1.7 },
    ],
    tarbiyahEnabled:            true,
    missionsEnabled:            true,
    aiMualimEnabled:            true,
    kidsCodeGiftEnabled:        true,
    leadershipProgramEnabled:   true,
    leadershipProgramMinGrade:  5,
    attendanceReminderTime:     "08:30",
    parentNotificationsEnabled: true,
    updatedAt: ts(0),
  }, { merge: true });
  console.log("✓ adminSettings");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🏫 Al-Madinah Nexus — Admin Seed Script\n");
  try {
    await seedSchool();
    await seedAcademicYear();
    await seedAdminUser();
    await seedStaff();
    await seedClass();
    await patchStudentProfiles();
    await seedEnrollments();
    await seedEvents();
    await seedAnnouncements();
    await seedAdminSettings();
    console.log("\n✅ Admin seed complete!\n");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
