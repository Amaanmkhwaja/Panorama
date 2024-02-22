import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

import { GetStartedButton } from "./get-started-button";
import { MobileNav } from "./mobile-nav";

export const Navbar = async () => {
  return (
    <div className="sticky inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex">
            <span className="text-lg font-bold">Pano</span>
            <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
              <span className="text-lg font-bold">rama</span>
            </div>
          </Link>
          <div className="items-center space-x-4 flex relative">
            <Link href="#features" className="hidden md:block">
              <Button className="rounded-full" variant="ghost">
                Features
              </Button>
            </Link>
            <Link href="#pricing" className="hidden md:block">
              <Button className="rounded-full" variant="ghost">
                Pricing
              </Button>
            </Link>
            <Link href="#testimonials" className="hidden md:block">
              <Button className="rounded-full" variant="ghost">
                Testimonials
              </Button>
            </Link>
            <Link href="#faq" className="hidden md:block">
              <Button className="rounded-full" variant="ghost">
                FAQ
              </Button>
            </Link>
            <GetStartedButton />
            <UserButton />
            <MobileNav />
          </div>
        </div>
      </div>
    </div>
  );
};
