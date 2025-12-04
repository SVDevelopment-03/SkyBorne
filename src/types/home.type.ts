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
  _id: string;
  title: string;
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

export interface DashboardHeadingProps {
  title: string;
  description: string;
  cssClass?: string;
  buttonText?:string;
  selectText?:string;
  dateFilter?:boolean;
}


export interface SessionCardProps {
  image: string;
  duration:string;
  time: string;
  date: string;
  title: string;
}

export interface SessionProps {
  meetingId: string;
  userId: string;
  startTime:string;
  joined: boolean;
  trainer:string;
  region:string;
  isLive:boolean;
  participants: {
    avatar?: string;
    name?: string;
  }[];
  participantsCount: number;

  image: string;
  duration: string;
  time: string;
  date: string;
  title: string;
}


export interface ServiceType {
  id: string;
  title: string;
  description: string;
  image: string;
  uuid: string;
}

export interface IPlan {
  _id: string;
  planId: string;  // UUID you added
  name: string;
  description: string;
  features: string[];
  image: string;
  price: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}



export interface ITestimonial  {
  title: string;
  _id:string;
  description: string;
  isActive: boolean;
  user: {image:string,name:string,totalClasses:number};
}
