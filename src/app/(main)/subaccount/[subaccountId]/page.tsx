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
  return <div>SubaccountIdPageProps</div>;
};

export default SubaccountIdPage;
