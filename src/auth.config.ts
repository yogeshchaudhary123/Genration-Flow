import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;
      const isApiRoute = nextUrl.pathname.startsWith("/api");
      const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isPublicApiRoute = nextUrl.pathname.startsWith("/api/products") || nextUrl.pathname.startsWith("/api/ai/suggestions");
      const isAdminApiRoute = nextUrl.pathname.startsWith("/api/admin");

      const protectedRoutes = ["/cart", "/checkout", "/orders", "/profile"];
      const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginOrRegister = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      // Protect admin API routes
      if (isAdminApiRoute && (!isLoggedIn || userRole !== "ADMIN")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 }) as any;
      }

      // Protect private API routes
      if (isApiRoute && !isAuthRoute && !isPublicApiRoute && !isAdminApiRoute && !isLoggedIn) {
        return false;
      }

      // Protect frontend routes
      if (isLoggedIn) {
        // Logged-in users cannot access login or register page
        if (isLoginOrRegister) {
          return Response.redirect(new URL("/", nextUrl));
        }
        // Non-admins cannot access admin pages
        if (isAdminRoute && userRole !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
      } else {
        // Non-logged-in users cannot access admin or protected routes
        if (isAdminRoute || isProtectedRoute) {
          return false; // Redirects to pages.signIn (/login)
        }
      }

      return true;
    },
  },
  providers: [], // Providers are added in auth.ts
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
