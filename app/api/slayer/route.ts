import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const token = request.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Received POST request to /api/slayer with body:", body);


  const response =   await axios.post("http://localhost:8080/api/slayer", body, 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
   ); 


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
