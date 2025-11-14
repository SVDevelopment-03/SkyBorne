import { BannerHeading, Typography } from "@/components/ui/heading";
import { Button } from "./button";

interface CenterCardProps {
  src: string;
  buttonText: string;
  heading: string;
  cssClass?: string;
  description: string;
}

const CenterCard = ({
  src,
  buttonText,
  heading,
  description,
}: CenterCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl md:rounded-[30px]">
      <div
        className={`flex flex-col inset-0 px-3 md:px-15 py-6 bg-no-repeat bg-cover bg-center bg-[#494949] h-[75dvh] min-h-[558px] md:min-h-[666px]`}
        style={{ backgroundImage: `url(${src})` }}
      >
        <div className="flex flex-col justify-center items-center gap-6 h-full mt-10 text-center!">
          <BannerHeading
            title={heading}
            cssClass="!text-[25px] md:!text-[53px] !text-[#FFF7DD] !max-w-[610px]"
          />
          <Typography
            title={description}
            cssClass="max-w-[702px] text-[#FFF7DD] !text-[13px] md:!text-[19px]"
          />
          <Button
            variant={"outline"}
            className="bg-[#FFF7DD] text-[#494949] text-xs! md:text-[19px]! hover:text-white hover:border-[#B95E82] hover:bg-[#B95E82]"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CenterCard;
