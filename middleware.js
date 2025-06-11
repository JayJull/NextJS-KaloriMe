import { NextResponse } from 'next/server'

export function middleware(request) {
  const sessionId = request.cookies.get('session_id')?.value

  const isProtected = ['/dashboard'].some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !sessionId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
