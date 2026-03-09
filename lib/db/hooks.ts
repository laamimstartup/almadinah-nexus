"use client";
import { useEffect, useState } from "react";
import {
  doc, collection, query, where, orderBy, limit,
  onSnapshot, getDoc, getDocs, setDoc, updateDoc,
  addDoc, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  StudentProfileDoc, MissionDoc, MissionProgressDoc,
  TarbiyahDayDoc, ActivityFeedDoc, AttendanceDayDoc,
  ClassDoc, UserDoc, WeeklyGoal, TaskProgress,
  ProgramDoc, SubjectDoc, CurriculumUnit,
  EnrollmentDoc, StaffDoc, AcademicYearDoc,
  SchoolDoc, AnnouncementDoc, EventDoc,
} from "./types";

// ─── helpers ──────────────────────────────────────────────────────────────
function today(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── useStudentProfile ────────────────────────────────────────────────────
export function useStudentProfile(uid: string | null) {
  const [profile, setProfile] = useState<StudentProfileDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, "studentProfiles", uid), (snap) => {
      setProfile(snap.exists() ? (snap.data() as StudentProfileDoc) : null);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { profile, loading };
}

// ─── useMissions (templates for a class) ─────────────────────────────────
export function useClassMissions(classId: string | null) {
  const [missions, setMissions] = useState<MissionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    const q = query(
      collection(db, "missions"),
      where("classId", "==", classId),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as MissionDoc & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [classId]);

  return { missions, loading };
}

// ─── useMissionProgress (all missions for a student) ──────────────────────
export function useMissionProgress(studentUid: string | null) {
  const [progress, setProgress] = useState<(MissionProgressDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentUid) { setLoading(false); return; }
    const q = query(
      collection(db, "studentProfiles", studentUid, "missionProgress"),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setProgress(snap.docs.map((d) => ({ id: d.id, ...d.data() } as MissionProgressDoc & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [studentUid]);

  return { progress, loading };
}

// ─── useTodayTarbiyah ─────────────────────────────────────────────────────
export function useTodayTarbiyah(studentUid: string | null) {
  const [tarbiyah, setTarbiyah] = useState<TarbiyahDayDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentUid) { setLoading(false); return; }
    const ref = doc(db, "studentProfiles", studentUid, "tarbiyah", today());
    const unsub = onSnapshot(ref, (snap) => {
      setTarbiyah(snap.exists() ? (snap.data() as TarbiyahDayDoc) : null);
      setLoading(false);
    });
    return unsub;
  }, [studentUid]);

  return { tarbiyah, loading };
}

// ─── useTarbiyahHistory (last 30 days) ───────────────────────────────────
export function useTarbiyahHistory(studentUid: string | null) {
  const [history, setHistory] = useState<TarbiyahDayDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentUid) { setLoading(false); return; }
    const q = query(
      collection(db, "studentProfiles", studentUid, "tarbiyah"),
      orderBy("date", "desc"),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map((d) => d.data() as TarbiyahDayDoc));
      setLoading(false);
    });
    return unsub;
  }, [studentUid]);

  return { history, loading };
}

// ─── useActivityFeed (for parent/educator) ───────────────────────────────
export function useActivityFeed(studentUid: string | null, limitCount = 20) {
  const [feed, setFeed] = useState<(ActivityFeedDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentUid) { setLoading(false); return; }
    const q = query(
      collection(db, "activityFeed"),
      where("studentUid", "==", studentUid),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const unsub = onSnapshot(q, (snap) => {
      setFeed(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityFeedDoc & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [studentUid, limitCount]);

  return { feed, loading };
}

// ─── useClassStudents (educator) ─────────────────────────────────────────
export function useClassStudents(classId: string | null) {
  const [students, setStudents] = useState<(StudentProfileDoc & { uid: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    const q = query(
      collection(db, "studentProfiles"),
      where("classId", "==", classId),
      orderBy("leadershipPts", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as StudentProfileDoc & { uid: string })));
      setLoading(false);
    });
    return unsub;
  }, [classId]);

  return { students, loading };
}

