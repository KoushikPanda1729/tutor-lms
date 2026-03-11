import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const isLocalhost = host.includes("localhost");

  // Super admin: app.yourdomain.com or app.localhost:3000
  if (host === `app.${rootDomain}` || host === `app.localhost:3000`) {
    url.pathname = `/super-admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Root domain: marketing site
  if (host === rootDomain || host === "localhost:3000") {
    return NextResponse.next();
  }

  // Subdomain: extract slug
  const subdomain = isLocalhost ? host.split(".localhost")[0] : host.split(`.${rootDomain}`)[0];

  if (subdomain && subdomain !== "www") {
    url.pathname = `/org/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
