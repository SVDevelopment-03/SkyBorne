import Hero from "./Hero";
import Features from "./Features";
import Services from "./Services";
import Explore from "./Explore";
import Subscriptions from "./Subscription";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Consultation from "./Consultation";

const Home = () => {
  return (
    <div className="flex flex-col gap-[70px] md:gap-19">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <Hero />
      </div>
      <div className="p-2 md:p-6">
        <Features />
      </div>
      <div className="p-0 md:p-6">
        <Services />
      </div>
      <div>
        <Explore />
      </div>
      <div className="p-2 md:p-6">
        <Subscriptions />
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

export default Home;
