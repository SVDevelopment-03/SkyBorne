import Image from "next/image";
import Header from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { BannerHeading } from "@/components/ui/heading";

interface BannerUiProps {
  src: string;
  badge: string;
  heading: string;
  cssClass?: string;
}

const BannerUi = ({ src, badge, heading, cssClass }: BannerUiProps) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#FFF7DD] rounded-3xl">
      {/* <div className="w-full">
        <Image
          src={src}
          alt="About Us"
          width={1390}
          height={666}
          className="w-full h-auto object-cover object-center"
          priority
        />
      </div> */}

      {/* Overlay content */}
      <div
        className={`flex flex-col inset-0 px-3 md:px-15 pt-4 pb-7 md:py-6 bg-no-repeat bg-cover bg-left md:bg-center h-[75dvh] min-h-[622px] md:min-h-[666px]`}
        style={{ backgroundImage: `url(${src})` }}
      >
        <Header />
        <div className="flex flex-col justify-end md:justify-center gap-4 md:gap-6 h-full min-h-[510px] mt-10">
          <Badge variant={"blur"}>{badge}</Badge>
          <BannerHeading title={heading} cssClass={cssClass} />
        </div>
      </div>
    </div>
  );
};

export default BannerUi;
