import { useBranding } from "../context/BrandingContext";

const HowItWorks = () => {
  const { settings } = useBranding();
  const how = settings.howItWorks || {};
  const steps = Array.isArray(how.steps) && how.steps.length > 0 ? how.steps : [
    { id: 1, stepNumber: "১", title: "কার্যক্রম দেখুন", description: "আপনার এলাকার চলমান অনুদান কার্যক্রম দেখুন এবং কীভাবে সহায়তা করবেন জানুন।" },
    { id: 2, stepNumber: "২", title: "অনুদানের সামগ্রী বেছে নিন", description: "অনুদানের জন্য কম্বল, জ্যাকেট ও সোয়েটারের মতো শীতবস্ত্র বেছে নিন।" },
    { id: 3, stepNumber: "৩", title: "অনুদান ফর্ম পূরণ করুন", description: "আপনার কাছ থেকে সংগ্রহের ঠিকানা জানান অথবা নিকটস্থ জমাদানের স্থান খুঁজুন।" },
    { id: 4, stepNumber: "৪", title: "উষ্ণতা ছড়িয়ে দিন", description: "স্বেচ্ছাসেবীরা অনুদান প্রয়োজনীয় মানুষের কাছে পৌঁছে দেবেন।" },
  ];

  const divisionsList = typeof how.divisions === "string"
    ? how.divisions.split(",").map((d) => d.trim()).filter(Boolean)
    : (Array.isArray(how.divisions) ? how.divisions : ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা", "রাজশাহী", "বরিশাল", "রংপুর", "ময়মনসিংহ"]);

  return (
    <div
      className="bg-gray-50 my-16 rounded-lg max-w-6xl mx-auto p-4 md:p-8"
      data-aos="fade-up"
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        {how.title || "যেভাবে কাজ করে"}
      </h2>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {steps.map((step, idx) => (
          <div key={step.id || idx} className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="text-4xl text-primary font-bold mb-4">{step.stepNumber || (idx + 1)}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Flowchart/Graphic Section */}
      <div className="flex justify-between items-center gap-6 flex-col md:flex-row">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 w-full md:w-1/3">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {how.divisionsTitle || "কার্যক্রমের বিভাগ"}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {how.divisionsSubtitle || "বর্তমানে আমরা নিচের বিভাগগুলোতে কাজ করছি:"}
          </p>
          <ul className="grid grid-cols-2 gap-2 text-gray-700">
            {divisionsList.map((div, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                <span>{div}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center w-full md:w-2/3">
          <img
            src={how.flowchartImage || "https://i.ibb.co.com/pdMxkdK/a-visually-appealing-flowchart-illustrating-the-st-n-2t-Zgx-NRS2grbs-Tme-Rm-MA-v-BCXOUft-Sk66m4-J9-B.jpg"}
            alt="সহায়তা কার্যক্রমের ধাপচিত্র"
            className="object-cover object-center w-full h-[320px] lg:h-[350px] rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
