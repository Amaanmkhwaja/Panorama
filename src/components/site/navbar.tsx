import Image from "next/image";

import { currentUser } from "@/lib/auth";

import { UserButton } from "@/components/auth/user-button";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/global/mode-toggle";

export const Navbar = async () => {
  const user = await currentUser();

  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex items-center justify-between z-10">
      <aside className="flex items-center gap-2">
        <Image
          src={"/assets/logo.svg"}
          width={40}
          height={40}
          alt="panorama logo"
        />
        <span className="text-xl font-bold">Panorama.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        {user ? (
          <UserButton />
        ) : (
          <LoginButton mode="modal" asChild>
            {/* <LoginButton> */}
            <Button className="p-5" size={"lg"} variant={"default"}>
              Sign in
            </Button>
          </LoginButton>
        )}
        <ModeToggle />
      </aside>
    </div>
  );
};
