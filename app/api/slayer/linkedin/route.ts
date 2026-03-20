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
You are an expert Career Coach and LinkedIn Networking Specialist.
Based on the provided Resume/Profile and Job Description (or target person's profile/company info), write a highly optimized, engaging, and professional LinkedIn Direct Message or connection request note.
Keep it extremely concise (aim for under 150-200 words total).
Start with a warm, personalized greeting. Quickly mention a shared interest, mutual connection, or compliment their recent work/company to build rapport. Briefly highlight a specific, relevant achievement or skill from the user's profile that aligns with the target. End with a low-pressure Call To Action (e.g., asking for a brief chat or their thoughts on a specific topic).
Do not wrap the output in markdown code blocks. Just return the raw text format. Include placeholders like [Target Name] or [User Name] for the user to fill in if they cannot be inferred.

Requirements:
- Professional tone, but conversational.
- Easy to read on mobile.
- Focus on networking and relationship building, not just begging for a job.

User Profile / Resume Context:
${resumeText}

Target Job / Person Description:
${jobDescription}
`;

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
        { error: "Failed to call Grok API for LinkedIn DM" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const dm = data.choices[0].message.content.trim();

    return NextResponse.json({ dm });
  } catch (error: any) {
    console.error("LinkedIn DM Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
