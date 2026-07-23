import "server-only";
import { readCollection, writeCollection } from "@/lib/store/json-store";

export type FxSchedule = {
  /** 24h "HH:mm" times, interpreted in Asia/Tehran local time. */
  timesLocal: string[];
  timezone: "Asia/Tehran";
  toleranceMinutes: number;
};

const SCHEDULE_COLLECTION = "fx-schedule";

const DEFAULT_SCHEDULE: FxSchedule = {
  timesLocal: ["11:00", "12:00", "15:00", "17:00"],
  timezone: "Asia/Tehran",
  toleranceMinutes: 10,
};

export async function getFxSchedule(): Promise<FxSchedule> {
  return readCollection<FxSchedule>(SCHEDULE_COLLECTION, DEFAULT_SCHEDULE);
}

export async function setFxSchedule(timesLocal: string[]): Promise<FxSchedule> {
  const cleaned = timesLocal
    .map((t) => t.trim())
    .filter((t) => /^\d{2}:\d{2}$/.test(t))
    .sort();
  const schedule: FxSchedule = { ...DEFAULT_SCHEDULE, timesLocal: cleaned };
  await writeCollection(SCHEDULE_COLLECTION, schedule);
  return schedule;
}

/** True if "now" falls within toleranceMinutes of any configured Tehran-local time. */
export function isWithinScheduledWindow(schedule: FxSchedule, now: Date): boolean {
  const tehranNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tehran" }));
  const nowMinutes = tehranNow.getHours() * 60 + tehranNow.getMinutes();

  return schedule.timesLocal.some((time) => {
    const [h, m] = time.split(":").map(Number);
    const targetMinutes = h * 60 + m;
    return Math.abs(nowMinutes - targetMinutes) <= schedule.toleranceMinutes;
  });
}
