const HowItWorks = () => {
  return (
    <div
      className="bg-gray-50 my-16 rounded-lg max-w-6xl mx-auto"
      data-aos="fade-up"
    >
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
        How It Works
      </h2>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">1</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Browse Campaigns
          </h3>
          <p className="text-gray-600">
            View ongoing donation campaigns in your area and learn how you can
            help.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">2</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Select Items to Donate
          </h3>
          <p className="text-gray-600">
            Choose winter items like blankets, jackets, and sweaters to donate.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">3</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Fill Out the Donation Form
          </h3>
          <p className="text-gray-600">
            Provide your pickup details or find the nearest drop-off points.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">4</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Spread Warmth
          </h3>
          <p className="text-gray-600">
            Volunteers will ensure your donations reach those in need.
          </p>
        </div>
      </div>

      {/* Flowchart/Graphic Section */}
      <div className="flex justify-between items-center gap-6  flex-col md:flex-row">
        <div className="bg-white p-6 rounded-lg w-full md:w-1/3">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Supported Divisions
          </h3>
          <p className="text-gray-600">
            We are currently active in the following divisions:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4">
            <li>Dhaka</li>
            <li>Chattogram</li>
            <li>Sylhet</li>
            <li>Khulna</li>
            <li>Rajshahi</li>
            <li>Barishal</li>
            <li>Rangpur</li>
            <li>Mymensingh</li>
          </ul>
        </div>
        <div className="text-center w-full md:w-2/3">
          <img
            src="https://i.ibb.co.com/pdMxkdK/a-visually-appealing-flowchart-illustrating-the-st-n-2t-Zgx-NRS2grbs-Tme-Rm-MA-v-BCXOUft-Sk66m4-J9-B.jpg" // Replace with a flowchart/graphic URL
            alt="Flowchart showing how it works"
            className="object-cover object-center w-full 
            h-[410px]  lg:h-[350px] rounded-lg "
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
