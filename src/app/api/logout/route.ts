import {NextResponse} from 'next/server'

export async function POST() {
  const response = NextResponse.json({success: true})
  
  // Clear the authentication cookie
  response.cookies.set('admin-auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  })
  
  return response
}

