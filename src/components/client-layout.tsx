"use client";

import ModalProvider from "@/providers/modal-provider";
import { NextUIProvider } from "@nextui-org/react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <>
      <NextUIProvider>
        <ModalProvider>{children}</ModalProvider>
      </NextUIProvider>
    </>
  );
};

export default ClientLayout;
