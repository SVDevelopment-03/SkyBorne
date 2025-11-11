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
