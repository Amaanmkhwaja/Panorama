import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TestimonialsAvatars } from "./testimonials-avatars";
import { Logos } from "./logos";

export const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 2xl:px-0 lg:py-28">
        <div className="mx-auto max-w-3xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Ultimate All-in-One CRM Solution
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Panorama is the only platform you need to get:
          </p>
          <ul className="ml-2 mt-2 py-2 text-lg font-semibold leading-8 text-gray-900">
            <li>
              <Check className="w-4 h-4 mr-2 inline text-primary" />
              Capture New Leads
            </li>
            <li>
              <Check className="w-4 h-4 mr-2 inline text-primary" />
              Nurture Leads Into Customers
            </li>
            <li>
              <Check className="w-4 h-4 mr-2 inline text-primary" />
              Email Marketing & Booking Automations
            </li>
            <li>
              <Check className="w-4 h-4 mr-2 inline text-primary" />
              Full Website & Funnel builder
            </li>
            <li>
              <Check className="w-4 h-4 mr-2 inline text-primary" />
              and much more to grow your business!
            </li>
          </ul>
          {/* <p className="mt-2 text-lg leading-8 text-gray-600">
            All in a lightweight & privacy-friendly package. No cookie banners
            needed on your page.
          </p> */}
          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row">
            <Link href="/">
              <Button className="rounded-full" size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/">
              <Button className="rounded-full" size="lg" variant="link">
                See Documentation
              </Button>
            </Link>
          </div>
          <TestimonialsAvatars />
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="relative">
                <Image
                  // src="/assets/preview.png"
                  src="https://res.cloudinary.com/diikrvcu5/image/upload/v1708666219/asd_wavoh4.png"
                  alt="hero image"
                  width={1432}
                  height={1167}
                  className="w-[37rem] object-cover object-left rounded-md shadow-2xl ring-1 ring-gray/10 sm:w-[60rem] h-[420px] sm:h-[780px]"
                  quality={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Logos />

      {/* background grids */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:8rem_6rem]" />
    </section>
  );
};