// ─── useAttendance (student attendance, last 30 records by studentUid) ────
export function useAttendance(studentUid: string | null) {
  const [records, setRecords] = useState<{ id: string; date: string; status: string; classId: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentUid) { setLoading(false); return; }
    // New schema: query attendanceDays where records map contains this student
    // For compatibility, also query old flat collection
    const q = query(
      collection(db, "attendanceDays"),
      where("studentUids", "array-contains", studentUid),
      orderBy("date", "desc"),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      const flat = snap.docs.flatMap((d) => {
        const data = d.data() as AttendanceDayDoc;
        const rec = data.records?.[studentUid];
        if (!rec) return [];
        return [{ id: d.id, date: data.date, status: rec.status, classId: data.classId }];
      });
      setRecords(flat);
      setLoading(false);
    });
    return unsub;
  }, [studentUid]);

  return { records, loading };
}

// ─── useEducatorClass (classDoc + students by educatorUid) ────────────────
export function useEducatorClass(educatorUid: string | null) {
  const [classDoc, setClassDoc] = useState<(ClassDoc & { id: string }) | null>(null);
  const [students, setStudents] = useState<(StudentProfileDoc & { uid: string })[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!educatorUid) { setLoading(false); return; }
    // First resolve the class for this educator
    getDocs(query(collection(db, "classes"), where("educatorUid", "==", educatorUid), limit(1))).then((snap) => {
      if (snap.empty) { setLoading(false); return; }
      const cdoc = { id: snap.docs[0].id, ...snap.docs[0].data() } as ClassDoc & { id: string };
      setClassDoc(cdoc);
      // Then subscribe to students in that class
      const q = query(
        collection(db, "studentProfiles"),
        where("classId", "==", cdoc.id),
        orderBy("leadershipPts", "desc")
      );
      const unsub = onSnapshot(q, (s) => {
        setStudents(s.docs.map((d) => ({ uid: d.id, ...d.data() } as StudentProfileDoc & { uid: string })));
        setLoading(false);
      });
      return unsub;
    });
  }, [educatorUid]);

  return { classDoc, students, loading };
}

// ─── useClassDoc ─────────────────────────────────────────────────────────
export function useClassDoc(classId: string | null) {
  const [classDoc, setClassDoc] = useState<(ClassDoc & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, "classes", classId), (snap) => {
      setClassDoc(snap.exists() ? ({ id: snap.id, ...snap.data() } as ClassDoc & { id: string }) : null);
      setLoading(false);
    });
    return unsub;
  }, [classId]);

  return { classDoc, loading };
}

// ─── mutations ────────────────────────────────────────────────────────────

// Toggle a tarbiyah task for today
export async function toggleTarbiyahTask(
  studentUid: string,
  categoryId: string,
  taskIndex: number,
  currentDoc: TarbiyahDayDoc
) {
  const ref = doc(db, "studentProfiles", studentUid, "tarbiyah", today());
  const updated = { ...currentDoc };
  const cat = updated.categories.find((c) => c.id === categoryId);
  if (!cat) return;
  cat.tasks[taskIndex].done = !cat.tasks[taskIndex].done;

  // Recompute points
  const POINTS_PER_TASK = 10;
  let totalPoints = 0;
  let totalMax = 0;
  for (const c of updated.categories) {
    const done = c.tasks.filter((t) => t.done).length;
    c.pointsEarned = done * POINTS_PER_TASK;
    totalPoints += c.pointsEarned;
    totalMax += c.tasks.length * POINTS_PER_TASK;
  }
  updated.totalPoints = totalPoints;
  updated.totalMax = totalMax;
  updated.overallPct = totalMax > 0 ? Math.round((totalPoints / totalMax) * 100) : 0;
  updated.updatedAt = Timestamp.now();

  await setDoc(ref, updated);

  // Update aggregate tarbiyahScore on profile
  await updateDoc(doc(db, "studentProfiles", studentUid), {
    tarbiyahScore: updated.overallPct,
    updatedAt: serverTimestamp(),
  });
}

