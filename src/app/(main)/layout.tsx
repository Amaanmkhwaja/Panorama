import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default async function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
