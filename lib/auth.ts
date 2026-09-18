import { randomBytes, randomInt } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { prisma } from "./prisma";
import { sendPasswordResetEmail, sendTwoFactorCodeEmail } from "./email";
import type { User } from "./generated/prisma/client";

const SESSION_COOKIE = "forge_session";
const SESSION_TTL_DAYS = 30;
const RESET_TOKEN_TTL_MINUTES = 60;
const TWO_FACTOR_CODE_TTL_MINUTES = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({ data: { userId, expiresAt } });

  const store = await cookies();
  store.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return session.id;
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  }
  store.delete(SESSION_COOKIE);
}

/** Reads the session cookie and resolves the logged-in user, or null. Also
 * lazily clears the cookie if the session has expired or was deleted. */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    store.delete(SESSION_COOKIE);
    return null;
  }

  return session.user;
}

/** Invalidates every existing session for a user — used after a password
 * reset so a stolen session can't survive it. */
export async function invalidateAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
  await prisma.passwordResetToken.create({ data: { token, userId, expiresAt } });
  return token;
}

export async function requestPasswordReset(email: string, baseUrl: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always behave the same whether or not the account exists, so this
  // endpoint can't be used to check which emails have accounts.
  if (!user) return;

  const token = await createPasswordResetToken(user.id);
  const resetUrl = new URL(`/reset-password/${token}`, baseUrl).toString();
  await sendPasswordResetEmail(user.email, resetUrl);
}

export interface TwoFactorChallenge {
  challengeId: string;
}

/** Creates and emails a fresh login code, returning the challenge id the
 * client submits alongside the code (never the code itself). */
export async function createTwoFactorChallenge(userId: string, email: string): Promise<TwoFactorChallenge> {
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const expiresAt = new Date(Date.now() + TWO_FACTOR_CODE_TTL_MINUTES * 60 * 1000);
  const challenge = await prisma.twoFactorCode.create({ data: { code, userId, expiresAt } });
  await sendTwoFactorCodeEmail(email, code);
  return { challengeId: challenge.id };
}
