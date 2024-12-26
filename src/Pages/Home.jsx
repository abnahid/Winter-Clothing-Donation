import { Helmet } from "react-helmet";
import About from "../components/About";
import BannerSlider from "../components/BannerSlider";
import Faqs from "../components/Faqs";
import HowItWorks from "../components/HowItWorks";
import TestimonialSlider from "../components/TestimonialSlider";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home - Warm Hearts</title>
      </Helmet>
      <BannerSlider></BannerSlider>
      <About></About>
      <HowItWorks></HowItWorks>
      <TestimonialSlider />
      <Faqs />
    </div>
  );
};

export default Home;
