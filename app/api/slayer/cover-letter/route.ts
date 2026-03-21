import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const apiKey = (process.env.OPENROUTER_API_KEY ?? "")
    .trim()
    .replace(/^['\"]|['\"]$/g, "");


  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resumeText or jobDescription" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert Executive Career Coach and ATS Specialist.
Based on the provided Resume and Job Description, write a highly optimized, persuasive, and world-class cover letter.
Make sure it sounds natural, enthusiastic, professional, and directly aligns the candidate's achievements with the company's needs.
Do not wrap the output in markdown code blocks. Just return the raw text format with clear paragraphs. Include placeholders like [Company Name] or [Hiring Manager] if you cannot infer them.

Resume: 
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      // signal: constroller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
        "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "resume-slayer",

      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openrouter/free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Grok API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to call Grok API for cover letter" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const coverLetter = data.choices[0].message.content.trim();

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.error("Cover Letter Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
