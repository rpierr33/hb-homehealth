import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const ADMIN_COOKIE = "hb_admin_token";
const CAREGIVER_COOKIE = "hb_caregiver_token";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const { pathname } = request.nextUrl;
  const isCaregiverRoute = pathname.startsWith("/caregiver");

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  // Allow geolocation on caregiver routes only — EVV clock-in/out needs it.
  response.headers.set(
    "Permissions-Policy",
    isCaregiverRoute
      ? "camera=(), microphone=(), geolocation=(self)"
      : "camera=(), microphone=(), geolocation=()"
  );

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isCaregiverRoute && !pathname.startsWith("/caregiver/login")) {
    const token = request.cookies.get(CAREGIVER_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/caregiver/login", request.url));
    }
    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (payload.role !== "caregiver") {
        return NextResponse.redirect(new URL("/caregiver/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/caregiver/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
