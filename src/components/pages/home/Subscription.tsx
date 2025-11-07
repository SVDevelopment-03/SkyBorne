import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Subscription = () => {
  return (
    <div className="flex flex-col items-center gap-12 py-[53px] px-10 text-[#494949] bg-white">
      <div className="flex flex-col items-center justify-center text-center gap-6 font-satoshi-500">
        <h2 className="text-5xl">Find Your Wellness Plan</h2>
        <p className="text-lg  text-[#1D1D1D]/80 max-w-[492px]">
          Ready to commit to your health? Skyborne offers flexible yoga,
          fitness, and nutrition plans for every lifestyle. Choose your fit
          below.
        </p>
      </div>
      <div className="flex items-center justify-center gap-14">
        <div className="bg-[linear-gradient(180.02deg,rgba(255,207,189,0.7)-51.68%,rgba(255,247,221,0.7)99.98%)] min-h-[500px] lg:w-[387px] shadow-[0px_4.44px_8.88px_0px_#0000001A,0px_4.44px_8.88px_0px_#0000001A] rounded-[30px] text-[#494949]">
          <div className="flex flex-col gap-16 px-9 pt-16 pb-12 font-montserrat">
            <div className="flex flex-col gap-7">
              <Image
                src={"/images/subscribe.svg"}
                alt="subscribe"
                height={40}
                width={40}
              />

              <div className="space-y-3">
                <h5 className="text-5xl font-medium">Pro</h5>
                <ul className="space-y-3 text-xs [&_li]:flex [&_li]:items-center [&_li]:gap-2">
                  <li>
                    <Image
                      src={"/images/tick-icon.svg"}
                      alt="Tick"
                      height={9}
                      width={12}
                    />
                    Unlimited group sessions/month
                  </li>

                  <li>
                    <Image
                      src={"/images/tick-icon.svg"}
                      alt="Tick"
                      height={9}
                      width={12}
                    />
                    All Basic benefits
                  </li>

                  <li>
                    <Image
                      src={"/images/tick-icon.svg"}
                      alt="Tick"
                      height={9}
                      width={12}
                    />
                    Priority booking
                  </li>

                  <li>
                    <Image
                      src={"/images/tick-icon.svg"}
                      alt="Tick"
                      height={9}
                      width={12}
                    />
                    Early access to new programs
                  </li>

                  <li>
                    <Image
                      src={"/images/tick-icon.svg"}
                      alt="Tick"
                      height={9}
                      width={12}
                    />
                    Dedicated instructor Q&A
                  </li>

                  <li>
                    <Image
                      src={"/images/tick-icon.svg"}
                      alt="Tick"
                      height={9}
                      width={12}
                    />
                    Wellness milestone rewards
                  </li>
                </ul>
              </div>
            </div>
            <Button
              variant={"filled"}
              className="text-base lg:w-[257px] mx-auto"
            >
              Unlock This Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
