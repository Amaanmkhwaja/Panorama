import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

import { MobileNav } from "./mobile-nav";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { LoginButton } from "@/components/auth/login-button";

export const Navbar = async () => {
  const user = await currentUser();
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
              <Button className="rounded-full" variant="ghost" size="sm">
                Features
              </Button>
            </Link>
            <Link href="#pricing" className="hidden md:block">
              <Button className="rounded-full" variant="ghost" size="sm">
                Pricing
              </Button>
            </Link>
            <Link href="#testimonials" className="hidden md:block">
              <Button className="rounded-full" variant="ghost" size="sm">
                Testimonials
              </Button>
            </Link>
            {!user && (
              <>
                {/* <Link href="/agency/auth/login" className="hidden md:block">
                  <Button className="rounded-full" variant="ghost" size="sm">
                    Login
                  </Button>
                </Link> */}
                <LoginButton mode="modal">
                  <span
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Login
                  </span>
                </LoginButton>
                <Link href="/agency/auth/register">
                  <Button className="rounded-full">
                    Get Started <ArrowRight className="ml-2 w-4 h-4 inline" />
                  </Button>
                </Link>
              </>
            )}
            {/* <GetStartedButton /> */}
            <UserButton />
            <MobileNav />
          </div>
        </div>
      </div>
    </div>
  );
};
