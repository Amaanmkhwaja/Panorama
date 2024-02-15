"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMedia } from "@/actions/media";
import { saveActivityLogsNotification } from "@/actions/notification";
import { UploadMediaSchema } from "@/schemas";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/global/file-upload";
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
import { useModal } from "@/providers/modal-provider";
import { Loader2 } from "lucide-react";

type UploadMediaFormProps = {
  subaccountId: string;
};

const UploadMediaForm = ({ subaccountId }: UploadMediaFormProps) => {
  const { setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof UploadMediaSchema>>({
    resolver: zodResolver(UploadMediaSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof UploadMediaSchema>) {
    try {
      const response = await createMedia(values, subaccountId);
      if (response.success) {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Uploaded a media file | ${values.name}`,
          subaccountId,
        });
        toast({
          variant: "success",
          title: "Succes",
          description: "Uploaded media",
        });
        setClose();
        router.refresh();
      }
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: response.error,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not uploaded media",
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="mt-4"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Upload Media"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadMediaForm;
