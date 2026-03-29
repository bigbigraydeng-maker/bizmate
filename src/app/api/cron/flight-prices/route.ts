import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented — Task 5.1" },
    { status: 501 },
  );
}
