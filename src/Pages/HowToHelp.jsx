import { Helmet } from "react-helmet";
import HowItWorks from "./../components/HowItWorks";

const HowToHelp = () => {
  return (
    <div className="container mx-auto">
      <Helmet>
        <title>How to Help - Warm Hearts</title>
      </Helmet>
      <HowItWorks />
    </div>
  );
};

export default HowToHelp;
