import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { caregivers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Lazy — see lib/auth.ts for rationale (build-safe preview deploys).
let _secret: Uint8Array | null = null;
function getSecret(): Uint8Array {
  if (_secret) return _secret;
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET environment variable is required");
  _secret = new TextEncoder().encode(s);
  return _secret;
}
const COOKIE_NAME = "hb_caregiver_token";
const SESSION_DAYS = 14;

export type CaregiverTokenPayload = {
  sub: string;
  email: string;
  role: "caregiver";
  employeeNo: string;
  passwordResetRequired?: boolean;
};

export async function hashCaregiverPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyCaregiverPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createCaregiverToken(payload: Omit<CaregiverTokenPayload, "role">) {
  return new SignJWT({ ...payload, role: "caregiver" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifyCaregiverToken(token: string): Promise<CaregiverTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "caregiver") return null;
    return payload as unknown as CaregiverTokenPayload;
  } catch {
    return null;
  }
}

export async function getCaregiverFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCaregiverToken(token);
}

export async function setCaregiverAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function clearCaregiverAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function authenticateCaregiver(email: string, password: string) {
  const [user] = await db
    .select()
    .from(caregivers)
    .where(and(eq(caregivers.email, email.toLowerCase()), eq(caregivers.active, true)))
    .limit(1);

  if (!user) return null;

  const valid = await verifyCaregiverPassword(password, user.passwordHash);
  if (!valid) return null;

  return user;
}

export const CAREGIVER_COOKIE_NAME = COOKIE_NAME;
