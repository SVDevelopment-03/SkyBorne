import Signup from "@/components/pages/signup";

interface SignupPageProps {
  searchParams: {
    step?: string;
    [key: string]: string | string[] | undefined; // allow additional params safely
  };
}

const Page =async ({ searchParams }: SignupPageProps) => {
  const { step } = await searchParams;
  console.log("aaaa", step);
  

  return <Signup step={step as string}  />;
};

export default Page;
