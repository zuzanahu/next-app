import { v4 as uuid } from "uuid";
import { db } from "@/db";
import { type Session, sessionsTable } from "@/db/schema";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constans";

export type CreateSessionOptions = {
  userId: number;
};

export async function createSession({ userId }: CreateSessionOptions) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionId = uuid();

  const session: Session = {
    userId,
    expiresAt,
    id: sessionId,
  };

  const cookieStore = await cookies();

  await db.insert(sessionsTable).values(session);

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session;
}