// Toggle a mission task
export async function toggleMissionTask(
  studentUid: string,
  missionId: string,
  taskId: string,
  currentProgress: MissionProgressDoc,
  allTasks: TaskProgress[]
) {
  const ref = doc(db, "studentProfiles", studentUid, "missionProgress", missionId);
  const updated = allTasks.map((t) =>
    t.taskId === taskId ? { ...t, done: !t.done, completedAt: !t.done ? Timestamp.now() : undefined } : t
  );
  const done = updated.filter((t) => t.done).length;
  const pct  = Math.round((done / updated.length) * 100);
  const isCompleted = pct === 100;

  const patch: Partial<MissionProgressDoc> = {
    tasksProgress: updated,
    progress: pct,
    status: isCompleted ? "completed" : "active",
    updatedAt: Timestamp.now(),
  };
  if (isCompleted && !currentProgress.completedAt) {
    patch.completedAt = Timestamp.now();
    patch.xpEarned = currentProgress.xpEarned; // already set at creation
  }

  await updateDoc(ref, patch as Record<string, unknown>);

  if (isCompleted) {
    await updateDoc(doc(db, "studentProfiles", studentUid), {
      completedMissionCount: (currentProgress.status !== "completed" ? 1 : 0),
      updatedAt: serverTimestamp(),
    });
    // Log activity
    await addDoc(collection(db, "activityFeed"), {
      studentUid,
      type: "mission_completed",
      title: "Mission Completed!",
      detail: `Earned ${currentProgress.xpEarned} XP`,
      color: "gold",
      createdAt: serverTimestamp(),
    });
  }
}

// Update weekly goal
export async function toggleWeeklyGoal(studentUid: string, goalId: string, currentGoals: WeeklyGoal[]) {
  const updated = currentGoals.map((g) => g.id === goalId ? { ...g, done: !g.done } : g);
  await updateDoc(doc(db, "studentProfiles", studentUid), {
    weeklyGoals: updated,
    updatedAt: serverTimestamp(),
  });
}

// Get all students for an educator (one-time fetch)
export async function getEducatorStudents(educatorUid: string) {
  const q = query(
    collection(db, "studentProfiles"),
    where("educatorUid", "==", educatorUid),
    orderBy("leadershipPts", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as StudentProfileDoc & { uid: string }));
}

