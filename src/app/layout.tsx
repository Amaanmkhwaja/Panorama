import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "@/components/client-layout";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panorama",
  description: "Panorama the best all in CRM to run your business and grow!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </SessionProvider>
  );
}
