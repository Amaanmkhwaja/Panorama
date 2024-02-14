interface MainAgencyPageProps {
  params: {
    agencyId: string;
  };
}

const MainAgencyPage = ({ params }: MainAgencyPageProps) => {
  return <div>MainAgencyPage AgencyID: {params.agencyId}</div>;
};

export default MainAgencyPage;
