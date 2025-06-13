import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Jika user sudah login dan mengakses halaman auth, redirect ke dashboard/home
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Jika user belum login dan mengakses protected routes
    if (!token && pathname.startsWith("/dashboard")) {
      // Redirect ke home dengan parameter untuk show login modal
      const url = new URL("/", req.url);
      url.searchParams.set("showLogin", "1");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Halaman public yang tidak perlu authentication
        const publicPaths = ["/", "/about", "/contact"];

        // Jika mengakses halaman public, izinkan tanpa token
        if (publicPaths.includes(pathname)) {
          return true;
        }

        // Jika mengakses halaman auth dan sudah ada token, izinkan (akan di-redirect di middleware)
        if ((pathname === "/login" || pathname === "/register") && token) {
          return true;
        }

        // Untuk protected routes, cek apakah ada token
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/profile")
        ) {
          return !!token;
        }

        // Default: izinkan akses
        return true;
      },
    },
  }
);
