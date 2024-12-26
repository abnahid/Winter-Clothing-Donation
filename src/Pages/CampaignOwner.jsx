import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa6";
const CampaignOwner = () => {
  const owners = [
    {
      id: 1,
      name: "Abdul Jabbar Al Nahid",
      email: "nanayeemgamer@gmail.com",
      profile_picture: "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg",
      bio: "Dedicated to organizing impactful donation campaigns for community welfare.",
      volunteer_history: [
        {
          campaign_name: "Winter Relief in Dhaka",
          role: "Organizer",
          date: "2023-01-10",
        },
        {
          campaign_name: "Sylhet Urban Shelter Drive",
          role: "Volunteer",
          date: "2022-12-15",
        },
      ],
      total_volunteer_count: 10,
    },
  ];

  const owner = owners[0];

  return (
    <div className="py-11">
      <div className="bg-white rounded-lg p-6 w-full lg:max-w-sm mx-auto">
        <div className="flex flex-col items-center">
          <img
            src={owner.profile_picture}
            alt={`${owner.name} Profile`}
            className="w-24 h-24 rounded-full mb-4"
          />

          <h2 className="text-xl font-bold mb-1">{owner.name}</h2>
          <p className="text-gray-600 text-sm">{owner.email}</p>

          <p className="text-center text-gray-700 my-3">{owner.bio}</p>

          <div className="mb-6 flex justify-center space-x-3">
            <a
              href="https://www.linkedin.com/in/ajnahid"
              target="_blank"
              className="text-gray-600 hover:text-gray-900"
            >
              <FaLinkedinIn></FaLinkedinIn>
            </a>
            <a
              href="https://www.facebook.com/abnahidagency"
              target="_blank"
              className="text-gray-600 hover:text-gray-900"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/abnahidseo"
              target="_blank"
              className="text-gray-600 hover:text-gray-900"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/xahid_420"
              target="_blank"
              className="text-gray-600 hover:text-gray-900"
            >
              <FaTwitter />
            </a>
          </div>

          <div className="w-full text-left space-x-2">
            <h3 className="text-lg font-semibold mb-2">Volunteer History:</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              {owner.volunteer_history.map((history, index) => (
                <li key={index}>
                  <strong>{history.campaign_name}</strong> - <br />{" "}
                  {history.role} on {history.date}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-gray-600">
              <strong>Total Campaigns Participated:</strong>{" "}
              {owner.total_volunteer_count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignOwner;
