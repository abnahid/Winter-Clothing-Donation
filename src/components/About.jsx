import { Link } from "react-router-dom";
import { useBranding } from "../context/BrandingContext";
import "../index.css";

const About = () => {
  const { settings } = useBranding();
  const about = settings.about || {};
  const image = settings.overviewImage || about.missionImage || "https://i.ibb.co.com/hFKT7MM/pexels-photo-6995106.webp";
  const title = settings.overviewTitle || `${settings.siteName} সম্পর্কে`;

  return (
    <div className="card lg:card-side my-16 space-y-5" data-aos="fade-up">
      <figure className="w-full lg:w-[50%] rounded-2xl overflow-hidden shadow-sm">
        <img
          src={image}
          alt={title}
          className="object-cover object-center w-full h-[400px] lg:h-[550px] rounded-2xl"
        />
      </figure>
      <div className="flex flex-col justify-center lg:ml-12 w-full lg:w-[50%] gap-4">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-wide leading-10 text-gray-900">
          {title}
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed text-base lg:text-lg">
          {settings.overview}
        </p>
        <div className="card-actions">
          <Link
            to="/about"
            className="btn bg-gradient-to-r from-[#1da1f2] to-[#0e71c8] text-white hover:opacity-90 shadow-md"
          >
            আমাদের সম্পর্কে আরও জানুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
