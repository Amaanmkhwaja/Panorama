"use client";

import { useModal } from "@/providers/modal-provider";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomModalProps {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CustomModal = ({
  title,
  subheading,
  children,
  defaultOpen,
}: CustomModalProps) => {
  const { isOpen, setClose } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="overflow-scroll h-screen md:max-h-[700px] md:h-fit bg-card">
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
