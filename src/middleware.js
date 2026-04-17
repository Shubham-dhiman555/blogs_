// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   console.log("Middleware :", request);
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/home', '/myblogs', '/login'],
// };


import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // console.log("request",request)
  const { pathname } = request.nextUrl;
  // console.log("this is token variable :", token);
  if (!token && (pathname === '/home' || pathname === '/myblogs')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  // if (token && pathname === '/signup') {
  //   return NextResponse.redirect(new URL('/home', request.url));
  // }
  // if(token && pathname === '/myblogs' ){
  //   return NextResponse.redirect(new URL('/home', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/myblogs', '/login', '/signup'],
};