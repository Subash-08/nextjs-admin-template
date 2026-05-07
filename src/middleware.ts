import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login");

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
            return null;
        }

        if (!isAuth) {
            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }
            return NextResponse.redirect(
                new URL(`/admin/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
            );
        }

        if (
            req.nextUrl.pathname.startsWith("/admin") &&
            req.nextUrl.pathname !== "/admin/login" &&
            token?.role !== "admin" &&
            token?.role !== "editor"
        ) {
            return NextResponse.rewrite(new URL("/403", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                // Allow access to login page without token
                if (req.nextUrl.pathname.startsWith("/admin/login")) {
                    return true;
                }
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"],
};
