import BannerUi from "@/components/ui/banner-ui";
import ServiceList from "./ServiceList";
import Explore from "../home/Explore";
import Testimonials from "../home/Testimonials";
import FAQ from "../home/FAQ";
import Consultation from "../home/Consultation";

const OurServicesPage = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:gap-32">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/our-services.jpg"
          badge="Our services"
          cssClass="min-w-[652px]"
          heading="Unlock Wellness, Unlock Potential"
        />
      </div>
      <div className="px-4 md:px-10 lg:px-[86px]">
        <ServiceList />
      </div>
      <div>
        <Explore />
      </div>
      <div className="p-2 md:p-6">
        <Testimonials />
      </div>
      <div className="p-2 md:p-6">
        <FAQ />
      </div>
      <div className="p-2 md:p-6">
        <Consultation />
      </div>
    </div>
  );
};

export default OurServicesPage;
