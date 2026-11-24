import { Link } from "react-router-dom";
import { useBranding } from "../context/BrandingContext";
import "../index.css";
const About = () => {
  const { settings } = useBranding();
  return (
    <div className="card lg:card-side my-16 space-y-5" data-aos="fade-up">
      <figure className=" w-full lg:w-[50%] rounded-2xl">
        <img
          src={settings.overviewImage || "https://i.ibb.co.com/hFKT7MM/pexels-photo-6995106.webp"}
          alt="শীতবস্ত্র প্রস্তুত করছেন স্বেচ্ছাসেবীরা"
          className="object-cover object-center w-full  h-[500px]  lg:h-[688px] rounded-2xl"
        />
      </figure>
      <div className="flex flex-col justify-center lg:ml-24 w-full lg:w-[50%] gap-4">
        <h2 className="text-4xl font-bold tracking-wide leading-10 text-gray-900">
          {settings.siteName} সম্পর্কে
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">{settings.overview}</p>
        <div className="card-actions">
          <Link
            to="about"
            className="btn bg-gradient-to-r from-[#1da1f2] to-[#0e71c8] text-BgColor animate-gradient"
          >
            আমাদের সম্পর্কে আরও জানুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
