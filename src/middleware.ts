import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {

  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/denied', req.url));
  }

  try {

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    //console.log(payload);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('email', payload.email as string);

    const res = NextResponse.next({
      request: {
        headers : requestHeaders
      }
    });

    return res;

  } catch (err) {
    return NextResponse.redirect(new URL('/denied', req.url))
  }
}

export const config = {
  matcher: ['/user/home', '/user/talk/:modelid', '/user/profile-settings']
}