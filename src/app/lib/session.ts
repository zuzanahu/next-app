"use server"

import { db } from '@/db'
import { Session, sessionsTable } from '@/db/schema';
import { v4 as uuid } from 'uuid';
import { cookies } from 'next/headers';
 
export async function createSession(userId: number) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const sessionId = uuid()

    const session: Session = {
        expires: expiresAt,
        user: userId,
        id: sessionId,
    };  
 
  await db.insert(sessionsTable).values(session)
 
  const cookieStore = await cookies()
  cookieStore.set('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function updateSession() {
    //todo
}