import { auth } from "./auth";

export const proxy = auth;

export const config = {
  // Match all paths except api, static assets, etc.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
