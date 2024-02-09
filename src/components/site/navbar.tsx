import Image from "next/image";
import { currentUser } from "@/lib/auth";

import { UserButton } from "@/components/auth/user-button";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export const Navbar = async () => {
  const user = await currentUser();

  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex items-center justify-between z-10 max-w-7xl mx-auto">
      <Image src={"/assets/logo.svg"} width={40} height={40} alt="plur logo" />

      {user ? (
        <UserButton />
      ) : (
        <LoginButton mode="modal" asChild>
          {/* <LoginButton> */}
          <Button size={"lg"} variant={"secondary"}>
            Sign in
          </Button>
        </LoginButton>
      )}
    </div>
  );
};
