interface SubaccountIdPageProps {
  params: { subaccountId: string };
  searchParams: {
    code: string;
  };
}

const SubaccountIdPage = async ({
  params,
  searchParams,
}: SubaccountIdPageProps) => {
  return <div>SubaccountIdPageId</div>;
};

export default SubaccountIdPage;
