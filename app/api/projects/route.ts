import { NextResponse } from "next/server";
import { initialProjects } from "@/lib/projectsStore";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ success: true, data: initialProjects });
}
