"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent showX>
        <SheetHeader className="pl-2">
          <SheetTitle className="text-3xl">Panorama</SheetTitle>
          <Image
            src="https://res.cloudinary.com/diikrvcu5/image/upload/v1708633357/icon_2_ydjlyt.png"
            alt="Logo"
            width={200}
            height={200}
            className="w-[70px] h-[70px]"
          />
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Link href="#features">
            <Button className="rounded-full text-lg" variant="ghost">
              Features
            </Button>
          </Link>
          <Link href="#pricing">
            <Button className="rounded-full text-lg" variant="ghost">
              Pricing
            </Button>
          </Link>
          <Link href="#testimonials">
            <Button className="rounded-full text-lg" variant="ghost">
              Testimonials
            </Button>
          </Link>
          <Link href="#faq">
            <Button className="rounded-full text-lg" variant="ghost">
              FAQ
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
