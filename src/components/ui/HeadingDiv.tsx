import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/heading";
interface HeadingDivProp {
  badge?: string;
  title: string;
  description: string;
}

const HeadingDiv = ({ badge, title, description }: HeadingDivProp) => {
  return (
    <div className="flex flex-col gap-5 items-center">
      {badge && <Badge>{badge}</Badge>}
      <Typography title={title} type="xl" />
      <Typography title={description} cssClass="max-w-[492px] text-center" />
    </div>
  );
};

export default HeadingDiv;
