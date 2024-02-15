import MediaComponent from "@/components/media";
import { getMediaBySubaccountId } from "@/data/subaccount";

interface SubaccountMediaPageProps {
  params: { subaccountId: string };
}

const SubaccountMediaPage = async ({ params }: SubaccountMediaPageProps) => {
  const mediaFiles = await getMediaBySubaccountId(params.subaccountId);

  return (
    <>
      <MediaComponent data={mediaFiles} subaccountId={params.subaccountId} />
    </>
  );
};

export default SubaccountMediaPage;
