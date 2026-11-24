import { Helmet } from "react-helmet";
import { useBranding } from "../context/BrandingContext";
import About from "../components/About";
import BannerSlider from "../components/BannerSlider";
import Faqs from "../components/Faqs";
import HowItWorks from "../components/HowItWorks";
import TestimonialSlider from "../components/TestimonialSlider";

const Home = () => {
  const { settings } = useBranding();
  return (
    <div>
      <Helmet>
        <title>{settings.siteName} - হোম</title>
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
