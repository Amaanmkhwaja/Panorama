"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";
import { GetMediaFiles } from "@/lib/types";
import { getMediaBySubaccountId } from "@/actions/media";

import MediaComponent from "@/components/media";
import { Loader2 } from "lucide-react";

interface MediaBucketTabProps {
  subaccountId: string;
}

export const MediaBucketTab = ({ subaccountId }: MediaBucketTabProps) => {
  const [data, setdata] = useState<GetMediaFiles>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getMediaBySubaccountId(subaccountId);
      if (response.success) {
        setdata(response.mediaFiles);
      }
      if (response.error) {
        toast.error("Error", {
          description: response.error,
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [subaccountId]);

  return (
    <div className="h-[900px] overflow-auto p-4">
      {loading ? (
        <div className="w-full flex flex-col items-center justify-center gap-4 my-10">
          <span>Loading...</span>
          <Loader2 className="animate-spin w-10 h-10" />
        </div>
      ) : (
        <MediaComponent data={data} subaccountId={subaccountId} />
      )}
    </div>
  );
};
