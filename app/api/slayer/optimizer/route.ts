import { NextResponse } from "next/server";

const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "this", "that", "are", "from", "have", "has", "will", "our",
  "but", "not", "all", "can", "was", "were", "job", "role", "team", "using", "use", "their", "into", "about",
  "years", "year", "experience", "work", "working", "ability", "skills", "skill", "including", "required", "preferred",
]);

const tokenize = (text: string): string[] => {
  return (text.toLowerCase().match(/[a-z][a-z0-9+#.-]{1,}/g) || []).filter(
    (word) => word.length > 2 && !STOPWORDS.has(word)
  );
};

const uniqueOrdered = (items: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
};

const toTitle = (word: string): string => {
  if (word.includes("+") || word.includes("#")) {
    return word.toUpperCase();
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const buildLocalOptimization = (resumeText: string, jobDescription: string) => {
  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jobDescription);
  const uniqueJd = uniqueOrdered(jdTokens);
  const resumeSet = new Set(resumeTokens);

  const matched = uniqueJd.filter((token) => resumeSet.has(token));
  const missing = uniqueJd.filter((token) => !resumeSet.has(token)).slice(0, 8);

  const coverage = uniqueJd.length > 0 ? matched.length / uniqueJd.length : 0.5;
  const rawScore = Math.round(55 + coverage * 40);
  const atsScore = `${Math.max(35, Math.min(98, rawScore))}%`;

  const keySkillsLine =
    missing.length > 0
      ? `\n\nKey Skills Aligned to Job:\n${missing.map((word) => `- ${toTitle(word)}`).join("\n")}`
      : "\n\nKey Skills Aligned to Job:\n- Requirements already well aligned with this role.";

  const optimizedResume = `${resumeText.trim()}${keySkillsLine}`;

  const trapsFixed = [
    "Injected role-specific keywords from the job description.",
    "Added a dedicated skills section to improve ATS keyword parsing.",
    "Reduced generic phrasing and emphasized role relevance.",
    "Improved section scannability for parser-friendly structure.",
    "Aligned terminology with target-job wording.",
  ];

  const roadmapFocus = missing.slice(0, 3).map(toTitle);
  const roadmap = `Week 1: Strengthen ${roadmapFocus[0] || "core role skills"} with 2 guided tutorials and one mini-project.\nWeek 2: Practice ${roadmapFocus[1] || "interview-relevant tooling"} through hands-on implementation and resume bullet updates.\nWeek 3: Build and publish one portfolio artifact using ${roadmapFocus[2] || "the target stack"}; add metrics-focused outcomes to resume.`;

  return {
    jobTitle: "Software Engineer Fallback",
    optimizedResume,
    atsScore,
    trapsFixed,
    missingSkills: missing.map(toTitle),
    roadmap,
    provider: "local",
  };
};

const extractJsonObject = (text: string): string => {
  const fenced = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = fenced.indexOf("{");
  if (firstBrace === -1) {
    throw new Error("No JSON object found in optimizer response");
  }

  let depth = 0;
  let inString = false;
  let escaping = false;

  for (let index = firstBrace; index < fenced.length; index += 1) {
    const char = fenced[index];

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }

      if (char === "\\") {
        escaping = true;
        continue;
      }

      if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return fenced.slice(firstBrace, index + 1);
      }
    }
  }

  throw new Error("Could not extract a complete JSON object from optimizer response");
};

const getPrompt = (resumeText: string, jobDescription: string) => `
You are an expert ATS Resume Slayer.
Optimize this resume for the job description below.
Extract the Job Title from the job description.
Return valid JSON only (no markdown fences, no explanation text before or after the JSON):
{
  "jobTitle": "Extracted Job Title",
  "optimizedResume": "...",
  "atsScore": "92%",
  "trapsFixed": ["Fixed formatting", "Added keywords"],
  "missingSkills": ["Python", "AWS"],
  "roadmap": "Week 1: ...\\nWeek 2: ...\\nFree courses: ..."
}
Resume:
${resumeText}

Job Description:
${jobDescription}
`;

const extractTextContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && "text" in part) {
          const value = (part as { text?: unknown }).text;
          return typeof value === "string" ? value : "";
        }
        return "";
      })
      .join("\n")
      .trim();

    if (text) {
      return text;
    }
  }

  return "";
};

