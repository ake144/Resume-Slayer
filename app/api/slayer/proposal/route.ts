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
You are an expert Sales Strategist and Freelance Consultant.
Based on the provided Resume/Profile and Job Description/Company info, write a highly optimized, generic but completely tailored cold email or proposal pitch.
It should not be platform specific (like Upwork or LinkedIn), but meant for an email, a generic job board, or a direct submission.
Structure:
1. Compelling subject line (if applicable, else just a strong hook).
2. Strong opening that addresses a pain point.
3. Brief mention of relevant value/wins based on the user's resume.
4. Clear and confident Call To Action.
Do not wrap the output in markdown code blocks. Just return the raw text format. Include placeholders like [Client Name] for the user to fill in if they cannot be inferred.

Requirements:
- Persuasive, confident tone.
- Not overly formal or dry.
- Focus on the ROI and value the user can bring.

User Profile / Resume Context:
${resumeText}

Target Job / Project / Company Description:
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
        { error: "Failed to call Grok API for Generic Proposal" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const proposal = data.choices[0].message.content.trim();

    return NextResponse.json({ proposal });
  } catch (error: any) {
    console.error("Generic Proposal Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
