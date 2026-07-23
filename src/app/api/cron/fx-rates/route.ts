import { NextResponse, type NextRequest } from "next/server";
import { fetchAndStoreFxRates } from "@/lib/fx/bonbast";
import { getFxSchedule, isWithinScheduledWindow } from "@/lib/fx/schedule";

/**
 * Vercel Cron hits this every 15 minutes (see vercel.json); the route
 * itself decides whether "now" matches one of the admin-configured
 * Tehran-local times before actually spending an Apify run. That's what
 * makes the schedule editable from the admin panel without redeploying
 * vercel.json — Vercel's own cron entries are fixed at deploy time.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schedule = await getFxSchedule();
  const now = new Date();

  if (!isWithinScheduledWindow(schedule, now)) {
    return NextResponse.json({ skipped: true, reason: "outside scheduled window", now: now.toISOString() });
  }

  const snapshot = await fetchAndStoreFxRates();
  return NextResponse.json({ skipped: false, snapshot });
}