// Get educator's class
export async function getEducatorClass(educatorUid: string) {
  const q = query(collection(db, "classes"), where("educatorUid", "==", educatorUid), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as ClassDoc & { id: string };
}

// Get user doc
export async function getUserDoc(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

// Get missions with student progress merged (for missions page)
export async function getMissionsWithProgress(studentUid: string, classId: string) {
  const [missionsSnap, progressSnap] = await Promise.all([
    getDocs(query(collection(db, "missions"), where("classId", "==", classId), where("isPublished", "==", true))),
    getDocs(collection(db, "studentProfiles", studentUid, "missionProgress")),
  ]);

  const progressMap = new Map<string, MissionProgressDoc>();
  progressSnap.docs.forEach((d) => progressMap.set(d.id, d.data() as MissionProgressDoc));

  return missionsSnap.docs.map((d) => {
    const mission = { id: d.id, ...d.data() } as MissionDoc & { id: string };
    const prog = progressMap.get(d.id);
    return { mission, progress: prog ?? null };
  });
}

// ─── usePrograms ──────────────────────────────────────────────────────────
export function usePrograms(schoolId: string | null) {
  const [programs, setPrograms] = useState<(ProgramDoc & { id: string })[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const q = query(
      collection(db, "programs"),
      where("schoolId", "==", schoolId),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProgramDoc & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [schoolId]);

  return { programs, loading };
}

// ─── useSubjects (all subjects for a school) ──────────────────────────────
export function useSubjects(schoolId: string | null) {
  const [subjects, setSubjects] = useState<(SubjectDoc & { id: string })[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const q = query(
      collection(db, "subjects"),
      where("schoolId", "==", schoolId),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setSubjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SubjectDoc & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [schoolId]);

  return { subjects, loading };
}

// ─── useSubjectsByProgram ─────────────────────────────────────────────────
export function useSubjectsByProgram(programId: string | null) {
  const [subjects, setSubjects] = useState<(SubjectDoc & { id: string })[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!programId) { setLoading(false); return; }
    const q = query(
      collection(db, "subjects"),
      where("programId", "==", programId),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setSubjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SubjectDoc & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [programId]);

  return { subjects, loading };
}

// ─── useCurriculumUnits ───────────────────────────────────────────────────
export function useCurriculumUnits(subjectId: string | null) {
  const [units, setUnits]     = useState<(CurriculumUnit & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) { setLoading(false); return; }
    const q = query(
      collection(db, "curriculumUnits"),
      where("subjectId", "==", subjectId),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setUnits(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CurriculumUnit & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [subjectId]);

  return { units, loading };
}

// ─── useMissionsBySubject ─────────────────────────────────────────────────
export function useMissionsBySubject(subjectId: string | null, classId: string | null) {
  const [missions, setMissions] = useState<(MissionDoc & { id: string })[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!subjectId || !classId) { setLoading(false); return; }
    const q = query(
      collection(db, "missions"),
      where("subjectId", "==", subjectId),
      where("classId", "==", classId),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as MissionDoc & { id: string })));
      setLoading(false);
    });
    return unsub;
  }, [subjectId, classId]);

  return { missions, loading };
}

// ─── ADMIN HOOKS ──────────────────────────────────────────────────────────

// useSchool — live school doc
export function useSchool(schoolId: string | null) {
  const [school, setSchool] = useState<SchoolDoc | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    return onSnapshot(doc(db, "schools", schoolId), (snap) => {
      setSchool(snap.exists() ? ({ id: snap.id, ...snap.data() } as SchoolDoc) : null);
      setLoading(false);
    });
  }, [schoolId]);
  return { school, loading };
}

// useAcademicYear — live current academic year
export function useAcademicYear(yearId: string | null) {
  const [year, setYear] = useState<AcademicYearDoc | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!yearId) { setLoading(false); return; }
    return onSnapshot(doc(db, "academicYears", yearId), (snap) => {
      setYear(snap.exists() ? ({ id: snap.id, ...snap.data() } as AcademicYearDoc) : null);
      setLoading(false);
    });
  }, [yearId]);
  return { year, loading };
}

// useAllStudents — all student profiles for a school
export function useAllStudents(schoolId: string | null) {
  const [students, setStudents] = useState<(StudentProfileDoc & { uid: string })[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const q = query(
      collection(db, "studentProfiles"),
      where("schoolId", "==", schoolId),
      orderBy("displayName", "asc")
    );
    return onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as StudentProfileDoc & { uid: string })));
      setLoading(false);
    });
  }, [schoolId]);
  return { students, loading };
}

// useAllClasses — all classes for a school + academic year
export function useAllClasses(schoolId: string | null, academicYear?: string) {
  const [classes, setClasses] = useState<(ClassDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const constraints = [where("schoolId", "==", schoolId)];
    if (academicYear) constraints.push(where("academicYear", "==", academicYear));
    const q = query(collection(db, "classes"), ...constraints, orderBy("gradeLevel", "asc"));
    return onSnapshot(q, (snap) => {
      setClasses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClassDoc & { id: string })));
      setLoading(false);
    });
  }, [schoolId, academicYear]);
  return { classes, loading };
}

