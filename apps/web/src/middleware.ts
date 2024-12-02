import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { IUser } from "./stores/auth-store";

const protectedRoutes = ["/admin","login"];

export default async function middleware(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isProtected = protectedRoutes.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    );

    const token = cookieStore.get("access_token")?.value || "";

    if (isProtected && !token) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    const user: IUser = jwtDecode(token);

    if (
      isProtected &&
      req.nextUrl.pathname.startsWith("/admin") &&
      user.role !== 1
    ) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (token && req.nextUrl.pathname == '/login') {
      if (user.role == 1) {
        return NextResponse.redirect(new URL('/admin', req.url));
      } else {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};