"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { ArrowLeft, Loader, Loader2 } from "lucide-react";
import { VerifyPin } from "./verify-pin";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [verificationCode, setVerificationCode] = useState<string | undefined>(
    ""
  );

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    // why use useTransition?
    // for the next.js caching tools such as revalidateTag or revalidatePath
    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data?.success) {
          setSuccess(data?.success);
          if (data.code) {
            setVerificationCode(data.code);
          }
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={
        !!verificationCode ? "Verify account to continue" : "Welcome back"
      }
      backButtonLabel={!!verificationCode ? "" : "Don't have an account?"}
      backButtonHref={!!verificationCode ? "" : "/agency/auth/register"}
      showSocial={!verificationCode}
    >
      {verificationCode ? (
        <>
          <VerifyPin
            code={verificationCode}
            email={form.getValues("email")}
            password={form.getValues("password")}
          />
          <div className="w-full flex items-center justify-center mt-7">
            <Button onClick={() => setVerificationCode(undefined)}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="email@example.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <Button size="sm" variant={"link"} asChild className="px-0">
                      <Link href="/agency/auth/reset">Forgot password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </Form>
      )}
      <div className="w-full mt-7">
        <FormError message={error || urlError} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