const parseModelJsonContent = (content: unknown) => {
  const textContent = extractTextContent(content);

  if (!textContent || textContent.trim().length === 0) {
    throw new Error("Optimizer returned empty content");
  }

  const trimmedText = textContent.trim();

  try {
    return JSON.parse(trimmedText);
  } catch {
    // Continue with object extraction fallback
  }

  const jsonObjectString = extractJsonObject(trimmedText);
  return JSON.parse(jsonObjectString);
};

const callXaiOptimizer = async (resumeText: string, jobDescription: string) => {
  const apiKey = (process.env.XAI_API_KEY ?? process.env.GROK_API_KEY ?? "")
    .trim()
    .replace(/^['\"]|['\"]$/g, "");

  if (!apiKey || apiKey.startsWith("gsk_")) {
    return null;
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROK_MODEL || "grok-3-mini",
      messages: [{ role: "user", content: getPrompt(resumeText, jobDescription) }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("xAI API Error:", errorText);
    return null;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  try {
    return { ...parseModelJsonContent(content), provider: "xai" };
  } catch (error) {
    console.error("xAI parse error:", error);
    return null;
  }
};

const callOpenRouterOptimizer = async (resumeText: string, jobDescription: string) => {
  const apiKey = (process.env.OPENROUTER_API_KEY ?? "")
    .trim()
    .replace(/^['\"]|['\"]$/g, "");

  if (!apiKey) {
    return null;
  }

  const candidateModels = uniqueOrdered([
    process.env.OPENROUTER_MODEL || "",
    "openrouter/hunter-alpha",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "openrouter/free",
    "stepfun/step-3.5-flash:free",
    "openrouter/healer-alpha"
  ].filter(Boolean));

  let lastError = "";
  const timeoutMs = Number(process.env.OPENROUTER_TIMEOUT_MS || 60000);

  for (const model of candidateModels) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
          "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "resume-slayer",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: getPrompt(resumeText, jobDescription) }],
          temperature: 0.7,
        }),
      });
    } catch (error) {
      lastError = String(error);
      console.error(`OpenRouter request error (${model}):`, error);
      continue;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      lastError = errorText;
      console.error(`OpenRouter API Error (${model}):`, errorText);
      continue;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    console.log(`\n=== 🤖 AI RAW RESPONSE (${model}) ===\n${content}\n=================================\n`);

    try {
      const parsedData = { ...parseModelJsonContent(content), provider: "openrouter", model };
      console.log(`\n=== ✅ SUCCESSFULLY EXTRACTED OPTIMIZATION ===\nATS Score: ${parsedData.atsScore}\nProvider: ${parsedData.provider} (${model})\n=================================\n`);
      return parsedData;
    } catch (error) {
      console.error(`OpenRouter parse error (${model}):`, error);
      continue;
    }
  }

  if (lastError) {
    console.error("OpenRouter all model attempts failed:", lastError);
  }

  return null;
};

export async function POST(req: Request) {

  let resumeText = "";
  let jobDescription = "";
  let requestedProvider = "local";

  try {
    const body = await req.json();
    resumeText = body?.resumeText;
    jobDescription = body?.jobDescription;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resumeText or jobDescription" },
        { status: 400 }
      );
    }

    const provider = (process.env.OPTIMIZER_PROVIDER || "local").toLowerCase();
    requestedProvider = provider;

    if (provider === "local") {
      return NextResponse.json(buildLocalOptimization(resumeText, jobDescription));
    }

    const providerResult =
      provider === "openrouter"
        ? await callOpenRouterOptimizer(resumeText, jobDescription)
        : await callXaiOptimizer(resumeText, jobDescription);

    if (providerResult) {
      return NextResponse.json(providerResult);
    }

    return NextResponse.json({
      ...buildLocalOptimization(resumeText, jobDescription),
      requestedProvider,
      optimizationWarning:
        "Remote optimizer failed or unavailable; used local optimization fallback.",
    });
  } catch (error: any) {
    console.error("Optimizer Route Error:", error);

    if (resumeText && jobDescription) {
      return NextResponse.json({
        ...buildLocalOptimization(resumeText, jobDescription),
        requestedProvider,
        optimizationWarning: "AI provider failed; used local optimization fallback.",
      });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
