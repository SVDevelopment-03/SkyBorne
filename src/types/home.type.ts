type VariantType =
  | "theme"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "transparent"
  | "filled"
  | "themeOutline"
  | "yellow"
  | null
  | undefined;
export interface TestimonialInfo {
  id: string;
  heading: string;
  description: string;
  user: {
    image: string;
    name: string;
    totalClasses: number;
  };
}
export interface TestimonialProps {
  data: TestimonialInfo;
}

export interface CustomButtonsProps {
  variant?: VariantType;
  text: string;
  cssClass?: string;
}

export interface OurValueProp {
  image: string;
  title: string;
  description: string;
  cssClass?: string;
  isStart?: boolean;
  icon?: string;
  id?: string | number;
}
