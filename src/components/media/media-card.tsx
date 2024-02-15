"use client";
import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { deleteMedia } from "@/actions/media";
import { saveActivityLogsNotification } from "@/actions/notification";

import { toast } from "../ui/use-toast";

interface MediaCardProps {
  file: Media;
}

const MediaCard = ({ file }: MediaCardProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="border w-full rounded-lg bg-slate-300 dark:bg-slate-900">
          <div className="relative w-full h-40">
            <Image
              src={file.link}
              alt="preview image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <p className="opacity-0 h-0 w-0">{file.name}</p>
          <div className="p-4 relative">
            <p className="text-muted-foreground">
              {file.createdAt.toDateString()}
            </p>
            <p className="text-black dark:text-white">{file.name}</p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(file.link);
                toast({ title: "Copied To Clipboard" });
              }}
            >
              <Copy size={15} /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              const loading = toast({ title: "Deleting media..." });
              const response = await deleteMedia(file.id);
              loading.dismiss();
              if (response.success) {
                await saveActivityLogsNotification({
                  agencyId: undefined,
                  description: `Deleted a media file | ${response.deletedMedia.name}`,
                  subaccountId: response.deletedMedia.subAccountId,
                });
                toast({
                  variant: "success",
                  title: "Deleted File",
                  description: "Successfully deleted the file",
                });
                router.refresh();
              }
              if (response.error) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: response.error,
                });
              }
              setLoading(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MediaCard;
