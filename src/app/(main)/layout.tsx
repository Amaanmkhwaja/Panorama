import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function layout({ children }: MainLayoutProps) {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
