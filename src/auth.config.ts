import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const isApiRoute = nextUrl.pathname.startsWith("/api");
      const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isPublicApiRoute = nextUrl.pathname.startsWith("/api/products") || nextUrl.pathname.startsWith("/api/ai/suggestions");
      
      const protectedRoutes = ["/cart", "/checkout", "/orders", "/profile"];
      const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));

      // Protect private API routes
      if (isApiRoute && !isAuthRoute && !isPublicApiRoute && !isLoggedIn) {
        return false;
      }

      // Protect frontend routes
      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [], // Providers are added in auth.ts
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
