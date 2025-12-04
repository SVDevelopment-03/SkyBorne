"use client";
import { BannerHeading } from "@/components/ui/heading";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { Badge } from "./badge";

interface BannerUiProps {
  src: string;
  buttonText: string;
  heading: string;
  cssClass?: string;
  id?: string;
  comingSoon?: boolean;
  url?:string
}

const ServiceCard = ({
  src,
  buttonText,
  heading,
  id,
  comingSoon,
  url=''
}: BannerUiProps) => {
  const router = useRouter();

  const handleRedirect = () => {
    if (id) {
      router.push(url);
    } else {
      router.push(`/yoga-detail`);
    }
  };
  return (
    <div className="relative overflow-hidden bg-[#FFF7DD] rounded-2xl">
      <div
        className={`flex flex-col inset-0 px-3 md:px-15 py-6 bg-no-repeat bg-cover h-[270px] md:h-[449px]`}
        style={{ backgroundImage: `url(${src})` }}
      >
        {/* {comingSoon && <div className="absolute top-3 left-3">
  <Badge>Coming Soon</Badge>
</div>} */}
        <div className="flex flex-col justify-center items-center gap-3.5 md:gap-6 h-full mt-10">
          <BannerHeading title={heading} cssClass="!text-xl md:!text-[30px]" />
          {!comingSoon ? (
            <Button
              variant={"outline"}
              onClick={handleRedirect}
              className="text-[#FFF7DD] border-[#FFF7DD] py-2"
            >
              {buttonText}
            </Button>
          ) : (
            <Button
              variant={"outline"}
              className="text-[#FFF7DD] border-[#FFF7DD] py-2"
              disabled
            >
              Coming Soon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
