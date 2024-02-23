import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import { Navbar } from "./_components/navbar";

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default async function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <main className="min-h-screen bg-white text-black">
        <Navbar />
        {children}
      </main>
    </SessionProvider>
  );
}
