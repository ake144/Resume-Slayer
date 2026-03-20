import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from './utils/common'
 
const protectedRoutes = ['/home', '/dashboard', '/profile']

export function proxy(request: NextRequest) {
    const token = getToken()
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }



     if(protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if(protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && token) {
        return NextResponse.next()
    }
        


    return NextResponse.redirect(new URL('/home', request.url))
}


export const config = {
  matcher: '/about/:path*',
}