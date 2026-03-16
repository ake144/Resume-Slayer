import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("Authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    
    // Attempt to fetch specific ID from backend
    const response = await axios.get(`http://localhost:8080/api/slayer/${resolvedParams.id}`, {
      headers: {
        Authorization: token
      }
    });

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to fetch data from backend" }, { status: 502 });
    }

  } catch (error: any) {
    console.error("GET slayer by id Error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
