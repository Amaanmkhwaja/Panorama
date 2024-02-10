"use client";

import Image from "next/image";

import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

export const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible z-[99999]">
        <Button className="rounded-full h-10 w-10 aspect-square bg-slate-400">
          <Avatar className="relative w-10 h-10">
            {user?.image ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  fill
                  src={user?.image}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{user?.name}</span>
                <div className="relative aspect-square h-full w-full">
                  <Image
                    fill
                    src={"/assets/default_pfp.jpg"}
                    alt="pfp"
                    className="border rounded-full"
                  />
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-[99999]" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {user?.name && <p className="font-medium text-sm">{user?.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-xs text-zinc-700 dark:text-muted-foreground">
                {user?.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem> */}

        {/* <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem> */}

        {/* <DropdownMenuSeparator /> */}

        {/* <SignOutButton> */}
        <DropdownMenuItem onClick={() => logout()}>
          <div className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </div>
        </DropdownMenuItem>
        {/* </SignOutButton> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
