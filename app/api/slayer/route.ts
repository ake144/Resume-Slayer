import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("-----------------------------------------");
    console.log("INTEGRATION TEST: Backend Received Data");
    console.log("Resume Text Snippet:", body.resumeText?.substring(0, 50) + "...");
    console.log("Job Description Snippet:", body.jobDescription?.substring(0, 50) + "...");
    console.log("Job URL:", body.jobURL);
    console.log("-----------------------------------------");


  const response =   await axios.post("http://localhost:8080/api/slayer", body);

   console.log("Response from Java Spring Boot API:", response.data);

    return NextResponse.json(response.data, { status: 200 });
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to process resume data" },
      { status: 500 }
    );
  }
}
