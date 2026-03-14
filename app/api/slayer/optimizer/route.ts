import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resumeText or jobDescription" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert ATS Resume Slayer.
Optimize this resume for the job description below.
Return JSON only:
{
  "optimizedResume": "...",
  "atsScore": "92%",
  "trapsFixed": "List of 5 things fixed",
  "missingSkills": ["Python", "AWS"],
  "roadmap": "Week 1: ...\\nWeek 2: ...\\nFree courses: ..."
}
Resume: 
${resumeText}

Job Description:
${jobDescription}
`;

    // Note: We use the standard xAI endpoint here.
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || "grok-beta",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Grok API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to call Grok API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Clean up any potential markdown formatting from the response
    const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Parse it back to json
    const parsedData = JSON.parse(cleanContent);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Optimizer Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
