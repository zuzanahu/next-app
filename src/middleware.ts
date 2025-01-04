import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (!request.cookies.has('signedIn')) {
        console.log("did redirect")
        return NextResponse.redirect(new URL('/', request.url))
    }
    console.log("didnt redirect")
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/stranka/:path*',
}