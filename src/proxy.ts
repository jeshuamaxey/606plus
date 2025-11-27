import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl
  
  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }
  
  // Protect all other admin routes
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('admin-auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

