import { Link } from "react-router-dom";
import "../index.css";
const About = () => {
  return (
    <div className="card lg:card-side my-16 space-y-5" data-aos="fade-up">
      <figure className=" w-full lg:w-[50%] rounded-2xl">
        <img
          src="https://i.ibb.co.com/hFKT7MM/pexels-photo-6995106.webp"
          alt="Volunteers sorting and packing clothes"
          className="object-cover object-center w-full  h-[500px]  lg:h-[688px] rounded-2xl"
        />
      </figure>
      <div className="flex flex-col justify-center lg:ml-24 w-full lg:w-[50%] gap-4">
        <h2 className="text-4xl font-bold tracking-wide leading-10 text-gray-900">
          About Warm Hearts Initiative
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Our mission is to connect generous donors with volunteers to
          distribute essential winter clothing to underprivileged communities in
          Bangladesh. By working together, we aim to bring hope and warmth to
          those who need it most. Through this initiative, countless lives are
          touched as we strive to combat the harsh challenges of winter faced by
          the underprivileged. Each donation not only provides physical comfort
          but also uplifts spirits, creating a ripple effect of kindness and
          compassion. Your support helps us ensure that no one is left to face
          the cold alone.
        </p>
        <div className="card-actions">
          <Link
            to="about"
            className="btn bg-gradient-to-r from-[#1da1f2] to-[#0e71c8] text-BgColor animate-gradient"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
