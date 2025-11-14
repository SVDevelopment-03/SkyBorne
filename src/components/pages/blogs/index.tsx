import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import BlogList from "./BlogList";

const Blogs = () => {
  return (
    <div className="flex flex-col gap-[130px]">
      <div className="p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/about-us.jpg"
          badge="Blogs"
          heading="Skyborne Journal Wellness."
        />
      </div>
      <div className="p-2 md:px-6 xl:p-0">
        <BlogList />
      </div>
    </div>
  );
};

export default Blogs;
