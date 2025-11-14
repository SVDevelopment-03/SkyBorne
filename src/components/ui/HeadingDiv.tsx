import { Badge } from "@/components/ui/badge";
import { TypeProp, Typography } from "@/components/ui/heading";
interface HeadingDivProp {
  badge?: string;
  title: string;
  description?: string;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | null
    | undefined
    | "black";
  cssClass?: string;
  type?: TypeProp;
  elemCss?: {
    title?: string;
    description?: string;
  };
}

const HeadingDiv = ({
  badge,
  title,
  description,
  variant = "default",
  cssClass = "",
  type = "xl",
  elemCss = { title: "", description: "" },
}: HeadingDivProp) => {
  return (
    <div className={`flex flex-col gap-2.5 md:gap-5 items-center ${cssClass}`}>
      {badge && <Badge variant={variant}>{badge}</Badge>}
      <Typography title={title} type={type} cssClass={elemCss?.title} />
      {description && (
        <Typography
          title={description}
          cssClass={`max-w-[492px] text-center ${elemCss?.description}`}
        />
      )}
    </div>
  );
};

export default HeadingDiv;
