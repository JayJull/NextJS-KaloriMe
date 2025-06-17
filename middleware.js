import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Jika user sudah login dan mengakses halaman auth, redirect ke dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Daftar protected routes
    const protectedPaths = [
      "/dashboard",
      "/laporan",
      "/makanan",
      "/pengaturan",
    ];

    // Jika user belum login dan mengakses protected routes
    const isProtectedRoute = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );
    if (!token && isProtectedRoute) {
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

        if (publicPaths.includes(pathname)) {
          return true;
        }

        // Jika mengakses halaman auth dan sudah ada token, izinkan (redirect ditangani di middleware)
        if ((pathname === "/login" || pathname === "/register") && token) {
          return true;
        }

        // Daftar protected routes
        const protectedPaths = [
          "/dashboard",
          "/laporan",
          "/makanan",
          "/pengaturan",
        ];
        const isProtectedRoute = protectedPaths.some((path) =>
          pathname.startsWith(path)
        );
        if (isProtectedRoute) {
          return !!token;
        }

        // Default: izinkan akses
        return true;
      },
    },
  }
);
