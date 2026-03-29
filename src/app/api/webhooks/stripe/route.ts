import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Stripe webhooks deferred — first 6 months free" },
    { status: 501 },
  );
}
