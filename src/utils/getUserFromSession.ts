import { SESSION_COOKIE_NAME } from "@/constants";
import { db } from "@/db";
import { sessionsTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";

export async function getUserFromSession() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

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
