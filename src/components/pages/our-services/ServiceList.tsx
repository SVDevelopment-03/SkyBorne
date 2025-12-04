import HeadingDiv from "@/components/ui/HeadingDiv";
import MotionDiv from "@/components/ui/MotionDiv";
import ServiceCard from "@/components/ui/service-card";

const ServiceList = () => {
  const serviceListDetail = [
    {
      id: "1",
      image: "/images/services-1.jpg",
      buttonText: "know more",
      heading: "Yoga",
      url:'/yoga-detail/1'
    },
    {
      id: "2",
      image: "/images/services-2.jpg",
      buttonText: "know more",
      heading: "Fitness Classes",
      url:'/fitness-detail/1'
    },
    {
      id: "3",
      image: "/images/services-3.jpg",
      buttonText: "know more",
      heading: "Diet & Nutrition",
        url:'/diet-detail/1'
    },
    {
      id: "4",
      image: "/images/services-4.jpg",
      buttonText: "know more",
      heading: "Zumba Dance",
        url:'/zumba-detail/1'
    },
  ];
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="flex flex-col gap-[52px]">
        <HeadingDiv
          title="Explore Our Signature Services"
          description="Skyborne Drop provides yoga, fitness, nutrition support, and dance classes for every journey and goal."
          elemCss={{
            title: "max-md:!text-center",
            description: "max-md:!text-center",
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 justify-start xl:justify-center gap-5 lg:gap-7.5">
          {serviceListDetail?.map((service, i) => (
            <div
              key={service.id}
              className="w-full"
              // className="flex-1 min-w-[calc(50%-15px)] md:min-w-[calc(50%-15px)]"
            >
              <MotionDiv position={i % 2 == 0 ? "left" : "right"}>
                <ServiceCard
                  comingSoon={false}
                  id={service?.id}
                  url={service?.url}
                  src={service.image}
                  buttonText={service.buttonText}
                  heading={service.heading}
                />
              </MotionDiv>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
