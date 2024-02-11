import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "@/components/client-layout";
import { ThemeProvider } from "@/providers/theme-provider";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panorama",
  description:
    "Panorama the best all in one CRM to run your business and grow!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
