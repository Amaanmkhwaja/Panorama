"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);

  const onClick = (provider: "google" | "github") => {
    setLoading(true);
    signIn(provider, {
      callbackUrl: "/settings",
    })
      .then(() => setLoading(false))
      .catch(() => toast.error("Something went wrong."));
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        {loading && <Loader2 className="animate-spin mr-2" />}
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        {loading && <Loader2 className="animate-spin mr-2" />}
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};
