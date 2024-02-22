"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ArrowRight, Loader } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";

import { Button } from "@/components/ui/button";

export const GetStartedButton = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const handleGetStartedClick = () => {
    setLoading(true);
    if (!user) {
      router.push("/sign-in");
    } else {
      router.push("/agency");
    }
  };
  return (
    <Button
      disabled={loading}
      onClick={handleGetStartedClick}
      className="rounded-full"
    >
      {loading ? (
        <Loader className="animate-spin h-4 w-4" />
      ) : (
        <>
          Get Started <ArrowRight className="ml-2 w-4 h-4 inline" />
        </>
      )}
    </Button>
  );
};
