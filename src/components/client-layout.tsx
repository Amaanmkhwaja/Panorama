"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import ModalProvider from "@/providers/modal-provider";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <>
      <ConvexProvider client={convex}>
        <NextUIProvider>
          <ModalProvider>{children}</ModalProvider>
        </NextUIProvider>
      </ConvexProvider>
    </>
  );
};

export default ClientLayout;
