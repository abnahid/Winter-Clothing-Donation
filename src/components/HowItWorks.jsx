const HowItWorks = () => {
  return (
    <div
      className="bg-gray-50 my-16 rounded-lg max-w-6xl mx-auto"
      data-aos="fade-up"
    >
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
        যেভাবে কাজ করে
      </h2>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">১</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            কার্যক্রম দেখুন
          </h3>
          <p className="text-gray-600">
            আপনার এলাকার চলমান অনুদান কার্যক্রম দেখুন এবং কীভাবে সহায়তা করবেন জানুন।
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">২</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            অনুদানের সামগ্রী বেছে নিন
          </h3>
          <p className="text-gray-600">
            অনুদানের জন্য কম্বল, জ্যাকেট ও সোয়েটারের মতো শীতবস্ত্র বেছে নিন।
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">৩</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            অনুদান ফর্ম পূরণ করুন
          </h3>
          <p className="text-gray-600">
            আপনার কাছ থেকে সংগ্রহের ঠিকানা জানান অথবা নিকটস্থ জমাদানের স্থান খুঁজুন।
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border-gay-200 text-center">
          <div className="text-4xl text-primary mb-4">৪</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            উষ্ণতা ছড়িয়ে দিন
          </h3>
          <p className="text-gray-600">
            স্বেচ্ছাসেবীরা অনুদান প্রয়োজনীয় মানুষের কাছে পৌঁছে দেবেন।
          </p>
        </div>
      </div>

      {/* Flowchart/Graphic Section */}
      <div className="flex justify-between items-center gap-6  flex-col md:flex-row">
        <div className="bg-white p-6 rounded-lg w-full md:w-1/3">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            কার্যক্রমের বিভাগ
          </h3>
          <p className="text-gray-600">
            বর্তমানে আমরা নিচের বিভাগগুলোতে কাজ করছি:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4">
            <li>ঢাকা</li>
            <li>চট্টগ্রাম</li>
            <li>সিলেট</li>
            <li>খুলনা</li>
            <li>রাজশাহী</li>
            <li>বরিশাল</li>
            <li>রংপুর</li>
            <li>ময়মনসিংহ</li>
          </ul>
        </div>
        <div className="text-center w-full md:w-2/3">
          <img
            src="https://i.ibb.co.com/pdMxkdK/a-visually-appealing-flowchart-illustrating-the-st-n-2t-Zgx-NRS2grbs-Tme-Rm-MA-v-BCXOUft-Sk66m4-J9-B.jpg" // Replace with a flowchart/graphic URL
            alt="সহায়তা কার্যক্রমের ধাপচিত্র"
            className="object-cover object-center w-full 
            h-[410px]  lg:h-[350px] rounded-lg "
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
