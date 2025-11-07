import React from "react";
import Hero from "./Hero";
import Footer from "@/components/layout/footer";
import Features from "./Features";
import Services from "./services";
import Explore from "./Explore";
import Subscription from "./Subscription";

const Home = () => {
  return (
    <div className="flex flex-col gap-19">
      <div className="p-6 w-full bg-white rounded-4xl">
        <Hero />
      </div>
      <div className="p-6">
        <Features />
      </div>
      <div className="p-6">
        <Services />
      </div>
      <div>
        <Explore />
      </div>
      {/* <div className="p-6">
        <Subscription />
      </div> */}
      <div className="p-6">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
