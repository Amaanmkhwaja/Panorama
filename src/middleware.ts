import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  // console.log("=======================================================");
  // console.log("middleware: '" + nextUrl.pathname + "'");

  if (
    nextUrl.pathname === "/" ||
    (nextUrl.pathname === "/site" &&
      nextUrl.host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL("/site", nextUrl));
  }

  // checking if it is API auth route
  if (isApiAuthRoute || isPublicRoute) {
    return NextResponse.next();
  }

  // checking if it is an Auth route
  if (isAuthRoute) {
    // if a logged in user is accessing an auth route, redirect them
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // user is not logged in and is not accessing a public route
  // basically accessing a route that requires a user to be logged in
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/agency/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (nextUrl.pathname === "/agency/auth/new-verification") {
    return NextResponse.next();
  }

  // at this point in the middelware, user is logged in and accessing a route that they are allowed to visit/or user is accessing the landing page
  const searchParams = nextUrl.searchParams.toString();
  let hostname = req.headers;
  const pathWithSearchParams = `${nextUrl.pathname}${
    searchParams.length > 0 ? `${searchParams}` : ""
  }`;
  // console.log("searchParams: " + searchParams);

  // if subdomain exists
  const customSubdomain = hostname
    .get("host")
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubdomain) {
    // console.log("customSubdomain: ", customSubdomain);
    return NextResponse.rewrite(
      new URL(`/${customSubdomain}${pathWithSearchParams}`, nextUrl)
    );
  }

  // if the subdomain doesnt exist then we are going to the next stage
  if (nextUrl.pathname === "/sign-in" || nextUrl.pathname === "/register") {
    return NextResponse.redirect(new URL("/agency/sign-in", nextUrl));
  }

  if (
    nextUrl.pathname.startsWith("/agency") ||
    nextUrl.pathname.startsWith("/subaccount")
  ) {
    console.log("reached /agency or /subaccount");
    // return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, nextUrl));
  }

  // console.log("reached end of middleware");
  // console.log("=======================================================");
  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
// every single route for except for state next files and images are going to invoke the middleware
