import { NextResponse } from "next/server";
import { API_ORIGIN } from "@/lib/api/config";

export async function GET() {
  try {
    const response = await fetch(`${API_ORIGIN}/health/ping`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    return NextResponse.json({ ok: response.ok }, { status: response.ok ? 200 : 503 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
