import { BannerHeading, Typography } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardBannerProps {
  src: string;
  buttonText: string;
  heading: string;
  cssClass?: string;
  description: string;

  badgeTitle: string;
  badgeDate: string;
}

const DashboardBanner = ({
  src,
  badgeTitle,
  badgeDate,
  buttonText,
  heading,
  description,
}: DashboardBannerProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl md:rounded-[20px]">
      <div
        className={`flex flex-col inset-0 px-3 md:px-9 py-5.5 bg-no-repeat bg-cover bg-center bg-[#494949] h-[33dvh] min-h-[200px] md:min-h-[322px]`}
        style={{
          backgroundImage: `linear-gradient(270deg, rgba(0,0,0,0.09) 0%, #000000 100%), url(${src})`,
        }}
      >
        <Badge variant={"blur"} className="rounded-xl px-3! py-1.5! mt-auto">
          {
            <div className="flex flex-col items-start">
              <Typography
                title={badgeTitle}
                cssClass="text-[15px]! text-white "
              />
              <Typography
                title={badgeDate}
                cssClass="text-[13px]! text-white "
              />
            </div>
          }
        </Badge>
        <div className="flex flex-col justify-end items-start gap-[11px] h-full pt-7.5 text-center!">
          <BannerHeading
            title={heading}
            cssClass="!text-[24px] md:!text-[40px] font-satoshi-700 !max-w-[374px] !text-start"
          />
          <Typography
            title={description}
            cssClass="max-w-[702px]  text-white !text-[13px] md:!text-lg font-satoshi-400"
          />
          <Button
            variant={"outline"}
            className="bg-[#FFF7DD] text-[#494949] text-xs! md:text-[15px]! hover:text-white hover:border-[#B95E82] hover:bg-[#B95E82]"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardBanner;
