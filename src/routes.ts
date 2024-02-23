/**
 * An array of routes that are accessible to the public
 * These Routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/site",
  "/agency/auth/new-verification",
  "/api/uploadthing",
  "/api/stripe/webhook",
  "/api/stripe/create-checkout-session",
  "/api/stripe/create-customer",
  "/api/stripe/create-subscription",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * authentication purposes
 * @type {string[]}
 */
export const authRoutes = [
  "/agency/auth/register",
  "/agency/auth/login",
  "/agency/auth/error",
  "/agency/auth/reset",
  "/agency/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API
 * authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/agency";
