import { Helmet } from "react-helmet";
import HowItWorks from "./../components/HowItWorks";
import { useBranding } from "../context/BrandingContext";

const HowToHelp = () => {
  const { settings } = useBranding();
  return (
    <div className="container mx-auto">
      <Helmet>
        <title>কীভাবে সহায়তা করবেন - {settings.siteName}</title>
      </Helmet>
      <HowItWorks />
    </div>
  );
};

export default HowToHelp;
