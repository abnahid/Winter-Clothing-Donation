import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-primary text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">আমাদের সম্পর্কে</h1>
          <p className="mt-2 text-lg">
            Learn more about our mission, vision, and the people behind our
            initiative.
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
              At <span className="font-bold">উষ্ণ হৃদয় উদ্যোগ</span>, our
              mission is to bring positive change to communities in need by
              running impactful donation campaigns and empowering individuals to
              contribute meaningfully.
            </p>
            <p className="mt-4 text-gray-600">
              We believe in the power of compassion and collective effort to
              make the world a better place. Whether through education,
              healthcare, or basic necessities, every contribution matters.
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
              To create a world where everyone has access to basic necessities
              and opportunities to thrive. We aim to inspire a global community
              of givers and changemakers to bridge gaps and foster sustainable
              development.
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
              alt="Team Member"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Abdul Jabbar Al Nahid
            </h3>
            <p className="text-gray-600">প্রতিষ্ঠাতা ও প্রধান নির্বাহী</p>
          </div>
          <div className="text-center">
            <img
              src="https://i.ibb.co.com/xLVb14x/website-photos-2.webp"
              alt="Team Member"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Hari Ravichandran
            </h3>
            <p className="text-gray-600">প্রধান পরিচালন কর্মকর্তা</p>
          </div>
          <div className="text-center">
            <img
              src="https://i.ibb.co.com/nsgmKpH/Shamsh-Hadi.jpg"
              alt="Team Member"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Shamsh Hadi
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
            to="/campaigns"
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
