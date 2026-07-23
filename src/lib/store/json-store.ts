import "server-only";
import fs from "fs/promises";
import path from "path";

/**
 * TEMPORARY persistence layer — a JSON file per collection under .data/.
 *
 * This does NOT survive a Vercel deployment: serverless functions get a
 * fresh, read-mostly filesystem per invocation/cold-start, so anything
 * written here is lost on the next deploy (and may not even be shared
 * between concurrent invocations). It exists only so the import agent
 * and FX-rate agent are real and demoable in a long-running environment
 * (this sandbox, or `next start` on a normal server) while a real
 * database (Vercel Postgres recommended — see docs/ARCHITECTURE.md) is
 * provisioned. Swap the two functions below for real queries and every
 * caller keeps working unchanged.
 */

const DATA_DIR = path.join(process.cwd(), ".data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readCollection<T>(name: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeCollection<T>(name: string, data: T): Promise<void> {
  await ensureDataDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}
