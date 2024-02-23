"use client";

import { useState, useTransition } from "react";

import { OTPInput, SlotProps } from "input-otp";

import { cn } from "@/lib/utils";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";

interface VerifyPinProps {
  code: string;
  email: string;
  password: string;
}

export const VerifyPin = ({ code, email, password }: VerifyPinProps) => {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleOnChange = (pin: string) => {
    if (pin.length === 6) {
      if (code === pin && pin.length === 6) {
        setSuccess("Loading...");
        setError("");
        startTransition(() => {
          login({ email, password, code })
            .then(async (data) => {
              if (data?.error) {
                setError(data.error);
                setSuccess("");
              }
            })
            .catch(() => {
              setError("Something went wrong. Please try again later.");
            });
        });
      } else {
        setSuccess("");
        setError("Incorrect pin.");
      }
    }
  };

  return (
    <div className="w-full flex-col flex items-center justify-center">
      <OTPInput
        disabled={!!success || isPending}
        maxLength={6}
        onChange={handleOnChange}
        containerClassName="group flex items-center has-[:disabled]:opacity-30"
        render={({ slots }) => (
          <>
            <div className="flex">
              {slots.slice(0, 3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <FakeDash />

            <div className="flex">
              {slots.slice(3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          </>
        )}
      />
      <div className="mt-7">
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </div>
  );
};

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative w-10 h-14 text-[2rem]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
        "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
        "outline outline-0 outline-accent-foreground/20",
        { "outline-4 outline-accent-foreground": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

// Inspired by Stripe's MFA input.
function FakeDash() {
  return (
    <div className="flex w-10 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-border" />
    </div>
  );
}

// You can emulate a fake textbox caret!
function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-white" />
    </div>
  );
}
