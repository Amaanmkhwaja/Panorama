import { getMediaBySubaccountId } from "@/data/subaccount";

import MediaComponent from "@/components/media";
import { BlurPage } from "@/components/blur-page";

interface SubaccountMediaPageProps {
  params: { subaccountId: string };
}

const SubaccountMediaPage = async ({ params }: SubaccountMediaPageProps) => {
  const mediaFiles = await getMediaBySubaccountId(params.subaccountId);

  return (
    <BlurPage>
      <MediaComponent data={mediaFiles} subaccountId={params.subaccountId} />
    </BlurPage>
  );
};

export default SubaccountMediaPage;
