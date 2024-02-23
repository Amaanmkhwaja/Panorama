import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-5 sm:px-10 xl:px-5",
        className
      )}
    >
      {children}
    </div>
  );
};