// useAllStaff — all staff for a school
export function useAllStaff(schoolId: string | null) {
  const [staff, setStaff] = useState<(StaffDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const q = query(
      collection(db, "staff"),
      where("schoolId", "==", schoolId),
      where("isActive", "==", true),
      orderBy("role", "asc")
    );
    return onSnapshot(q, (snap) => {
      setStaff(snap.docs.map((d) => ({ id: d.id, ...d.data() } as StaffDoc & { id: string })));
      setLoading(false);
    });
  }, [schoolId]);
  return { staff, loading };
}

// useEnrollments — all enrollments for a school + academic year
export function useEnrollments(schoolId: string | null, academicYear?: string) {
  const [enrollments, setEnrollments] = useState<(EnrollmentDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const constraints = [where("schoolId", "==", schoolId)];
    if (academicYear) constraints.push(where("academicYear", "==", academicYear));
    const q = query(collection(db, "enrollments"), ...constraints, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setEnrollments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EnrollmentDoc & { id: string })));
      setLoading(false);
    });
  }, [schoolId, academicYear]);
  return { enrollments, loading };
}

// useAnnouncements — school-wide or class-specific announcements
export function useAnnouncements(schoolId: string | null, classId?: string) {
  const [announcements, setAnnouncements] = useState<(AnnouncementDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const constraints = [where("schoolId", "==", schoolId)];
    if (classId) constraints.push(where("classId", "==", classId));
    const q = query(collection(db, "announcements"), ...constraints, orderBy("createdAt", "desc"), limit(20));
    return onSnapshot(q, (snap) => {
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnnouncementDoc & { id: string })));
      setLoading(false);
    });
  }, [schoolId, classId]);
  return { announcements, loading };
}

// useEvents — upcoming school events
export function useEvents(schoolId: string | null) {
  const [events, setEvents] = useState<(EventDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    const q = query(
      collection(db, "events"),
      where("schoolId", "==", schoolId),
      orderBy("startDate", "asc"),
      limit(20)
    );
    return onSnapshot(q, (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventDoc & { id: string })));
      setLoading(false);
    });
  }, [schoolId]);
  return { events, loading };
}

// ─── ADMIN MUTATIONS ──────────────────────────────────────────────────────

// createClass — admin creates a new class
export async function createClass(data: Omit<ClassDoc, "id" | "createdAt" | "updatedAt" | "studentUids">) {
  const ref = await addDoc(collection(db, "classes"), {
    ...data,
    studentUids: [],
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// updateEnrollmentStatus — admin changes enrollment status
export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: string,
  adminUid: string
) {
  await updateDoc(doc(db, "enrollments", enrollmentId), {
    status,
    updatedAt: serverTimestamp(),
    [`statusHistory.${Date.now()}`]: { status, changedBy: adminUid, at: serverTimestamp() },
  });
}

// createEnrollment — admin enrolls a student in a class
export async function createEnrollment(data: Omit<EnrollmentDoc, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(db, "enrollments"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // Add student to class roster
  const classRef = doc(db, "classes", data.classId);
  const classSnap = await getDoc(classRef);
  if (classSnap.exists()) {
    const current: string[] = classSnap.data().studentUids ?? [];
    if (!current.includes(data.studentUid)) {
      await updateDoc(classRef, { studentUids: [...current, data.studentUid], updatedAt: serverTimestamp() });
    }
  }
  return ref.id;
}

// createAnnouncement — admin/educator creates announcement
export async function createAnnouncement(data: Omit<AnnouncementDoc, "id" | "createdAt">) {
  const ref = await addDoc(collection(db, "announcements"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Ensure today's tarbiyah doc exists (create skeleton if missing)
export async function ensureTodayTarbiyah(studentUid: string, template: TarbiyahDayDoc) {
  const ref = doc(db, "studentProfiles", studentUid, "tarbiyah", today());
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      ...template,
      date: today(),
      studentUid,
      totalPoints: 0,
      overallPct: 0,
      categories: template.categories.map((c) => ({
        ...c,
        pointsEarned: 0,
        tasks: c.tasks.map((t) => ({ ...t, done: false })),
      })),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
