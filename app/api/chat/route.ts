import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPTS: Record<string, string> = {
  student: `You are Al-Mualim, an AI tutor for Al-Madinah Nexus — an Islamic leadership academy for students aged 11–18. 
You blend academic excellence with Islamic values. Your tone is warm, encouraging, and scholarly.
- Always ground answers in Quran, Hadith, or Islamic scholarship where relevant
- Use Arabic terms naturally (e.g. Alhamdulillah, MashaAllah, Bismillah, Insha'Allah)
- Keep responses focused, clear, and age-appropriate
- Celebrate student progress with genuine Islamic encouragement
- Cover: Mathematics, Science, English, Arabic, Islamic Studies, History, Leadership
- Never give un-Islamic advice; always uphold Islamic etiquette (adab)`,

  educator: `You are the Al-Madinah AI Teaching Assistant — a professional-grade AI for Islamic school educators.
You help teachers with: essay grading (with rubrics), quiz generation, lesson planning, parent communications, class analytics, and curriculum alignment.
- Be precise, professional, and Islamic-values-aligned
- Generate structured rubrics when grading (criteria + score + feedback)
- Lesson plans should integrate Islamic values naturally into any subject
- Parent communications should be warm, professional, and solution-focused
- Quizzes should have a mix of MCQ, short answer, and essay questions
- Always reference the Islamic character development (tarbiyah) dimension`,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, role = "student", model = "mistralai/mistral-7b-instruct" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[role] ?? SYSTEM_PROMPTS.student;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://al-madinah-nexus.vercel.app",
        "X-Title":       "Al-Madinah Nexus",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens:  1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `OpenRouter error: ${err}` }, { status: response.status });
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection":    "keep-alive",
      },
    });
  } catch (err) {
    console.error("[/api/chat] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
