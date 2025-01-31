"use server";

import { db } from "@/db";
import { Session, sessionsTable } from "@/db/schema";
import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";

const SESSION_NAME = "sessionId";

export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionId = uuid();

  const session: Session = {
    expiresAt,
    userId,
    id: sessionId,
  };

  await db.insert(sessionsTable).values(session);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function updateSession() {
  //todo
}

export async function getUserSession() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_NAME)?.value;

  if (!sessionId) {
    return undefined;
  }

  const now = new Date();

  return db.query.sessionsTable.findFirst({
    where: and(
      eq(sessionsTable.id, sessionId),
      gt(sessionsTable.expiresAt, now)
    ),
    with: {
      user: {
        columns: {
          password: false,
        },
        with: {
          role: true,
        },
      },
    },
  });
}
