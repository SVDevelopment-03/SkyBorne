import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import BlogList from "./BlogList";

const Blogs = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:gap-32.5">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/about-us.jpg"
          badge="Blogs"
          heading="Skyborne Journal Wellness."
        />
      </div>
      <div className="px-2 md:px-6 xl:p-0">
        <BlogList />
      </div>
    </div>
  );
};

export default Blogs;
