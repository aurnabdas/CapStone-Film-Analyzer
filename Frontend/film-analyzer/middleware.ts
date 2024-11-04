import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that need protection, excluding /signup and /login paths
const isProtectedRoute = createRouteMatcher('/((?!signup|login).*)');

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Add protected routes
    '/protected(.*)',
  ],
};