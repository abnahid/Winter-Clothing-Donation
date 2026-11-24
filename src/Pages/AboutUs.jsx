import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useBranding } from "../context/BrandingContext";

const AboutUs = () => {
  const { settings } = useBranding();
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>আমাদের সম্পর্কে - {settings.siteName}</title></Helmet>
      {/* Header Section */}
      <header className="bg-primary text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">আমাদের সম্পর্কে</h1>
          <p className="mt-2 text-lg">
আমাদের লক্ষ্য, স্বপ্ন এবং এই উদ্যোগের পেছনের মানুষদের সম্পর্কে জানুন।
          </p>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img
              src="https://i.ibb.co.com/hFKT7MM/pexels-photo-6995106.webp"
              alt="আমাদের লক্ষ্য"
              className="object-cover object-center w-full  md:h-[500px]  rounded-2xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              আমাদের লক্ষ্য
            </h2>
            <p className="text-gray-600">
              <span className="font-bold">{settings.siteName}</span>-এর লক্ষ্য হলো শীতবস্ত্র ও প্রয়োজনীয় সহায়তা পৌঁছে দিয়ে অসহায় মানুষের পাশে দাঁড়ানো এবং সবাইকে মানবিক কাজে অংশ নেওয়ার সুযোগ করে দেওয়া।
            </p>
            <p className="mt-4 text-gray-600">
              আমরা বিশ্বাস করি, সহমর্মিতা ও সম্মিলিত উদ্যোগ মানুষের জীবনে ইতিবাচক পরিবর্তন আনে। শিক্ষা, স্বাস্থ্যসেবা কিংবা নিত্যপ্রয়োজনীয় সহায়তা—প্রতিটি অবদানই মূল্যবান।
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              আমাদের স্বপ্ন
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              এমন একটি সমাজ গড়ে তোলা, যেখানে প্রত্যেকে প্রয়োজনীয় সহায়তা ও এগিয়ে যাওয়ার সুযোগ পায়। মানুষের মধ্যে দান, সহমর্মিতা এবং টেকসই উন্নয়নের মনোভাব ছড়িয়ে দেওয়াই আমাদের স্বপ্ন।
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          আমাদের দলের সঙ্গে পরিচিত হোন
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg"
              alt="দলের সদস্য"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              আব্দুল জব্বার আল নাহিদ
            </h3>
            <p className="text-gray-600">প্রতিষ্ঠাতা ও প্রধান নির্বাহী</p>
          </div>
          <div className="text-center">
            <img
              src="https://i.ibb.co.com/xLVb14x/website-photos-2.webp"
              alt="দলের সদস্য"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              হরি রবিচন্দ্রন
            </h3>
            <p className="text-gray-600">প্রধান পরিচালন কর্মকর্তা</p>
          </div>
          <div className="text-center">
            <img
              src="https://i.ibb.co.com/nsgmKpH/Shamsh-Hadi.jpg"
              alt="দলের সদস্য"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              শামশ হাদি
            </h3>
            <p className="text-gray-600">বিপণন প্রধান</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold">আজই আমাদের সঙ্গে যুক্ত হোন</h2>
          <p className="mt-2 text-lg">
            এই উদ্যোগের অংশ হয়ে মানুষের জীবনে ইতিবাচক পরিবর্তন আনুন।
          </p>
          <Link
            to="/donate"
            className="btn mt-4 px-6 py-3 bg-white text-primary rounded-lg shadow hover:bg-gray-100"
          >
            অংশ নিন
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
