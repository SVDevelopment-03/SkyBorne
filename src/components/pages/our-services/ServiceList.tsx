import HeadingDiv from "@/components/ui/HeadingDiv";
import ServiceCard from "@/components/ui/service-card";

const ServiceList = () => {
  const serviceListDetail = [
    {
      id: 1,
      image: "/images/services-1.jpg",
      buttonText: "know more",
      heading: "Yoga",
    },
    {
      id: 2,
      image: "/images/services-2.jpg",
      buttonText: "know more",
      heading: "Fitness Classes",
    },
    {
      id: 3,
      image: "/images/services-3.jpg",
      buttonText: "know more",
      heading: "Diet & Nutrition",
    },
    {
      id: 4,
      image: "/images/services-4.jpg",
      buttonText: "know more",
      heading: "Zumba Dance",
    },
  ];
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="flex flex-col gap-[52px]">
        <HeadingDiv
          title="Explore Our Signature Services"
          description="Skyborne Drop provides yoga, fitness, nutrition support, and dance classes for every journey and goal."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 justify-start xl:justify-center gap-5 lg:gap-7.5">
          {serviceListDetail.map((service) => (
            <div
              key={service.id}
              className="w-full"
              // className="flex-1 min-w-[calc(50%-15px)] md:min-w-[calc(50%-15px)]"
            >
              <ServiceCard
                src={service.image}
                buttonText={service.buttonText}
                heading={service.heading}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
