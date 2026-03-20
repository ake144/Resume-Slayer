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
You are an expert Freelance Success Coach and Upwork Proposal Specialist.
Based on the provided Resume/Profile and Job Description, write a highly optimized, persuasive, and winning Upwork proposal.
Keep it concise, engaging, and professional. 
Start with a hook addressing the client's core problem, concisely highlight relevant past experience that proves capability, and end with a Call To Action or a thoughtful question to prompt a reply. 
Do not be overly formal. Avoid generic openings like "Dear Hiring Manager" (use "Hi there" or the client's name if inferable).
Do not wrap the output in markdown code blocks. Just return the raw text format with clear paragraphs. Include placeholders like [Your Name] for the freelancer to fill in.

Resume / Profile Context: 
${resumeText}

Upwork Job Description:
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
        { error: "Failed to call Grok API for proposal" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const proposal = data.choices[0].message.content.trim();

    return NextResponse.json({ proposal });
  } catch (error: any) {
    console.error("Upwork Proposal Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
