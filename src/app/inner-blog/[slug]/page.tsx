import Header from "@/components/layout/header";
import { InnerBlogDetail } from "@/components/pages/inner-blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Copy, Facebook, LinkedIn, Rocket, Twitter } from "@/icons/helpIcon";
import Image from "next/image";

const yogaDetails = [
  {
    id: 1,
    isMain: false,
    image: "/images/article-1.jpg",
    title: "Finding Calm in Busy Times",
    description:
      "Yoga and meditation create balance. Breathing promotes relaxation.",
  },
  {
    id: 2,
    isMain: true,
    image: "/images/article-2.jpg",
    title: "The Science of Movement",
    description:
      "Learn how activity benefits your body and mind. Find tips for daily movement.",
  },
  {
    id: 3,
    isMain: false,
    image: "/images/article-3.jpg",
    title: "Food, Mood, and Motivation",
    description:
      "Explore nutrition guides linking food to emotions. Find meal plans for busy lives.",
  },
];

export const blogs = [
  {
    slug: "1",
    title: "Finding Calm in Busy Times",
    category: "Yoga & Meditation",
    readTime: "6 min read",
    date: "Nov 5, 2025",
    author: {
      name: "Wellness Team",
      role: "Senior Wellness Experts",
      avatar: "/images/i1.png",
    },
    image: "/images/blog-1.jpg",
    shortIntro:
      "In a world full of distractions, finding calm is essential for wellbeing.",
    content: `
      Yoga and meditation create balance...
      (full content here)
    `,
    likes: 247,
    commentsCount: 3,
    tags: [
      "yoga",
      "meditation",
      "mindfulness",
      "wellness",
      "breathing",
      "self-care",
    ],
  },
];

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogSingle({ params }: PageProps) {
  const hashTagDetail = [
    "#yoga",
    " #meditation",
    "#mindfulness",
    "#wellness",
    "#breathing",
    "#self-care",
  ];
  // const { slug } = await params;

  // const blog = blogs.find((item:any) => item.slug === slug);

  // if (!blog) {
  //   return <div className="p-10 text-red-500 text-xl">Blog not found</div>;
  // }

  return (
    <>
      <div className="max-w-[1268px] w-full mx-auto">
        <div className="pt-[49px] pb-[71px]">
          <Header isHero />
        </div>
        <div className="flex items-center gap-8 text-sm text-gray-500 mb-4">
          <span className="px-4 py-1 bg-[linear-gradient(180deg,#B95E82_0%,#D97BA3_100%)]  text-[#ffffff] rounded-full font-satoshi-400 font-medium text-lg">
            Yoga & Meditation
          </span>

          <span className="flex items-center gap-2">
            <Image
              src="/images/time.png"
              alt="time"
              className="w-4 h-4"
              width={16}
              height={16}
            />
            <span className="font-satoshi-400 font-medium text-lg text-[#717182] ">
              6 min read
            </span>
          </span>

          <span className="flex items-center gap-2">
            <Image
              src="/images/calender.png"
              alt="calender"
              className="w-4 h-4"
              width={16}
              height={16}
            />
            <span className="font-satoshi-400 font-medium text-lg text-[#717182] ">
              Nov 5, 2025
            </span>
          </span>
        </div>

        <h1 className="font-satoshi-700 font-medium text-[50px] text-[#494949] leading-[1.1] mb-4">
          Finding Calm in Busy Times
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <Image
            src="/images/i1.png"
            alt="i1"
            height={48}
            width={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-[#494949] font-medium font-satoshi-700">
              By Wellness Team
            </p>
            <p className="text-sm text-[#717182] font-satoshi-400">
              Senior Wellness Experts
            </p>
          </div>
          <div className="ml-auto flex items-center gap-6 text-gray-500">
            <span className="flex items-center gap-1">
              {" "}
              <img src="/images/like.png" /> 247
            </span>
            <span className="flex items-center gap-1">
              {" "}
              <img src="/images/comment.png" /> 3
            </span>
          </div>
        </div>

        <img
          src="/images/blog-1.jpg"
          className="w-full rounded-2xl shadow mb-10"
        />

        <div className="mb-10 text-[#494949] text-2xl font-satoshi-500 p-6 bg-[linear-gradient(180deg,#FFE8E8_0%,#FFF7DD_100%)] border border-[#F0CCC4] rounded-[23.48px]">
          In a world full of distractions, finding calm is essential for
          wellbeing.
        </div>

        <div className="prose prose-lg max-w-none  mb-10 text-[#494949] font-satoshi-400 text-xl">
          <p className="mb-5">
            Yoga and meditation create balance. Breathing promotes relaxation.
            In busy times, a few mindful moments restore clarity and peace.
          </p>

          <p className="mb-5">
            {`Even a short session of deep breathing can anchor us in the present
            and reduce stress. The practice doesn't require hours of your
            day—just a few intentional minutes can transform your mental state
            and overall wellbeing.`}
          </p>

          <p className="mb-5">
            {` When we cultivate mindfulness in our daily routines, we build
            resilience against the challenges that life presents. This isn't
            about escaping reality; it's about developing the tools to navigate
            it with grace and composure.`}
          </p>
        </div>
        <div className="rounded-[26px] overflow-hidden border border-[#F0CCC4] shadow-[0_4px_30px_rgba(0,0,0,0.08)] mb-17.5">
          <div className="bg-[linear-gradient(180deg,#C5658F_0%,#DA88AD_100%)] py-6 px-8">
            <h2 className="text-white text-2xl font-satoshi-500">
              {` Essential Tips for Daily Practice`}
            </h2>
          </div>

          <div className="bg-white p-2.5 md:p-9 pt-5 md:pt-17.5 space-y-2.5 md:space-y-4 lg:space-y-6">
            <div className="flex items-start gap-4 bg-[#FBF3EC] p-5 rounded-2xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#C5658F] text-white font-semibold text-lg">
                1
              </div>
              <div>
                <p className="text-[#494949] font-satoshi-500 text-[22px]">
                  Practice a few minutes daily
                </p>
                <p className="text-[#717182] text-[20px] mt-1 leading-relaxed font-satoshi-500">
                  Consistency matters more than duration. Even 3–5 minutes each
                  day builds a sustainable habit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#FBF3EC] p-5 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#C5658F] text-white font-semibold text-lg">
                2
              </div>
              <div>
                <p className="text-[#494949] font-satoshi-500 text-[22px]">
                  Find a quiet corner
                </p>
                <p className="text-[#717182] text-[20px] mt-1 leading-relaxed font-satoshi-500">
                  {`Create a dedicated space that signals to your mind it's time
                  to pause and breathe.`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#FBF3EC] p-5 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#C5658F] text-white font-semibold text-lg">
                3
              </div>
              <div>
                <p className="text-[#494949] font-satoshi-500 text-[22px]">
                  Focus on slow, deep breaths
                </p>
                <p className="text-[#717182] text-[20px] mt-1 leading-relaxed font-satoshi-500">
                  Inhale for 4 counts, hold for 4, exhale for 6. This activates
                  your parasympathetic nervous system.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#FBF3EC] p-5 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#C5658F] text-white font-semibold text-lg">
                4
              </div>
              <div>
                <p className="text-[#494949] font-satoshi-500 text-[22px]">
                  End with gratitude
                </p>
                <p className="text-[#717182] text-[20px] mt-1 leading-relaxed font-satoshi-500">
                  {`Conclude each session by acknowledging three things you're
                  grateful for today.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-pink-50 to-yellow-50 border-l-4 border-[#B95E82] px-9 py-6 md:p-11.5 rounded-xl italic mb-12 text-[25px] md:text-[44px] text-[#494949] font-satoshi-700 font-bold">
          {`“Calm is not a place — it's a practice.”`}
          <div className="mt-2 text-base md:text-[23px] not-italic text-[#717182] font-normal font-montserrat">
            — Wellness Team
          </div>
        </div>
        <div className="flex flex-col gap-8 mb-[60px]">
          <Typography
            title="Remember, the journey to inner peace is personal and unique. What works for one person may not work for another, and that's perfectly okay. Experiment with different techniques, times of day, and durations until you find your rhythm."
            type="regular"
            cssClass="!text-[24px]"
          />
          <Typography
            title="The most important step is simply beginning. Your future self will thank you for the investment you make in your mental and emotional wellbeing today."
            type="regular"
            cssClass="!text-[24px]"
          />
        </div>
        <div className="flex gap-3 flex-wrap mb-10 border-t border-[#4949491A] pt-9">
          {hashTagDetail?.map((hastag, i) => (
            <Badge variant={"themeOutline"} key={i}>
              {hastag}
            </Badge>
          ))}
        </div>

        <div className="p-8 bg-white border border-[#F0CCC4] rounded-2xl shadow-sm mb-12 font-satoshi-500">
          <div className="flex items-center gap-3 justify-between">
            <p className="text-[20px] md:text-[30px] text-[#494949] font-medium mb-4">
              Share this article
            </p>
            <div className="flex items-center gap-4 text-gray-500 text-xl">
              <a
                href="#"
                className="flex items-center justify-center border border-[#F0CCC4] bg-[#FEF9F5] rounded-xl size-12.5"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="flex items-center justify-center border border-[#F0CCC4] bg-[#FEF9F5] rounded-xl size-12.5"
              >
                <Twitter />
              </a>
              <a
                href="#"
                className="flex items-center justify-center border border-[#F0CCC4] bg-[#FEF9F5] rounded-xl size-12.5"
              >
                <LinkedIn />
              </a>
              <a
                href="#"
                className="flex items-center justify-center border border-[#F0CCC4] bg-[#FEF9F5] rounded-xl size-12.5"
              >
                <Copy />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-[linear-gradient(180deg,#FBEFD8_0%,#FFE8E8_100%)] border border-[#F0CCC4] rounded-2xl shadow-sm p-6 flex gap-5 text-[#494949]  font-satoshi-500">
          <Image
            src="/images/i1.png"
            alt="i1"
            height={64}
            width={64}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">About the Wellness Team</p>
            <p className="text-xl font-satoshi-400 leading-relaxed mt-2">
              Our team of certified yoga instructors, meditation guides, and
              wellness experts is dedicated to helping you find balance and
              peace in your daily life.
            </p>

            <Button variant={"outline2"} className="mt-6">
              View All Articles
            </Button>
          </div>
        </div>
        <div className="bg-linear-to-b from-[#B95E82] to-[#D97BA3] rounded-3xl py-[46px] gap-5 flex flex-col items-center mt-14">
          <Typography
            title="Get More Wellness Tips"
            cssClass="text-[44px]! text-[#FFFFFF]!"
          />
          <Typography
            title="Subscribe to our newsletter for weekly insights, guided meditations, and exclusive content delivered to your inbox."
            type="regular"
            cssClass="text-[24px] text-[#FFFFFF]! max-w-[930px] text-center!"
          />
          <div className="mt-3 flex flex-col md:flex-row items-center gap-4">
            <Input2 placeholder="Enter your email" className="min-w-[467px]" />
            <Button variant={"white"} className="rounded-[14px]">
              <Rocket />
              Subscribe
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-9 mt-14">
          <Typography
            title="Related Articles"
            type="theme"
            cssClass="text-[36px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
            {yogaDetails?.map((yoga) => (
              <div
                className={`rounded-2xl border border-[#F0CCC4] ${
                  yoga?.isMain ? "bg-[#FBEFD8]" : ""
                }`}
                key={yoga?.id}
              >
                <InnerBlogDetail
                  image={yoga?.image}
                  title={yoga?.title}
                  description={yoga?.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
