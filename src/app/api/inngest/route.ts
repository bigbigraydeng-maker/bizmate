import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Inngest not configured — Phase 2+" },
    { status: 501 },
  );
}
