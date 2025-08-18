import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const publicPaths = ['/login', '/signup'];

	const { pathname } = request.nextUrl;
	const hasSession = request.cookies.has('session');

	if (publicPaths.includes(pathname)) {
		return NextResponse.next();
	}

	if (!hasSession) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
