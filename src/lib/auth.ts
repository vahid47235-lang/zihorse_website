import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Minimal single-account session auth for the admin panel.
 * Not a multi-user system — there is exactly one super-admin account,
 * hardcoded here, until real accounts move into the Go/Postgres backend
 * (see docs/ARCHITECTURE.md). The session cookie is HMAC-signed so a
 * forged cookie value fails verification even though middleware only
 * checks for its presence.
 */

export const SESSION_COOKIE = "zh_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "zihorse-dev-secret-change-me";

const SUPER_ADMIN = {
  email: "admin@zihorse.ir",
  name: "مدیر ارشد زی‌هورس",
  role: "مدیر ارشد",
  passwordHash: "14cc87dd100fd69c0d85d24c45b2a476c625eec2208e1354a6342dc52ed09828",
};

export type Session = { email: string; name: string; role: string; exp: number };

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== SUPER_ADMIN.email) return null;

  const candidate = Buffer.from(hashPassword(password));
  const expected = Buffer.from(SUPER_ADMIN.passwordHash);
  if (candidate.length !== expected.length || !crypto.timingSafeEqual(candidate, expected)) {
    return null;
  }
  return SUPER_ADMIN;
}

export async function createSession() {
  const payload: Session = {
    email: SUPER_ADMIN.email,
    name: SUPER_ADMIN.name,
    role: SUPER_ADMIN.role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const token = `${encoded}.${sign(encoded)}`;

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as Session;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
