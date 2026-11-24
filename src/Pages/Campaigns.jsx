import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useLoaderData } from "react-router-dom";
import Campaign from "./Campaign";
import { useBranding } from "../context/BrandingContext";

const Campaigns = () => {
  const { settings, campaigns: sharedCampaigns } = useBranding();
  const loaderData = useLoaderData();
  const campaigns = useMemo(
    () => sharedCampaigns !== null ? sharedCampaigns : (loaderData || []),
    [sharedCampaigns, loaderData]
  );
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("সব");

  useEffect(() => {
    setFilteredCampaigns(campaigns);
  }, [campaigns]);

  const handleDivisionClick = (division) => {
    if (division === "সব") setFilteredCampaigns(campaigns);
    else setFilteredCampaigns(campaigns.filter((campaign) => campaign.division === division));
    setSelectedDivision(division);
  };

  const divisions = ["সব", ...new Set(campaigns.map((campaign) => campaign.division).filter(Boolean))];

  return (
    <div className="max-w-6xl mx-auto mt-3 mb-12">
      <Helmet>
        <title>অনুদান কার্যক্রমসমূহ - {settings.siteName}</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="pb-8">
          <h1 className="text-3xl font-bold text-center">অনুদান কার্যক্রম</h1>
          <p className="text-center text-gray-600 mt-4">
            চলমান কার্যক্রমগুলো দেখুন এবং প্রয়োজনীয় শীতবস্ত্র ও অর্থ অনুদানের মাধ্যমে পাশে দাঁড়ান।
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {divisions.map((division) => (
            <button
              onClick={() => handleDivisionClick(division)}
              className={`btn bg-base-100 border-none hover:bg-blue-400 hover:text-white ${
                selectedDivision === division ? "bg-primary text-white" : "bg-gray-200"
              }`}
              key={division}
            >
              {division}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, index) => (
            <Campaign campaign={campaign} key={campaign.id || index} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
