import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const {password} = await request.json()
    
    const correctPassword = process.env.ADMIN_PASSWORD
    
    if (!correctPassword) {
      return NextResponse.json(
        {success: false, error: 'Admin password not configured'},
        {status: 500}
      )
    }
    
    if (password === correctPassword) {
      // Set a secure cookie with authentication token
      // Cookie expires in 7 days
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      
      const response = NextResponse.json({success: true})
      
      response.cookies.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expires,
        path: '/',
      })
      
      return response
    } else {
      return NextResponse.json(
        {success: false, error: 'Invalid password'},
        {status: 401}
      )
    }
  } catch (error) {
    return NextResponse.json(
      {success: false, error: 'Invalid request'},
      {status: 400}
    )
  }
}

