import Header from "@/components/layout/header";
import { InnerBlogDetail } from "@/components/pages/inner-blog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Rocket } from "@/icons/helpIcon";
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
        <div className="rounded-[26px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.08)] mb-14">
          <div className="bg-[linear-gradient(180deg,#C5658F_0%,#DA88AD_100%)] py-6 px-8">
            <h2 className="text-white text-2xl font-satoshi-500">
              {` Essential Tips for Daily Practice`}
            </h2>
          </div>

          <div className="bg-white px-8 py-6 space-y-4">
            <div className="flex items-start gap-4 bg-[#FBF3EC] p-5 rounded-xl">
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

        <div className="bg-linear-to-r from-pink-50 to-yellow-50 border-l-4 border-pink-400 py-6 px-6 rounded-xl italic text-gray-700 mb-12">
          {`“Calm is not a place — it's a practice.”`}
          <div className="mt-2 text-sm not-italic text-gray-500">
            — Wellness Team
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-10">
          {hashTagDetail?.map((hastag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
            >
              {hastag}
            </span>
          ))}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm mb-12">
          <p className="text-gray-700 font-medium mb-4">Share this article</p>
          <div className="flex gap-5 text-gray-500 text-xl">
            <a href="#">🔗</a>
            <a href="#">🐦</a>
            <a href="#">📘</a>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex gap-5">
          <Image
            src="/images/i1.png"
            alt="i1"
            height={64}
            width={64}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-gray-800 font-semibold">
              About the Wellness Team
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              Our team of certified yoga instructors, meditation guides, and
              wellness experts is dedicated to helping you find balance and
              peace in your daily life.
            </p>

            <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">
              View All Articles
            </button>
          </div>
        </div>
        <div className="bg-linear-to-b from-[#B95E82] to-[#D97BA3] rounded-3xl py-[46px] gap-5 flex flex-col items-center mt-14">
          <Typography
            title="Get More Wellness Tips"
            cssClass="text-[44px] text-[#FFFFFF]!"
          />
          <Typography
            title="Subscribe to our newsletter for weekly insights, guided meditations, and exclusive content delivered to your inbox."
            type="regular"
            cssClass="text-[24px] text-[#FFFFFF]! max-w-[930px] text-center!"
          />
          <div className="mt-3 flex items-center gap-4">
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
