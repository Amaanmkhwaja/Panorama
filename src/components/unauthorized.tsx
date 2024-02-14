import Link from "next/link";
import { buttonVariants } from "./ui/button";

export const Unauthorized = () => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized acccess!</h1>
      <p>Please contact support or your agency owner to get access</p>
      <Link
        className={buttonVariants({
          variant: "default",
          size: "lg",
          className: "mt-4",
        })}
        href="/"
      >
        Go home
      </Link>
    </div>
  );
};
