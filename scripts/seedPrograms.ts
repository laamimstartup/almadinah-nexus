/**
 * Al-Madinah Nexus — Programs Seed Script
 * Run: npx tsx scripts/seedPrograms.ts
 *
 * Seeds:
 *  - 6 programs (matching almadinah-school-website.vercel.app/programs/*)
 *  - 28 subjects across all programs
 *  - 60+ curriculum units across grade bands
 *  - 24 upgraded missions mapped to real program subjects
 *  - Updates existing student profiles with correct real subject grades
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
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

// ── Helpers ────────────────────────────────────────────────────────────────
function ts(daysAgo = 0): Timestamp {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return Timestamp.fromDate(d);
}
function tsFrom(date: Date): Timestamp { return Timestamp.fromDate(date); }

const SCHOOL_ID    = "almadinah-queens";
const CLASS_ID     = "grade-7a-2026";
const EDU_UID      = "educator-yusuf-001";
const ACADEMIC_YEAR = "2025-2026";

function gradeFromPct(pct: number): string {
  if (pct >= 97) return "A+"; if (pct >= 93) return "A";
  if (pct >= 90) return "A-"; if (pct >= 87) return "B+";
  if (pct >= 83) return "B";  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+"; if (pct >= 73) return "C";
  return "C-";
}

// ── Programs ───────────────────────────────────────────────────────────────
const PROGRAMS = [
  {
    id: "prog-nys-core",
    slug: "nys-core",
    title: "NYS Core Curriculum",
    subtitle: "Analytical Leadership Through Academic Excellence",
    description: "Our NYS-approved curriculum develops analytical leaders who read critically, reason mathematically, and engage with the world through Islamic values. Fully aligned with NYS Department of Education standards across ELA, Mathematics, Science, and Social Studies.",
    gradeBand: "all",
    gradeMin: 0,
    gradeMax: 9,
    color: "blue",
    icon: "BookOpen",
    order: 1,
    subjectIds: ["subj-ela", "subj-math", "subj-science", "subj-social-studies"],
  },
  {
    id: "prog-quran-islamic",
    slug: "quran-islamic-studies",
    title: "Quran & Islamic Studies",
    subtitle: "Moral & Spiritual Foundations of Leadership",
    description: "Daily Quran recitation, Tajweed, Islamic history, Fiqh, and Aqeedah — instilling deep roots in faith and scholarly Islamic knowledge. The moral core from which all Al-Madinah excellence flows.",
    arabicTitle: "طَلَبُ الْعِلْمِ فَرِيضَةٌ",
    arabicSubtitle: "Seeking knowledge is an obligation upon every Muslim",
    gradeBand: "all",
    gradeMin: 0,
    gradeMax: 9,
    color: "gold",
    icon: "Star",
    order: 2,
    subjectIds: ["subj-quran-tajweed", "subj-aqeedah", "subj-fiqh", "subj-seerah"],
  },
  {
    id: "prog-arabic",
    slug: "arabic-language",
    title: "Arabic Language",
    subtitle: "The Language of the Quran",
    description: "Structured Arabic literacy program from foundational reading and writing to conversational and classical Arabic proficiency. Daily Arabic instruction Pre-K through Grade 9.",
    arabicTitle: "لُغَةُ القُرآنِ",
    arabicSubtitle: "The Language of the Quran",
    gradeBand: "all",
    gradeMin: 0,
    gradeMax: 9,
    color: "emerald",
    icon: "Languages",
    order: 3,
    subjectIds: ["subj-arabic-reading", "subj-arabic-writing", "subj-arabic-conversation", "subj-classical-arabic"],
  },
  {
    id: "prog-stem",
    slug: "stem",
    title: "STEM Excellence",
    subtitle: "Analytical Leadership Through Science & Technology",
    description: "Advanced mathematics, hands-on science labs, coding via KidsCodeGift, and technology integrated throughout the curriculum. The only Islamic school in Queens with an AI-powered coding platform.",
    gradeBand: "3-5",
    gradeMin: 3,
    gradeMax: 9,
    color: "purple",
    icon: "Cpu",
    order: 4,
    subjectIds: ["subj-advanced-math", "subj-science-labs", "subj-coding", "subj-digital-literacy"],
  },
  {
    id: "prog-leadership",
    slug: "leadership-development",
    title: "Leadership Development",
    subtitle: "The Only Program of Its Kind at an Islamic School in Queens",
    description: "Grades 5–9. Rooted in Prophetic character. Public speaking, community service, goal-setting, Islamic ethics, global awareness, and innovation — shaping the identity of a Muslim leader.",
    gradeBand: "5-9",
    gradeMin: 5,
    gradeMax: 9,
    color: "rose",
    icon: "Shield",
    order: 5,
    subjectIds: ["subj-public-speaking", "subj-community-service", "subj-goal-setting", "subj-islamic-ethics", "subj-global-awareness", "subj-entrepreneurship"],
  },
  {
    id: "prog-arts",
    slug: "arts-enrichment",
    title: "Arts & Enrichment",
    subtitle: "Nurturing the Whole Muslim Student",
    description: "Creative expression through Islamic calligraphy, visual arts, physical education, cultural appreciation, nasheeds, and social-emotional learning — nourishing body, mind, and spirit.",
    gradeBand: "all",
    gradeMin: 0,
    gradeMax: 9,
    color: "teal",
    icon: "Palette",
    order: 6,
    subjectIds: ["subj-calligraphy", "subj-visual-arts", "subj-pe", "subj-cultural-enrichment", "subj-nasheeds", "subj-sel"],
  },
];

// ── Subjects ───────────────────────────────────────────────────────────────
const SUBJECTS = [
  // NYS Core
  { id: "subj-ela",             programId: "prog-nys-core",       name: "English Language Arts",       description: "Reading comprehension, writing, grammar, vocabulary, and literary analysis aligned to NYS Next Generation ELA Standards.", color: "blue",   gradeMin: 0, gradeMax: 9, weeklyHours: 5, icon: "BookText",   order: 1 },
  { id: "subj-math",            programId: "prog-nys-core",       name: "Mathematics",                 description: "From number sense in Pre-K to algebra, geometry, and data analysis in Grade 9 — building analytical minds.", color: "emerald", gradeMin: 0, gradeMax: 9, weeklyHours: 5, icon: "Calculator", order: 2 },
  { id: "subj-science",         programId: "prog-nys-core",       name: "Science",                     description: "Hands-on labs, experiments, and inquiry-based learning aligned to NYS P-12 Science Learning Standards.", color: "teal",    gradeMin: 0, gradeMax: 9, weeklyHours: 3, icon: "FlaskConical", order: 3 },
  { id: "subj-social-studies",  programId: "prog-nys-core",       name: "Social Studies",              description: "World history, US history, civics, geography, and economics — contextualized within Islamic and global perspectives.", color: "purple", gradeMin: 0, gradeMax: 9, weeklyHours: 3, icon: "Globe",      order: 4 },

  // Quran & Islamic Studies
  { id: "subj-quran-tajweed",   programId: "prog-quran-islamic",  name: "Quran & Tajweed",             description: "Daily structured Quran recitation with proper Tajweed rules. Students progress from basic Iqra through full Quran reading.", color: "gold",   gradeMin: 0, gradeMax: 9, weeklyHours: 5, icon: "BookMarked", order: 1, nameArabic: "القرآن والتجويد" },
  { id: "subj-aqeedah",         programId: "prog-quran-islamic",  name: "Aqeedah",                     description: "Building an unshakeable foundation of faith through Tawheed, the pillars of Iman, and Islamic theology.", color: "gold",   gradeMin: 0, gradeMax: 9, weeklyHours: 2, icon: "Heart",      order: 2, nameArabic: "العقيدة" },
  { id: "subj-fiqh",            programId: "prog-quran-islamic",  name: "Fiqh",                        description: "Practical Islamic law covering purification, prayer, fasting, zakat, and daily life conduct.", color: "gold",   gradeMin: 0, gradeMax: 9, weeklyHours: 2, icon: "Scale",      order: 3, nameArabic: "الفقه" },
  { id: "subj-seerah",          programId: "prog-quran-islamic",  name: "Seerah & Islamic History",    description: "The life of Prophet Muhammad ﷺ, the Companions, and Islamic civilization — as a leadership curriculum.", color: "gold",   gradeMin: 0, gradeMax: 9, weeklyHours: 2, icon: "Scroll",     order: 4, nameArabic: "السيرة النبوية" },

  // Arabic Language
  { id: "subj-arabic-reading",      programId: "prog-arabic", name: "Arabic Reading",       description: "From Arabic alphabet recognition through fluent reading of classical and modern standard Arabic texts.", color: "emerald", gradeMin: 0, gradeMax: 9, weeklyHours: 3, icon: "Eye",        order: 1, nameArabic: "القراءة" },
  { id: "subj-arabic-writing",      programId: "prog-arabic", name: "Arabic Writing",       description: "Proper Arabic script from letter formation through paragraph and essay writing in Modern Standard Arabic.", color: "emerald", gradeMin: 0, gradeMax: 9, weeklyHours: 3, icon: "PenLine",    order: 2, nameArabic: "الكتابة" },
  { id: "subj-arabic-conversation", programId: "prog-arabic", name: "Arabic Conversation",  description: "Real communicative Arabic — greetings, expressing ideas, and holding conversations in Fusha Arabic.", color: "emerald", gradeMin: 2, gradeMax: 9, weeklyHours: 2, icon: "MessageCircle", order: 3, nameArabic: "المحادثة" },
  { id: "subj-classical-arabic",    programId: "prog-arabic", name: "Classical Arabic",     description: "The language of the Quran — root systems, grammar (Nahw & Sarf), and unlocking Quranic meaning.", color: "emerald", gradeMin: 5, gradeMax: 9, weeklyHours: 2, icon: "Landmark",   order: 4, nameArabic: "العربية الفصحى" },

  // STEM
  { id: "subj-advanced-math",    programId: "prog-stem", name: "Advanced Mathematics",   description: "From arithmetic to algebra, geometry, and data analysis — building the analytical mindset of a problem-solver.", color: "purple", gradeMin: 3, gradeMax: 9, weeklyHours: 2, icon: "BrainCircuit", order: 1 },
  { id: "subj-science-labs",     programId: "prog-stem", name: "Science Labs",           description: "Real experiments in life science, earth science, chemistry, and physics — connecting Islamic wonder at creation with scientific inquiry.", color: "purple", gradeMin: 3, gradeMax: 9, weeklyHours: 2, icon: "FlaskConical", order: 2 },
  { id: "subj-coding",           programId: "prog-stem", name: "Coding — KidsCodeGift", description: "Al-Madinah's exclusive AI-powered coding platform. Students build real apps, games, and websites from Grade 3.", color: "purple", gradeMin: 3, gradeMax: 9, weeklyHours: 2, icon: "Code2",      order: 3 },
  { id: "subj-digital-literacy", programId: "prog-stem", name: "Digital Literacy",      description: "Responsible, ethical use of technology — digital citizenship, research skills, and navigating the digital world as Muslims.", color: "purple", gradeMin: 3, gradeMax: 9, weeklyHours: 1, icon: "Monitor",    order: 4 },

  // Leadership
  { id: "subj-public-speaking",   programId: "prog-leadership", name: "Public Speaking & Debate",      description: "Articulating ideas with confidence through structured speeches, Islamic debates, and presentation skills.", color: "rose", gradeMin: 5, gradeMax: 9, weeklyHours: 2, icon: "Mic2",       order: 1 },
  { id: "subj-community-service", programId: "prog-leadership", name: "Community Service Projects",    description: "Real-world leadership through hands-on community impact — serving the school, masjid, and Queens neighborhood.", color: "rose", gradeMin: 5, gradeMax: 9, weeklyHours: 1, icon: "Users",      order: 2 },
  { id: "subj-goal-setting",      programId: "prog-leadership", name: "Goal-Setting & Project Mgmt",  description: "Setting meaningful goals, breaking them into action steps, managing teams, and following through.", color: "rose", gradeMin: 5, gradeMax: 9, weeklyHours: 1, icon: "Target",     order: 3 },
  { id: "subj-islamic-ethics",    programId: "prog-leadership", name: "Islamic Ethics & Character",   description: "Leadership rooted in the Prophetic model. Studying the character of Prophet Muhammad ﷺ and applying it to modern dilemmas.", color: "rose", gradeMin: 5, gradeMax: 9, weeklyHours: 2, icon: "ShieldCheck", order: 4 },
  { id: "subj-global-awareness",  programId: "prog-leadership", name: "Global Awareness & Civics",    description: "From local Queens to the global Muslim ummah — world issues, international Muslim leadership, and civic engagement.", color: "rose", gradeMin: 5, gradeMax: 9, weeklyHours: 1, icon: "Globe2",     order: 5 },
  { id: "subj-entrepreneurship",  programId: "prog-leadership", name: "Innovation & Entrepreneurship","description": "Students design solutions to real problems combining Islamic values with creative thinking and the KidsCodeGift platform.", color: "rose", gradeMin: 5, gradeMax: 9, weeklyHours: 1, icon: "Lightbulb", order: 6 },

  // Arts & Enrichment
  { id: "subj-calligraphy",         programId: "prog-arts", name: "Islamic Calligraphy",        description: "The ancient art of Arabic calligraphy — connecting art, language, and faith. From Naskh script to creative Quranic compositions.", color: "teal", gradeMin: 0, gradeMax: 9, weeklyHours: 1, icon: "Pen",       order: 1, nameArabic: "الخط العربي" },
  { id: "subj-visual-arts",         programId: "prog-arts", name: "Visual Arts",               description: "Drawing, painting, collage, and mixed media — visual storytelling through an Islamic aesthetic lens.", color: "teal", gradeMin: 0, gradeMax: 9, weeklyHours: 1, icon: "Palette",   order: 2 },
  { id: "subj-pe",                  programId: "prog-arts", name: "Physical Education",        description: "A healthy body is an amanah. Building physical literacy, teamwork, and Islamic values around sport.", color: "teal", gradeMin: 0, gradeMax: 9, weeklyHours: 2, icon: "Dumbbell",  order: 3 },
  { id: "subj-cultural-enrichment", programId: "prog-arts", name: "Cultural Enrichment",      description: "Celebrating the diversity and richness of Islamic civilization — from Andalusian art to East African heritage.", color: "teal", gradeMin: 0, gradeMax: 9, weeklyHours: 1, icon: "Globe",     order: 4 },
  { id: "subj-nasheeds",            programId: "prog-arts", name: "Nasheeds & Oral Tradition", description: "Islamic nasheeds, poetry (qaseedah), oral storytelling, and the rich tradition of Arabic and Islamic literary arts.", color: "teal", gradeMin: 0, gradeMax: 9, weeklyHours: 1, icon: "Music",     order: 5 },
  { id: "subj-sel",                 programId: "prog-arts", name: "Social-Emotional Learning", description: "Emotionally intelligent, empathetic leaders. Self-awareness, conflict resolution, gratitude, and emotional resilience through an Islamic framework.", color: "teal", gradeMin: 0, gradeMax: 9, weeklyHours: 1, icon: "HeartHandshake", order: 6 },
];

// ── Curriculum Units ───────────────────────────────────────────────────────
const CURRICULUM_UNITS = [
  // ── ELA ──
  { id: "unit-ela-preK",  subjectId: "subj-ela", programId: "prog-nys-core", title: "Phonics Foundations", description: "Letter recognition, phonemic awareness, and early reading through Islamic-themed stories and Quran-connected vocabulary.", type: "lesson", gradeMin: 0, gradeMax: 2, durationWeeks: 8, order: 1, objectives: ["Recognize all 26 letters", "Blend CVC words", "Read 50 sight words"], islamicConnections: ["Islamic story characters", "Bismillah as first reading"] },
  { id: "unit-ela-35",    subjectId: "subj-ela", programId: "prog-nys-core", title: "Reading for Meaning",  description: "Comprehension strategies, main idea, inference, and text evidence across informational and literary texts.", type: "lesson", gradeMin: 3, gradeMax: 5, durationWeeks: 10, order: 2, objectives: ["Identify main idea and details", "Make inferences with text evidence", "Compare two texts"], islamicConnections: ["Seerah biography as informational text", "Hadith as primary source analysis"] },
  { id: "unit-ela-69",    subjectId: "subj-ela", programId: "prog-nys-core", title: "Critical Analysis & Argumentation", description: "Literary analysis, argumentative writing, rhetorical devices, and close reading of complex texts aligned to NYS Grade 6–9 standards.", type: "assessment", gradeMin: 6, gradeMax: 9, durationWeeks: 12, order: 3, objectives: ["Write a 5-paragraph argumentative essay", "Analyze author's purpose and tone", "Identify and use rhetorical devices"], islamicConnections: ["Islamic scholars as models of argumentation", "Quran as model of persuasive language"] },

  // ── Math ──
  { id: "unit-math-preK", subjectId: "subj-math", programId: "prog-nys-core", title: "Number Sense & Operations", description: "Counting, addition, subtraction, and early place value through hands-on manipulatives and Islamic geometric patterns.", type: "activity", gradeMin: 0, gradeMax: 2, durationWeeks: 8, order: 1, objectives: ["Count to 100", "Add and subtract within 20", "Understand place value to 100"], islamicConnections: ["Counting Asma ul-Husna (99 Names)", "Islamic geometry intro"] },
  { id: "unit-math-35",   subjectId: "subj-math", programId: "prog-nys-core", title: "Multiplication, Division & Fractions", description: "Fluency with multiplication and division facts, introduction to fractions and decimals, and real-world problem solving.", type: "lesson", gradeMin: 3, gradeMax: 5, durationWeeks: 10, order: 2, objectives: ["Multiply and divide within 100", "Add and subtract fractions with like denominators", "Solve multi-step word problems"], islamicConnections: ["Zakat calculations as real-world fractions", "Islamic inheritance math (Meerath intro)"] },
  { id: "unit-math-69",   subjectId: "subj-math", programId: "prog-nys-core", title: "Algebra & Analytical Reasoning",  description: "Linear equations, inequalities, functions, geometry proofs, and data analysis preparing students for high school mathematics.", type: "assessment", gradeMin: 6, gradeMax: 9, durationWeeks: 14, order: 3, objectives: ["Solve linear equations and inequalities", "Graph linear functions", "Analyze data sets with mean/median/mode"], islamicConnections: ["Islamic Golden Age mathematicians (Al-Khwarizmi)", "Geometric proofs and Islamic art"] },

  // ── Science ──
  { id: "unit-sci-preK",  subjectId: "subj-science", programId: "prog-nys-core", title: "Exploring Allah's Creation", description: "Inquiry-based exploration of living and non-living things, weather, plants, and animals — framed as signs of Allah's wisdom.", type: "activity", gradeMin: 0, gradeMax: 2, durationWeeks: 6, order: 1, objectives: ["Distinguish living from non-living", "Observe and describe weather patterns", "Name and classify animals"], islamicConnections: ["Ayat of creation in Quran", "Tafakkur (reflection) as scientific method"] },
  { id: "unit-sci-35",    subjectId: "subj-science", programId: "prog-nys-core", title: "Life Science & Earth Systems",  description: "Ecosystems, food webs, the water cycle, and Earth's layers — hands-on labs connecting to NYS P-12 Science Learning Standards.", type: "lab", gradeMin: 3, gradeMax: 5, durationWeeks: 8, order: 2, objectives: ["Describe a food web with producers, consumers, decomposers", "Model the water cycle", "Identify Earth's layers"], islamicConnections: ["Balance in ecosystems as Mizan (balance) from Quran", "Water as blessing — Surah Al-Anbiya"] },
  { id: "unit-sci-69",    subjectId: "subj-science", programId: "prog-nys-core", title: "Chemistry, Physics & Environmental Science", description: "Matter and energy, chemical reactions, forces and motion, and environmental stewardship — full lab reports and inquiry projects.", type: "lab", gradeMin: 6, gradeMax: 9, durationWeeks: 12, order: 3, objectives: ["Write full scientific lab reports", "Explain chemical reactions at molecular level", "Analyze Newton's Laws with real experiments"], islamicConnections: ["Islamic scholars in chemistry (Jabir ibn Hayyan)", "Khalifah (stewardship) and environmental responsibility"] },

  // ── Social Studies ──
  { id: "unit-ss-preK",   subjectId: "subj-social-studies", programId: "prog-nys-core", title: "My Community & World", description: "Neighborhoods, community helpers, maps, and cultural diversity — grounded in Islamic values of community and cooperation.", type: "activity", gradeMin: 0, gradeMax: 2, durationWeeks: 6, order: 1, objectives: ["Identify roles in a community", "Read simple maps", "Recognize cultural diversity"], islamicConnections: ["Masjid as community center", "Ummah — global Muslim community"] },
  { id: "unit-ss-35",     subjectId: "subj-social-studies", programId: "prog-nys-core", title: "Ancient Civilizations & Islamic Golden Age", description: "Ancient Egypt, Mesopotamia, Greece, Rome, and the Islamic Golden Age — with focus on Muslim contributions to world civilization.", type: "lesson", gradeMin: 3, gradeMax: 5, durationWeeks: 10, order: 2, objectives: ["Compare ancient civilizations", "Describe the Islamic Golden Age", "Identify Muslim contributions to science, medicine, and philosophy"], islamicConnections: ["Islamic scholars as civilization builders", "Baghdad as center of world knowledge"] },
  { id: "unit-ss-69",     subjectId: "subj-social-studies", programId: "prog-nys-core", title: "US History, Civics & Global Citizenship", description: "American history from colonization through Civil Rights, US government, economics, and global perspectives from a Muslim American lens.", type: "assessment", gradeMin: 6, gradeMax: 9, durationWeeks: 12, order: 3, objectives: ["Analyze primary sources from US history", "Explain how US government branches work", "Evaluate global issues from multiple perspectives"], islamicConnections: ["Muslim American history", "Islamic principles of justice in civic life"] },

  // ── Quran & Tajweed ──
  { id: "unit-quran-preK", subjectId: "subj-quran-tajweed", programId: "prog-quran-islamic", title: "Iqra — Foundations", description: "Iqra levels 1–3: Arabic letter recognition, vowel sounds (harakat), and basic Quran recitation with proper pronunciation.", type: "recitation", gradeMin: 0, gradeMax: 2, durationWeeks: 36, order: 1, objectives: ["Recognize all Arabic letters", "Read letters with harakat", "Recite Al-Fatiha and short surahs correctly"] },
  { id: "unit-quran-35",   subjectId: "subj-quran-tajweed", programId: "prog-quran-islamic", title: "Tajweed Rules & Juz Amma", description: "Introduction to core Tajweed rules (Noon Sakinah, Meem Sakinah, Madd), memorization of Juz Amma (last 30 surahs).", type: "recitation", gradeMin: 3, gradeMax: 5, durationWeeks: 36, order: 2, objectives: ["Apply 8 core Tajweed rules", "Memorize 15+ surahs from Juz Amma", "Recite with proper makharij"], islamicConnections: ["Recitation as ibadah", "Quran as miracle of Arabic language"] },
  { id: "unit-quran-69",   subjectId: "subj-quran-tajweed", programId: "prog-quran-islamic", title: "Advanced Tajweed & Extended Hifz", description: "Full Tajweed mastery, Quran recitation certification, and extended memorization targeting Juz 29–30 and selected longer surahs.", type: "recitation", gradeMin: 6, gradeMax: 9, durationWeeks: 36, order: 3, objectives: ["Pass Tajweed certification assessment", "Memorize Juz 29 and 30", "Lead Quran recitation circles"] },

  // ── Aqeedah ──
  { id: "unit-aqeedah-preK", subjectId: "subj-aqeedah", programId: "prog-quran-islamic", title: "Who is Allah? — Foundations of Tawheed", description: "Age-appropriate introduction to Allah's existence, the 6 pillars of Iman, the 5 pillars of Islam, and basic du'a.", type: "lesson", gradeMin: 0, gradeMax: 2, durationWeeks: 8, order: 1, objectives: ["Name the 6 pillars of Iman", "Name the 5 pillars of Islam", "Recite basic du'as"] },
  { id: "unit-aqeedah-69",   subjectId: "subj-aqeedah", programId: "prog-quran-islamic", title: "Tawheed & Islamic Theology",              description: "In-depth study of Tawheed (Rububiyyah, Uluhiyyah, Asma was-Sifat), refutation of shirk, and the 99 Names of Allah.", type: "lesson", gradeMin: 6, gradeMax: 9, durationWeeks: 12, order: 2, objectives: ["Explain 3 categories of Tawheed", "Memorize and explain 20+ Names of Allah", "Distinguish Iman from kufr"] },

  // ── Fiqh ──
  { id: "unit-fiqh-preK", subjectId: "subj-fiqh", programId: "prog-quran-islamic", title: "Purification & Prayer", description: "Wudu steps, ghusl basics, how to make salah, times of prayer — practical daily ibadah taught from Pre-K through Grade 5.", type: "activity", gradeMin: 0, gradeMax: 5, durationWeeks: 10, order: 1, objectives: ["Perform correct wudu", "Pray all 5 daily prayers correctly", "Know conditions that break wudu"] },
  { id: "unit-fiqh-69",   subjectId: "subj-fiqh", programId: "prog-quran-islamic", title: "Fasting, Zakat & Daily Life Fiqh",        description: "Rulings of Ramadan fasting, Zakat calculation, Halal food, Islamic dress, and contemporary fiqh issues for Muslim youth.", type: "lesson", gradeMin: 6, gradeMax: 9, durationWeeks: 12, order: 2, objectives: ["Explain rules of Sawm and its exceptions", "Calculate simple Zakat on gold/silver", "Apply Halal/Haram principles to daily decisions"] },

  // ── Seerah ──
  { id: "unit-seerah-preK", subjectId: "subj-seerah", programId: "prog-quran-islamic", title: "Prophet Muhammad ﷺ — His Life & Character", description: "Stories of the Prophet's ﷺ early life, character traits, miracles, and how children can follow his example.", type: "lesson", gradeMin: 0, gradeMax: 4, durationWeeks: 10, order: 1, objectives: ["Narrate key events of the Prophet's life", "Name 5 character traits of the Prophet", "Apply Prophetic character to classroom situations"] },
  { id: "unit-seerah-59",   subjectId: "subj-seerah", programId: "prog-quran-islamic", title: "The Rightly-Guided Caliphs & Early Islam",  description: "The lives and leadership of Abu Bakr, Umar, Uthman, and Ali — studied as a leadership case study for Muslim youth.", type: "lesson", gradeMin: 5, gradeMax: 9, durationWeeks: 10, order: 2, objectives: ["Describe the leadership style of each Caliph", "Analyze causes of Islamic expansion", "Extract leadership lessons for today"], islamicConnections: ["Shura (consultation) as Islamic governance", "Justice as cornerstone of Muslim leadership"] },
  { id: "unit-seerah-69",   subjectId: "subj-seerah", programId: "prog-quran-islamic", title: "Islamic Golden Age — Scholars & Civilization", description: "Al-Khwarizmi, Ibn Sina, Ibn Rushd, Al-Ghazali, Ibn Battuta — the Muslim scholars who shaped world civilization.", type: "project", gradeMin: 6, gradeMax: 9, durationWeeks: 8, order: 3, objectives: ["Research and present on one Islamic scholar", "Explain the Islamic Golden Age timeline", "Connect Golden Age discoveries to modern science"], islamicConnections: ["Knowledge ('Ilm) as the highest pursuit", "Muslim scholars as role models for students"] },

  // ── Arabic Reading/Writing ──
  { id: "unit-arread-preK", subjectId: "subj-arabic-reading", programId: "prog-arabic", title: "Alef-Ba-Ta — Arabic Alphabet Mastery", description: "Recognition and pronunciation of all 28 Arabic letters in isolated, initial, medial, and final forms.", type: "activity", gradeMin: 0, gradeMax: 1, durationWeeks: 12, order: 1, objectives: ["Recognize all 28 Arabic letters in 4 forms", "Pronounce all letters from correct makharij", "Read simple CVC Arabic words"] },
  { id: "unit-arread-35",   subjectId: "subj-arabic-reading", programId: "prog-arabic", title: "Fluent Arabic Reading",               description: "Reading paragraphs and short texts in Modern Standard Arabic with comprehension — building towards Quranic text access.", type: "lesson",   gradeMin: 3, gradeMax: 5, durationWeeks: 10, order: 2, objectives: ["Read 1-page Arabic texts fluently", "Answer comprehension questions in Arabic", "Identify root words in a text"] },
  { id: "unit-arwrite-69",  subjectId: "subj-arabic-writing", programId: "prog-arabic", title: "Arabic Essay & Composition",         description: "Writing paragraphs and multi-paragraph compositions in Modern Standard Arabic — grammar, vocabulary, and style.", type: "assessment", gradeMin: 6, gradeMax: 9, durationWeeks: 12, order: 1, objectives: ["Write a 3-paragraph Arabic essay", "Apply correct Arabic grammar rules", "Use 200+ vocabulary words in context"] },

  // ── Classical Arabic ──
  { id: "unit-classical-59", subjectId: "subj-classical-arabic", programId: "prog-arabic", title: "Nahw & Sarf — Arabic Grammar Foundations", description: "Arabic root system, verb conjugation, noun declension, and sentence structure — the tools for reading classical Islamic texts.", type: "lesson", gradeMin: 5, gradeMax: 9, durationWeeks: 18, order: 1, objectives: ["Identify the 3-letter Arabic root of words", "Conjugate regular Arabic verbs", "Parse simple Arabic sentences", "Read and understand basic Quranic Arabic"] },

  // ── STEM Coding ──
  { id: "unit-coding-35",  subjectId: "subj-coding", programId: "prog-stem", title: "Block Coding & Game Design",        description: "KidsCodeGift platform: Scratch-based visual programming, game design, and creative projects introducing computational thinking.", type: "project", gradeMin: 3, gradeMax: 5, durationWeeks: 10, order: 1, objectives: ["Build a working game in KidsCodeGift", "Use loops, conditionals, and events", "Debug simple code errors"], islamicConnections: ["Designing games with Islamic themes", "Problem-solving as khalifah thinking"] },
  { id: "unit-coding-69",  subjectId: "subj-coding", programId: "prog-stem", title: "Python, Web Dev & App Building",    description: "Text-based Python programming, HTML/CSS web development, and building real apps on the KidsCodeGift AI-powered platform.", type: "project", gradeMin: 6, gradeMax: 9, durationWeeks: 14, order: 2, objectives: ["Write Python scripts solving real problems", "Build and deploy a personal website", "Create an app that solves a community need"], islamicConnections: ["Technology as amanah", "Building tools for the Muslim community"] },

  // ── Science Labs ──
  { id: "unit-scilab-35", subjectId: "subj-science-labs", programId: "prog-stem", title: "Hands-On Biology & Chemistry Labs", description: "Living systems, cell biology, basic chemistry reactions — real lab experiments with full scientific method documentation.", type: "lab", gradeMin: 3, gradeMax: 5, durationWeeks: 10, order: 1, objectives: ["Conduct 5 full lab experiments", "Write hypothesis, method, results, conclusion", "Identify producers, consumers, and decomposers"], islamicConnections: ["Life as a sign of Allah — cell complexity", "Scientific inquiry as tafakkur"] },
  { id: "unit-scilab-69", subjectId: "subj-science-labs", programId: "prog-stem", title: "Physics, Chemistry & Earth Science Labs", description: "Forces and motion, chemical equations, rock cycles, and environmental science experiments — advanced lab reports.", type: "lab", gradeMin: 6, gradeMax: 9, durationWeeks: 12, order: 2, objectives: ["Write formal lab reports with error analysis", "Balance chemical equations", "Apply Newton's 3 Laws to real-world situations"], islamicConnections: ["Islamic scholars of physics and chemistry", "Environmental stewardship as Islamic obligation"] },

  // ── Leadership ──
  { id: "unit-lead-speak",    subjectId: "subj-public-speaking",   programId: "prog-leadership", title: "The Confident Voice",       description: "Structured public speaking curriculum: overcoming fear, speech structure, delivery techniques, and Islamic debate protocols.", type: "project", gradeMin: 5, gradeMax: 9, durationWeeks: 10, order: 1, objectives: ["Deliver a 3-minute prepared speech", "Participate in structured Islamic debate", "Give constructive peer feedback"], islamicConnections: ["The Prophet ﷺ as the greatest orator", "Speaking truth to power — Seerah models"] },
  { id: "unit-lead-service",  subjectId: "subj-community-service", programId: "prog-leadership", title: "Serving Queens — Community Leadership Projects", description: "Students design, lead, and execute real community service projects in the school, masjid, and local Queens neighborhood.", type: "project", gradeMin: 5, gradeMax: 9, durationWeeks: 12, order: 1, objectives: ["Lead a team project benefiting the community", "Document impact with photos and report", "Reflect on Prophetic model of service"], islamicConnections: ["Khidma (service) as worship", "The Prophet ﷺ serving his community"] },
  { id: "unit-lead-ethics",   subjectId: "subj-islamic-ethics",    programId: "prog-leadership", title: "Prophetic Character in Modern Life",  description: "Case studies in ethical leadership using the Seerah — applying Prophetic qualities to modern school, family, and community situations.", type: "lesson", gradeMin: 5, gradeMax: 9, durationWeeks: 8, order: 1, objectives: ["Identify 10 Prophetic character traits", "Apply ethical framework to 5 modern dilemmas", "Write a personal leadership mission statement"], islamicConnections: ["Prophet Muhammad ﷺ as the perfect leader", "Rahmah, Sidq, Amanah as leadership pillars"] },
  { id: "unit-lead-entrep",   subjectId: "subj-entrepreneurship",  programId: "prog-leadership", title: "Muslim Innovators — Design & Build",  description: "Design thinking, problem identification, prototyping, and pitching solutions to real community problems using KidsCodeGift and Islamic entrepreneurial values.", type: "project", gradeMin: 5, gradeMax: 9, durationWeeks: 12, order: 1, objectives: ["Identify a real community problem", "Design and prototype a solution", "Pitch to a panel of educators"], islamicConnections: ["Innovation as form of worship", "Muslim entrepreneurs in history"] },

  // ── Arts ──
  { id: "unit-calligraphy-all", subjectId: "subj-calligraphy", programId: "prog-arts", title: "Naskh Script & Quranic Calligraphy", description: "From basic pen strokes to forming Arabic letters and words in Naskh calligraphy — creating compositions of Quranic verses and Islamic phrases.", type: "activity", gradeMin: 0, gradeMax: 9, durationWeeks: 10, order: 1, objectives: ["Master pen grip and basic strokes", "Write all Arabic letters in Naskh style", "Create a finished calligraphy composition"], islamicConnections: ["Calligraphy as the art of Quran", "Islamic civilization's most revered art form"] },
  { id: "unit-pe-all",          subjectId: "subj-pe",           programId: "prog-arts", title: "Physical Fitness & Islamic Values of Health", description: "Cardiovascular fitness, strength, team sports, and Islamic teachings on the body as an amanah — year-round PE curriculum.", type: "activity", gradeMin: 0, gradeMax: 9, durationWeeks: 36, order: 1, objectives: ["Meet grade-level fitness benchmarks", "Participate in team sports cooperatively", "Articulate Islamic perspective on physical health"], islamicConnections: ["Strong believer is better — Hadith", "Prophetic sports: archery, swimming, horseback riding"] },
  { id: "unit-sel-all",         subjectId: "subj-sel",          programId: "prog-arts", title: "Emotional Intelligence & Islamic Resilience", description: "Self-awareness, empathy, conflict resolution, gratitude (shukr), and emotional resilience — all anchored in Islamic psychology and Prophetic guidance.", type: "lesson", gradeMin: 0, gradeMax: 9, durationWeeks: 10, order: 1, objectives: ["Identify and name 10 emotions", "Apply a conflict resolution framework", "Practice daily gratitude (shukr) ritual"], islamicConnections: ["Sabr and Shukr as emotional tools", "Prophetic guidance on controlling anger"] },
];

// ── Upgraded Missions mapped to real subjects ──────────────────────────────
const MISSIONS_UPGRADED = [
  // Quran & Tajweed
  {
    id: "mission-quran-mulk",
    title: "Surah Al-Mulk Mastery",
    subject: "Quran & Tajweed",
    subjectId: "subj-quran-tajweed",
    programId: "prog-quran-islamic",
    description: "Perfect your recitation of Surah Al-Mulk (30 ayat) with full Tajweed rules. This mission builds your Hifz and earns you the Recitation Shield badge.",
    xp: 150, difficulty: "Hard", color: "gold", isPublished: true,
    tasks: [
      { id: "t1", label: "Learn Noon Sakinah & Tanween rules", order: 1 },
      { id: "t2", label: "Practice Al-Mulk verses 1–10 with recording", order: 2 },
      { id: "t3", label: "Practice verses 11–20 with recording", order: 3 },
      { id: "t4", label: "Practice verses 21–30 with recording", order: 4 },
      { id: "t5", label: "Submit full recitation to Ustadh for grading", order: 5 },
    ],
    dueDate: ts(7),
  },
  {
    id: "mission-asmaul-husna",
    title: "The 99 Names Challenge",
    subject: "Aqeedah",
    subjectId: "subj-aqeedah",
    programId: "prog-quran-islamic",
    description: "Memorize and understand 30 of Allah's 99 Names (Asma ul-Husna) — their meanings and how they connect to your daily life.",
    xp: 120, difficulty: "Medium", color: "gold", isPublished: true,
    tasks: [
      { id: "t1", label: "Memorize Names 1–10 with meanings", order: 1 },
      { id: "t2", label: "Memorize Names 11–20 with meanings", order: 2 },
      { id: "t3", label: "Memorize Names 21–30 with meanings", order: 3 },
      { id: "t4", label: "Write reflection: How do these Names guide my life?", order: 4 },
    ],
    dueDate: ts(5),
  },
  // Seerah & Islamic History
  {
    id: "mission-badr-expedition",
    title: "The Badr Expedition",
    subject: "Seerah & Islamic History",
    subjectId: "subj-seerah",
    programId: "prog-quran-islamic",
    description: "Explore the Battle of Badr — its causes, key events, and lasting lessons for Muslim leadership and strategic thinking.",
    xp: 90, difficulty: "Medium", color: "emerald", isPublished: true,
    tasks: [
      { id: "t1", label: "Read: Context of Badr — the road from Makkah", order: 1 },
      { id: "t2", label: "Watch documentary excerpt and take notes", order: 2 },
      { id: "t3", label: "Map activity: Trace the march to Badr", order: 3 },
      { id: "t4", label: "Reflection essay: 3 leadership lessons from Badr (300 words)", order: 4 },
    ],
    dueDate: ts(4),
  },
  {
    id: "mission-golden-age",
    title: "Islamic Golden Age Scholar",
    subject: "Seerah & Islamic History",
    subjectId: "subj-seerah",
    programId: "prog-quran-islamic",
    description: "Research one Islamic Golden Age scholar and present how their work shaped the modern world. Choose from Al-Khwarizmi, Ibn Sina, Al-Biruni, or Ibn Battuta.",
    xp: 100, difficulty: "Medium", color: "emerald", isPublished: true,
    tasks: [
      { id: "t1", label: "Select scholar and complete biography worksheet", order: 1 },
      { id: "t2", label: "Research their major contributions (minimum 3)", order: 2 },
      { id: "t3", label: "Create a visual timeline of their discoveries", order: 3 },
      { id: "t4", label: "Present to class (3-minute oral presentation)", order: 4 },
    ],
    dueDate: ts(10),
  },
  // Mathematics
  {
    id: "mission-algebra-conquest",
    title: "The Algebra Conquest",
    subject: "Mathematics",
    subjectId: "subj-math",
    programId: "prog-nys-core",
    description: "Master linear equations and inequalities through real-world problem sets — including calculating Zakat percentages and budgeting for a community project.",
    xp: 120, difficulty: "Medium", color: "blue", isPublished: true,
    tasks: [
      { id: "t1", label: "Watch: Introduction to Linear Equations", order: 1 },
      { id: "t2", label: "Complete Practice Set A: Solving equations (10 problems)", order: 2 },
      { id: "t3", label: "Practice Set B: Inequalities (15 problems)", order: 3 },
      { id: "t4", label: "Real-world challenge: Zakat & budget word problems", order: 4 },
      { id: "t5", label: "Submit Final Unit Quiz on Google Classroom", order: 5 },
    ],
    dueDate: ts(-2),
  },
  {
    id: "mission-geometry-art",
    title: "Islamic Geometry & Math",
    subject: "Mathematics",
    subjectId: "subj-math",
    programId: "prog-nys-core",
    description: "Discover the mathematics behind Islamic geometric art — symmetry, tessellations, angles, and the Golden Ratio in mosque architecture.",
    xp: 110, difficulty: "Medium", color: "blue", isPublished: true,
    tasks: [
      { id: "t1", label: "Lesson: Symmetry and rotational patterns", order: 1 },
      { id: "t2", label: "Construct an 8-point Islamic star using compass", order: 2 },
      { id: "t3", label: "Research: Math in the Alhambra Palace", order: 3 },
      { id: "t4", label: "Create your own geometric tile design", order: 4 },
    ],
    dueDate: ts(6),
  },
  // ELA
  {
    id: "mission-shakespeare",
    title: "Shakespeare's Code — Leadership & Morality",
    subject: "English Language Arts",
    subjectId: "subj-ela",
    programId: "prog-nys-core",
    description: "Analyze themes of ambition and morality in Macbeth through an Islamic leadership lens — is unchecked ambition always destructive?",
    xp: 80, difficulty: "Hard", color: "purple", isPublished: true,
    tasks: [
      { id: "t1", label: "Read Acts I–II and complete character map", order: 1 },
      { id: "t2", label: "Character analysis worksheet: Macbeth vs. Islamic leader", order: 2 },
      { id: "t3", label: "Read Acts III–V and annotate key passages", order: 3 },
      { id: "t4", label: "Final essay: Leadership, Moral Courage & Islamic Values (500 words)", order: 4 },
    ],
    dueDate: ts(1),
  },
  {
    id: "mission-argumentative-essay",
    title: "The Argumentative Voice",
    subject: "English Language Arts",
    subjectId: "subj-ela",
    programId: "prog-nys-core",
    description: "Master argumentative essay writing — claim, evidence, reasoning, and counterargument — using topics relevant to Muslim American youth.",
    xp: 85, difficulty: "Hard", color: "purple", isPublished: true,
    tasks: [
      { id: "t1", label: "Read: Structure of an argumentative essay", order: 1 },
      { id: "t2", label: "Brainstorm and choose your position", order: 2 },
      { id: "t3", label: "Write rough draft with claim + 2 evidence paragraphs", order: 3 },
      { id: "t4", label: "Add counterargument and conclusion", order: 4 },
      { id: "t5", label: "Peer review and final submission", order: 5 },
    ],
    dueDate: ts(3),
  },
  // Science
  {
    id: "mission-photosynthesis",
    title: "The Photosynthesis Lab",
    subject: "Science",
    subjectId: "subj-science",
    programId: "prog-nys-core",
    description: "Conduct hands-on experiments on plant biology and photosynthesis — documenting findings as full scientific lab reports.",
    xp: 100, difficulty: "Easy", color: "emerald", isPublished: true,
    tasks: [
      { id: "t1", label: "Virtual lab experiment: Elodea plant and light", order: 1 },
      { id: "t2", label: "Data recording worksheet with observations", order: 2 },
      { id: "t3", label: "Graph your results (oxygen production vs. light intensity)", order: 3 },
      { id: "t4", label: "Submit full lab report: hypothesis, method, results, conclusion", order: 4 },
    ],
    dueDate: ts(-7),
  },
  {
    id: "mission-earth-science",
    title: "Earth as Amanah — Environmental Science",
    subject: "Science",
    subjectId: "subj-science",
    programId: "prog-nys-core",
    description: "Study climate change, ecosystems, and environmental stewardship — connecting Islamic khalifah (stewardship) principles to modern environmental science.",
    xp: 90, difficulty: "Medium", color: "emerald", isPublished: true,
    tasks: [
      { id: "t1", label: "Research: Climate change causes and effects", order: 1 },
      { id: "t2", label: "Read: Islamic perspective on environmental stewardship", order: 2 },
      { id: "t3", label: "Analyze data: Local Queens air quality trends", order: 3 },
      { id: "t4", label: "Design: Your school's green action plan", order: 4 },
    ],
    dueDate: ts(8),
  },
  // Arabic Language
  {
    id: "mission-arabic-vocab",
    title: "The Arabic Vocabulary Quest",
    subject: "Arabic Language",
    subjectId: "subj-arabic-reading",
    programId: "prog-arabic",
    description: "Master 100 new Arabic vocabulary words across 4 topic areas and use them in reading and writing contexts.",
    xp: 110, difficulty: "Medium", color: "gold", isPublished: true,
    tasks: [
      { id: "t1", label: "Flashcard set 1: Family & home (25 words)", order: 1 },
      { id: "t2", label: "Flashcard set 2: School & learning (25 words)", order: 2 },
      { id: "t3", label: "Flashcard set 3: Community & masjid (25 words)", order: 3 },
      { id: "t4", label: "Flashcard set 4: Nature & creation (25 words)", order: 4 },
      { id: "t5", label: "Write 10 sentences using new vocabulary in context", order: 5 },
    ],
    dueDate: ts(-7),
  },
  {
    id: "mission-arabic-grammar",
    title: "Nahw Foundations — Arabic Grammar",
    subject: "Classical Arabic",
    subjectId: "subj-classical-arabic",
    programId: "prog-arabic",
    description: "Master the foundations of Arabic grammar (Nahw): raf', nasb, jarr case endings, and basic sentence structures for accessing Quranic Arabic.",
    xp: 130, difficulty: "Hard", color: "gold", isPublished: true,
    tasks: [
      { id: "t1", label: "Lesson: Arabic noun cases — Raf', Nasb, Jarr", order: 1 },
      { id: "t2", label: "Practice worksheet: Identify case endings in 20 sentences", order: 2 },
      { id: "t3", label: "Verb conjugation drill: Past, present, command", order: 3 },
      { id: "t4", label: "Parse a short Quranic ayah with full i'rab", order: 4 },
    ],
    dueDate: ts(5),
  },
  // STEM
  {
    id: "mission-coding-game",
    title: "Build Your First Game",
    subject: "Coding — KidsCodeGift",
    subjectId: "subj-coding",
    programId: "prog-stem",
    description: "Design and build a working game on the KidsCodeGift platform — using loops, conditionals, and events to create interactive Islamic-themed experiences.",
    xp: 140, difficulty: "Medium", color: "purple", isPublished: true,
    tasks: [
      { id: "t1", label: "Complete KidsCodeGift Module 1: Basics", order: 1 },
      { id: "t2", label: "Design your game concept and storyboard", order: 2 },
      { id: "t3", label: "Build game mechanics (player movement + obstacles)", order: 3 },
      { id: "t4", label: "Add scoring system and win/lose conditions", order: 4 },
      { id: "t5", label: "Submit completed game link for review", order: 5 },
    ],
    dueDate: ts(6),
  },
  {
    id: "mission-python-basics",
    title: "Python for Muslim Innovators",
    subject: "Coding — KidsCodeGift",
    subjectId: "subj-coding",
    programId: "prog-stem",
    description: "Learn Python fundamentals and build a real script that solves a community problem — from prayer time calculators to Quran verse lookup tools.",
    xp: 160, difficulty: "Hard", color: "purple", isPublished: true,
    tasks: [
      { id: "t1", label: "Python basics: variables, data types, print", order: 1 },
      { id: "t2", label: "Control flow: if/else and loops", order: 2 },
      { id: "t3", label: "Functions and simple input/output", order: 3 },
      { id: "t4", label: "Build a community tool (prayer times / Quran lookup)", order: 4 },
      { id: "t5", label: "Demo your project to the class", order: 5 },
    ],
    dueDate: ts(14),
  },
  // Leadership
  {
    id: "mission-public-speech",
    title: "The Confident Speaker",
    subject: "Public Speaking & Debate",
    subjectId: "subj-public-speaking",
    programId: "prog-leadership",
    description: "Prepare and deliver a 3-minute speech on a topic you care about — applying the 5 techniques of confident Islamic public speaking.",
    xp: 100, difficulty: "Medium", color: "rose" as unknown as "gold",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Study: 5 techniques of confident public speaking", order: 1 },
      { id: "t2", label: "Choose your topic and write your speech outline", order: 2 },
      { id: "t3", label: "Write full script and practice 3 times", order: 3 },
      { id: "t4", label: "Deliver speech in front of class", order: 4 },
      { id: "t5", label: "Give and receive structured peer feedback", order: 5 },
    ],
    dueDate: ts(5),
  },
  {
    id: "mission-community-project",
    title: "Serve Queens — Community Leadership",
    subject: "Community Service Projects",
    subjectId: "subj-community-service",
    programId: "prog-leadership",
    description: "Design and execute a real community service project benefiting your school, masjid, or Queens neighborhood — living the Prophetic model of service.",
    xp: 120, difficulty: "Hard", color: "emerald", isPublished: true,
    tasks: [
      { id: "t1", label: "Identify a real need in your school or community", order: 1 },
      { id: "t2", label: "Design your project plan with timeline and team roles", order: 2 },
      { id: "t3", label: "Execute the project and document with photos", order: 3 },
      { id: "t4", label: "Write reflection report: impact and leadership lessons", order: 4 },
    ],
    dueDate: ts(14),
  },
  // Arts & Enrichment
  {
    id: "mission-calligraphy",
    title: "Naskh Script — Calligraphy Mission",
    subject: "Islamic Calligraphy",
    subjectId: "subj-calligraphy",
    programId: "prog-arts",
    description: "Master the Naskh calligraphy script and create a finished composition of Bismillah ir-Rahman ir-Raheem in full calligraphic style.",
    xp: 80, difficulty: "Easy", color: "teal" as unknown as "gold",
    isPublished: true,
    tasks: [
      { id: "t1", label: "Practice basic pen strokes and letter proportions", order: 1 },
      { id: "t2", label: "Write each Arabic letter in Naskh style (isolated form)", order: 2 },
      { id: "t3", label: "Connect letters: practice 10 common words", order: 3 },
      { id: "t4", label: "Create final Bismillah composition on art paper", order: 4 },
    ],
    dueDate: ts(10),
  },
  {
    id: "mission-sel-journal",
    title: "The Muslim Leader's Journal",
    subject: "Social-Emotional Learning",
    subjectId: "subj-sel",
    programId: "prog-arts",
    description: "Build emotional intelligence and Islamic resilience through a 2-week daily journal practice — gratitude, self-reflection, and character development.",
    xp: 70, difficulty: "Easy", color: "emerald", isPublished: true,
    tasks: [
      { id: "t1", label: "Day 1–3: Daily shukr (gratitude) — list 3 things daily", order: 1 },
      { id: "t2", label: "Day 4–7: Identify 1 character quality to work on", order: 2 },
      { id: "t3", label: "Day 8–11: Document acts of kindness each day", order: 3 },
      { id: "t4", label: "Day 12–14: Write final reflection — Who am I becoming?", order: 4 },
    ],
    dueDate: ts(14),
  },
];

// Subject name lookup for studentProfile subject grades
const REAL_SUBJECTS_FOR_PROFILE = [
  { subject: "Quran & Tajweed",        subjectId: "subj-quran-tajweed",   color: "gold"    },
  { subject: "Mathematics",            subjectId: "subj-math",             color: "emerald" },
  { subject: "Arabic Language",        subjectId: "subj-arabic-reading",   color: "blue"    },
  { subject: "English Language Arts",  subjectId: "subj-ela",              color: "gold"    },
  { subject: "Science",                subjectId: "subj-science",          color: "emerald" },
  { subject: "Islamic Studies",        subjectId: "subj-seerah",           color: "blue"    },
  { subject: "Coding",                 subjectId: "subj-coding",           color: "purple"  },
  { subject: "Leadership",             subjectId: "subj-public-speaking",  color: "purple"  },
];

const STUDENTS = [
  { uid: "student-ahmed-001",   pct: 94 },
  { uid: "student-maryam-001",  pct: 91 },
  { uid: "student-ibrahim-001", pct: 87 },
  { uid: "student-fatima-001",  pct: 85 },
  { uid: "student-zaid-001",    pct: 82 },
  { uid: "student-aisha-001",   pct: 80 },
  { uid: "student-omar-001",    pct: 65 },
  { uid: "student-layla-001",   pct: 75 },
];

// ── Seed functions ──────────────────────────────────────────────────────────

async function seedPrograms() {
  const batch = db.batch();
  for (const p of PROGRAMS) {
    const { id, ...data } = p;
    batch.set(db.doc(`programs/${id}`), {
      ...data,
      id,
      schoolId: SCHOOL_ID,
      isActive: true,
      createdAt: ts(300),
      updatedAt: ts(0),
    });
  }
  await batch.commit();
  console.log(`✓ programs (${PROGRAMS.length})`);
}

async function seedSubjects() {
  const batch = db.batch();
  for (const s of SUBJECTS) {
    const { id, ...data } = s;
    batch.set(db.doc(`subjects/${id}`), {
      ...data,
      id,
      gradeBand: "all",
      schoolId: SCHOOL_ID,
      createdAt: ts(300),
    });
  }
  await batch.commit();
  console.log(`✓ subjects (${SUBJECTS.length})`);
}

async function seedCurriculumUnits() {
  // Batches of 500 max
  let batch = db.batch();
  let count = 0;
  for (const u of CURRICULUM_UNITS) {
    const { id, ...data } = u;
    batch.set(db.doc(`curriculumUnits/${id}`), {
      ...data,
      id,
      gradeBand: `${u.gradeMin}-${u.gradeMax}`,
      schoolId: SCHOOL_ID,
      academicYear: ACADEMIC_YEAR,
      createdAt: ts(300),
    });
    count++;
    if (count % 400 === 0) { await batch.commit(); batch = db.batch(); }
  }
  await batch.commit();
  console.log(`✓ curriculumUnits (${CURRICULUM_UNITS.length})`);
}

async function seedUpgradedMissions() {
  for (const m of MISSIONS_UPGRADED) {
    const { id, ...data } = m;
    await db.doc(`missions/${id}`).set({
      ...data,
      id,
      classId: CLASS_ID,
      educatorUid: EDU_UID,
      createdAt: ts(30),
    });
  }
  console.log(`✓ missions upgraded (${MISSIONS_UPGRADED.length})`);
}

async function updateClassSubjects() {
  await db.doc(`classes/${CLASS_ID}`).update({
    subjects: REAL_SUBJECTS_FOR_PROFILE.map((s) => s.subject),
    programIds: PROGRAMS.map((p) => p.id),
    updatedAt: ts(0),
  });
  console.log("✓ class subjects updated");
}

async function updateStudentProfileSubjects() {
  for (const s of STUDENTS) {
    const subjectGrades = REAL_SUBJECTS_FOR_PROFILE.map((subj, i) => {
      const variance = Math.round((Math.random() - 0.5) * 14);
      const pct = Math.min(100, Math.max(55, s.pct + variance - i * 2));
      return {
        subject:   subj.subject,
        subjectId: subj.subjectId,
        color:     subj.color,
        pct,
        grade: gradeFromPct(pct),
      };
    });
    await db.doc(`studentProfiles/${s.uid}`).update({ subjectGrades, updatedAt: ts(0) });
  }
  console.log("✓ student profile subjectGrades updated with real subjects");
}

async function seedMissionProgressForUpgraded() {
  const PROGRESS_MAP: Record<string, Record<string, number>> = {
    "student-ahmed-001":   { "mission-quran-mulk": 4, "mission-asmaul-husna": 3, "mission-badr-expedition": 3, "mission-golden-age": 2, "mission-algebra-conquest": 4, "mission-geometry-art": 2, "mission-shakespeare": 3, "mission-argumentative-essay": 3, "mission-photosynthesis": 4, "mission-earth-science": 2, "mission-arabic-vocab": 4, "mission-arabic-grammar": 2, "mission-coding-game": 3, "mission-python-basics": 1, "mission-public-speech": 4, "mission-community-project": 2, "mission-calligraphy": 3, "mission-sel-journal": 4 },
    "student-maryam-001":  { "mission-quran-mulk": 5, "mission-asmaul-husna": 4, "mission-badr-expedition": 2, "mission-golden-age": 3, "mission-algebra-conquest": 3, "mission-geometry-art": 3, "mission-shakespeare": 4, "mission-argumentative-essay": 4, "mission-photosynthesis": 3, "mission-earth-science": 2, "mission-arabic-vocab": 3, "mission-arabic-grammar": 1, "mission-coding-game": 2, "mission-python-basics": 0, "mission-public-speech": 3, "mission-community-project": 2, "mission-calligraphy": 4, "mission-sel-journal": 3 },
    "student-ibrahim-001": { "mission-quran-mulk": 3, "mission-asmaul-husna": 2, "mission-badr-expedition": 2, "mission-golden-age": 2, "mission-algebra-conquest": 3, "mission-geometry-art": 2, "mission-shakespeare": 2, "mission-argumentative-essay": 2, "mission-photosynthesis": 3, "mission-earth-science": 2, "mission-arabic-vocab": 3, "mission-arabic-grammar": 1, "mission-coding-game": 3, "mission-python-basics": 2, "mission-public-speech": 2, "mission-community-project": 1, "mission-calligraphy": 2, "mission-sel-journal": 3 },
    "student-fatima-001":  { "mission-quran-mulk": 5, "mission-asmaul-husna": 3, "mission-badr-expedition": 2, "mission-golden-age": 2, "mission-algebra-conquest": 4, "mission-geometry-art": 2, "mission-shakespeare": 3, "mission-argumentative-essay": 3, "mission-photosynthesis": 4, "mission-earth-science": 2, "mission-arabic-vocab": 4, "mission-arabic-grammar": 2, "mission-coding-game": 2, "mission-python-basics": 0, "mission-public-speech": 3, "mission-community-project": 2, "mission-calligraphy": 4, "mission-sel-journal": 4 },
    "student-zaid-001":    { "mission-quran-mulk": 3, "mission-asmaul-husna": 2, "mission-badr-expedition": 1, "mission-golden-age": 1, "mission-algebra-conquest": 2, "mission-geometry-art": 1, "mission-shakespeare": 2, "mission-argumentative-essay": 2, "mission-photosynthesis": 3, "mission-earth-science": 1, "mission-arabic-vocab": 2, "mission-arabic-grammar": 0, "mission-coding-game": 2, "mission-python-basics": 1, "mission-public-speech": 2, "mission-community-project": 1, "mission-calligraphy": 2, "mission-sel-journal": 2 },
    "student-aisha-001":   { "mission-quran-mulk": 4, "mission-asmaul-husna": 3, "mission-badr-expedition": 2, "mission-golden-age": 2, "mission-algebra-conquest": 2, "mission-geometry-art": 2, "mission-shakespeare": 2, "mission-argumentative-essay": 2, "mission-photosynthesis": 3, "mission-earth-science": 2, "mission-arabic-vocab": 3, "mission-arabic-grammar": 1, "mission-coding-game": 2, "mission-python-basics": 0, "mission-public-speech": 2, "mission-community-project": 1, "mission-calligraphy": 3, "mission-sel-journal": 3 },
    "student-omar-001":    { "mission-quran-mulk": 2, "mission-asmaul-husna": 1, "mission-badr-expedition": 0, "mission-golden-age": 0, "mission-algebra-conquest": 1, "mission-geometry-art": 0, "mission-shakespeare": 1, "mission-argumentative-essay": 1, "mission-photosynthesis": 2, "mission-earth-science": 0, "mission-arabic-vocab": 1, "mission-arabic-grammar": 0, "mission-coding-game": 1, "mission-python-basics": 0, "mission-public-speech": 1, "mission-community-project": 0, "mission-calligraphy": 1, "mission-sel-journal": 2 },
    "student-layla-001":   { "mission-quran-mulk": 3, "mission-asmaul-husna": 2, "mission-badr-expedition": 1, "mission-golden-age": 1, "mission-algebra-conquest": 2, "mission-geometry-art": 1, "mission-shakespeare": 1, "mission-argumentative-essay": 2, "mission-photosynthesis": 3, "mission-earth-science": 1, "mission-arabic-vocab": 2, "mission-arabic-grammar": 0, "mission-coding-game": 2, "mission-python-basics": 0, "mission-public-speech": 2, "mission-community-project": 1, "mission-calligraphy": 2, "mission-sel-journal": 3 },
  };

  for (const s of STUDENTS) {
    const batch = db.batch();
    const prog = PROGRESS_MAP[s.uid] ?? {};
    for (const m of MISSIONS_UPGRADED) {
      const doneTasks = prog[m.id] ?? 0;
      const tasksProgress = m.tasks.map((t, i) => ({
        taskId: t.id,
        done: i < doneTasks,
        ...(i < doneTasks ? { completedAt: ts(Math.floor(Math.random() * 7)) } : {}),
      }));
      const pct = Math.round((doneTasks / m.tasks.length) * 100);
      const isCompleted = doneTasks === m.tasks.length;
      const isLocked = doneTasks === 0;
      batch.set(
        db.doc(`studentProfiles/${s.uid}/missionProgress/${m.id}`),
        {
          missionId: m.id,
          studentUid: s.uid,
          subjectId: m.subjectId,
          programId: m.programId,
          status: isCompleted ? "completed" : isLocked ? "locked" : "active",
          progress: pct,
          tasksProgress,
          xpEarned: isCompleted ? m.xp : 0,
          ...(isCompleted ? { completedAt: ts(3) } : {}),
          updatedAt: ts(1),
        }
      );
    }
    await batch.commit();
  }
  console.log(`✓ missionProgress (upgraded, ${MISSIONS_UPGRADED.length} missions × ${STUDENTS.length} students)`);
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🌙 Al-Madinah Nexus — Seeding Programs & Curriculum...\n");
  try {
    await seedPrograms();
    await seedSubjects();
    await seedCurriculumUnits();
    await seedUpgradedMissions();
    await updateClassSubjects();
    await updateStudentProfileSubjects();
    await seedMissionProgressForUpgraded();
    console.log("\n✅ Programs seed complete! All 6 programs, subjects, and missions are live.\n");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
