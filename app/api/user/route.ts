import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    const page = req.nextUrl.searchParams.get("page") || "0";
    const size = req.nextUrl.searchParams.get("size") || "10";

    const token = req.headers.get("Authorization");

    console.log("Received GET request to /api/user with token:", token);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get("https://cv-production-3fe6.up.railway.app/api/user",
    { headers: {
        Authorization: `${token}`
      } }
    );

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
    } else {
      console.error("Unexpected response from Java Spring Boot API:", response.status, response.data);
      return NextResponse.json({ error: "Failed to fetch data from backend" }, { status: 502 });
    }

  }
  catch (error) {
    console.error("Error in GET /api/user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}