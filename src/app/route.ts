import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  if (request.cookies.has("sessionId")) {
    redirect('/home')
  }

  redirect('/login')
}
