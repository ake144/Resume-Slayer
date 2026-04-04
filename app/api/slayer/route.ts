import axios from "axios";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
      try{
         
        const page = req.nextUrl.searchParams.get("page") || "1";
        const size = req.nextUrl.searchParams.get("size") || "10";

          const token = req.headers.get("Authorization");

          console.log("Received GET request to /api/slayer with token:", token);
          
          if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }

            const response = await axios.get("http://localhost:8080/api/slayer", {
              params: {
                page,
                size
              },
              headers: {
                Authorization: `${token}`
              }
            });

            if(response.status === 200){
                  return NextResponse.json(response.data, { status: 200 });
            } else {
                  console.error("Unexpected response from Java Spring Boot API:", response.status, response.data);
                  return NextResponse.json({ error: "Failed to fetch data from backend" }, { status: 502 });
            }
 
      }
      catch(error){
            console.error("Error in GET /api/slayer:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }

}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requireRemoteOptimization =
      body?.requireRemoteOptimization === true ||
      process.env.REQUIRE_REMOTE_OPTIMIZER === "true";

    const token = request.headers.get("Authorization")?.trim();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeText, jobDescription, jobURL } = body;
    const effectiveJobDescription = jobDescription || jobURL;

    if (!resumeText || !effectiveJobDescription) {
      return NextResponse.json(
        { error: "Missing resumeText and jobDescription/jobURL" },
        { status: 400 }
      );
    }

    console.log("Received POST request to /api/slayer with body:", body);

    const optimizerUrl = new URL("/api/slayer/optimizer", request.url);
    const optimizerResponse = await fetch(optimizerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText,
        jobDescription: effectiveJobDescription,
      }),
    });

    let optimizedResult: any = null;
    let optimizationWarning: string | null = null;

    if (!optimizerResponse.ok) {
      const optimizerError = await optimizerResponse.text();
      console.error("Optimizer API error:", optimizerError);

      if (requireRemoteOptimization) {
        return NextResponse.json(
          {
            error:
              "Remote optimizer request failed. Enable fallback or fix provider/model availability.",
            optimizerError,
          },
          { status: optimizerResponse.status }
        );
      }

      optimizationWarning =
        "Resume optimization unavailable. Proceeded with original resume.";
    } else {
      optimizedResult = await optimizerResponse.json();
    }

    const optimizedResume =
      typeof optimizedResult?.optimizedResume === "string" &&
      optimizedResult.optimizedResume.trim().length > 0
        ? optimizedResult.optimizedResume
        : resumeText;

    const optimizationProvider = optimizedResult?.provider ?? null;
    const optimizationFromApi =
      optimizationProvider === "openrouter" || optimizationProvider === "xai";

    if (optimizedResult?.optimizationWarning) {
      optimizationWarning = optimizationWarning
        ? `${optimizationWarning} ${optimizedResult.optimizationWarning}`
        : optimizedResult.optimizationWarning;
    }

    if (requireRemoteOptimization && !optimizationFromApi) {
      return NextResponse.json(
        {
          error:
            "Remote optimization was required but provider fallback was used (not API output).",
          optimizationProvider,
          optimizationWarning,
        },
        { status: 502 }
      );
    }

    const normalizedToken = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;

    let processedTrapsFixed = Array.isArray(optimizedResult?.trapsFixed) 
      ? optimizedResult.trapsFixed.map((t: string) => `- ${t}`).join('\n')
      : (optimizedResult?.trapsFixed || "");

    const backendPayload = {
      resumeText: resumeText,
      jobDescription: effectiveJobDescription,
      jobTitle: optimizedResult?.jobTitle || body.jobTitle || "Untitled Tech Job",
      jobUrl: body.jobURL || body.jobUrl || "",
      optimizedResume: optimizedResume,
      atsScore: optimizedResult?.atsScore,
      trapsFixed: processedTrapsFixed,
      missingSkills: Array.isArray(optimizedResult?.missingSkills)
        ? optimizedResult.missingSkills.join(', ')
        : (optimizedResult?.missingSkills || ""),
      roadmap: Array.isArray(optimizedResult?.roadmap)
        ? optimizedResult.roadmap.join('\n')
        : (optimizedResult?.roadmap || ""),
    };

    const response = await axios.post(
      "http://localhost:8080/api/slayer",
      backendPayload,
      {
        headers: {
          Authorization: normalizedToken,
        },
      }
    );


    console.log("Response from Java Spring Boot API:", response.data);

    return NextResponse.json(
      {
        ...response.data,
        optimization: optimizedResult,
        optimizationWarning,
        optimizationProvider,
        optimizationFromApi,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to process resume data" },
      { status: 500 }
    );
  }
}
