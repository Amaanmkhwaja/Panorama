"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyPlusIcon, Loader2, Trash } from "lucide-react";

import { FunnelPageSchema } from "@/schemas";
import { saveActivityLogsNotification } from "@/actions/notification";
import {
  getFunnels,
  upsertFunnelPage,
  deleteFunnelePage,
} from "@/actions/funnel";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { useModal } from "@/providers/modal-provider";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface FunnelPageFormProps {
  defaultData?: Doc<"funnelPage">;
  funnelId: string;
  order: number;
  subaccountId: string;
}

export const FunnelPageForm = ({
  defaultData,
  funnelId,
  order,
  subaccountId,
}: FunnelPageFormProps) => {
  const { setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  const createFunnelPage = useMutation(api.funnelPage.create);
  const deleteFunnelPage = useMutation(api.funnelPage.deleteFunnelPage);
  const updateFunnelPageSettings = useMutation(api.funnelPage.updateSettings);

  const form = useForm<z.infer<typeof FunnelPageSchema>>({
    resolver: zodResolver(FunnelPageSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData]);

  const onSubmit = async (values: z.infer<typeof FunnelPageSchema>) => {
    if (order !== 0 && !values.pathName)
      return form.setError("pathName", {
        message:
          "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });
    if (defaultData) {
      const updatePromise = updateFunnelPageSettings({
        id: defaultData._id,
        name: values.name,
        pathName: values.pathName || "",
      }).then(async () => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated a funnel page | ${values.name}`,
          subaccountId: subaccountId,
        });
        setClose();
      });

      sonnerToast.promise(updatePromise, {
        loading: "Updating funnel page...",
        success: "Updated Funnel Page settings",
        error: "Error updating funnel page settings.",
        duration: 5000,
      });
    } else {
      const createPromise = createFunnelPage({
        name: values.name,
        pathName: values.pathName || "",
        funnelId,
        order,
      }).then(async () => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated a funnel page | ${values.name}`,
          subaccountId: subaccountId,
        });
        setClose();
      });

      sonnerToast.promise(createPromise, {
        loading: "Saving...",
        success: "Created new Funnel Page",
        error: "Error creating funnel page!",
      });
    }
  };

  const handleDelete = async () => {
    if (!defaultData) return;
    const promise = deleteFunnelPage({ id: defaultData._id }).then(async () => {
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a funnel page | ${defaultData.name}`,
        subaccountId: subaccountId,
      });
    });

    sonnerToast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted Funnel Page",
      error: "Error deleting funnel page!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You
          can move them around to change their order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting || order === 0}
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Path for the page"
                      {...field}
                      value={field.value?.toLowerCase()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                className="w-22 self-end"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Page"
                )}
              </Button>

              {defaultData?._id && (
                <Button
                  variant={"outline"}
                  className="w-22 self-end border-destructive text-destructive hover:bg-destructive"
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={handleDelete}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash />
                  )}
                </Button>
              )}
              {/* TODO: implment copying funnel pages with Convex */}
              {/* {defaultData?._id && (
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={async () => {
                    const response = await getFunnels(subaccountId);
                    const lastFunnelPage = response.find(
                      (funnel) => funnel.id === funnelId
                    )?.FunnelPages.length;

                    const upsertResponse = await upsertFunnelPage(
                      subaccountId,
                      {
                        ...defaultData,
                        id: uuid(),
                        order: lastFunnelPage ? lastFunnelPage : 0,
                        visits: 0,
                        name: `${defaultData.name} Copy`,
                        pathName: `${defaultData.pathName}copy`,
                        content: defaultData.content,
                      },
                      funnelId
                    );
                    if (upsertResponse) {
                      toast({
                        variant: "success",
                        title: "Success",
                        description: "Saved Funnel Page Details",
                      });
                      setClose();
                      router.refresh();
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Something went wrong.",
                      });
                    }
                  }}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CopyPlusIcon />
                  )}
                </Button>
              )} */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
