import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLoaderData } from "react-router-dom";
import Campaign from "./Campaign";

const Campaigns = () => {
  const campaigns = useLoaderData();
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("All");

  useEffect(() => {
    setFilteredCampaigns(campaigns);
  }, [campaigns]);

  const handleDivisionClick = (division) => {
    if (division === "All") {
      setFilteredCampaigns(campaigns);
    } else {
      const filtered = campaigns.filter(
        (campaign) => campaign.division === division
      );
      setFilteredCampaigns(filtered);
    }
    setSelectedDivision(division);
  };

  const divisions = [
    "All",
    ...new Set(campaigns.map((campaign) => campaign.division)),
  ];

  return (
    <div className="max-w-6xl mx-auto mt-3 mb-12">
      <Helmet>
        <title>Donation Campaigns - Warm Hearts</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="pb-8">
          <h1 className="text-3xl font-bold text-center">Donation Campaigns</h1>
          <p className="text-center text-gray-600 mt-4">
            Browse our active campaigns and help those in need by donating
            winter essentials.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {divisions.map((division) => (
            <button
              onClick={() => handleDivisionClick(division)}
              className={`btn bg-base-100 border-none hover:bg-blue-400 hover:text-white ${
                selectedDivision === division
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
              key={division}
            >
              {division}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {filteredCampaigns.map((campaign) => (
            <Campaign campaign={campaign} key={campaign.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
