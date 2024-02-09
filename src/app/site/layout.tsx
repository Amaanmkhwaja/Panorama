import { auth } from "@/auth";
import { Navbar } from "@/components/site/navbar";
import { SessionProvider } from "next-auth/react";

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default async function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <main className="h-full">
        <Navbar />
        {children}
      </main>
    </SessionProvider>
  );
}
