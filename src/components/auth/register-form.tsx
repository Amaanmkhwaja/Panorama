"use client";

import { useState, useTransition } from "react";

import * as z from "zod";
import { ArrowLeft, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { register } from "@/actions/register";

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

import { VerifyPin } from "./verify-pin";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [verificationCode, setVerificationCode] = useState<string | undefined>(
    ""
  );

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    // why use useTransition?
    // for the next.js caching tools such as revalidateTag or revalidatePath
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data.success) {
          setVerificationCode(data.code);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={
        !!verificationCode ? "Verify account to continue" : "Create an account"
      }
      backButtonLabel={!!verificationCode ? "" : "Already have an account?"}
      backButtonHref={!!verificationCode ? "" : "/agency/auth/login"}
      showSocial={!verificationCode}
    >
      {verificationCode ? (
        <>
          <div className="w-full mb-7">
            <FormSuccess message={success} />
          </div>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Smith"
                        type="text"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Create an account"
              )}
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
