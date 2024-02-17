"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ContactFormSchema } from "@/schemas";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/global/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactFormProps {
  title: string;
  subTitle: string;
  apiCall: (values: z.infer<typeof ContactFormSchema>) => any;
}

export const ContactForm = ({ apiCall, subTitle, title }: ContactFormProps) => {
  const form = useForm<z.infer<typeof ContactFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const isLoading = form.formState.isLoading;

  // TODO CHALLENGE: We want to create tags for each leads that comes from the form
  // What these tags are? Be able to attach this "tag" to the contact that way for each form here, you can pass
  // along with apiCall, you can pass in a tag, and save that tag for each lead. This way you know which specific form
  // the lead came from. Bc rn the leads are coming in but we dont know where from (see 14:45:00)

  return (
    <Card className="max-w-[500px] w-[500px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(apiCall)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Get a free quote!"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
