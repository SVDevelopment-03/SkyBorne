import { BannerHeading } from "@/components/ui/heading";
import { Button } from "./button";

interface BannerUiProps {
  src: string;
  buttonText: string;
  heading: string;
  cssClass?: string;
}

const ServiceCard = ({ src, buttonText, heading }: BannerUiProps) => {
  return (
    <div className="relative overflow-hidden bg-[#FFF7DD] rounded-2xl">
      <div
        className={`flex flex-col inset-0 px-3 md:px-15 py-6 bg-no-repeat bg-cover  h-[449px]`}
        style={{ backgroundImage: `url(${src})` }}
      >
        <div className="flex flex-col justify-center items-center gap-6 h-full mt-10">
          <BannerHeading title={heading} cssClass="!text-[30px]" />
          <Button
            variant={"outline"}
            className="text-[#FFF7DD] border-[#FFF7DD] py-2"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
