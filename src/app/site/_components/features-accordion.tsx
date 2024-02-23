"use client";

import type { JSX } from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  type?: "video" | "image";
  path?: string;
  format?: string;
  alt?: string;
  svg?: JSX.Element;
}

// The features array is a list of features that will be displayed in the accordion.
// - title: The title of the feature
// - description: The description of the feature (when clicked)
// - type: The type of media (video or image)
// - path: The path to the media (for better SEO, try to use a local path)
// - format: The format of the media (if type is 'video')
// - alt: The alt text of the image (if type is 'image')
const features = [
  {
    title: "Advanced CRM Capabilities",
    description:
      "At the heart of GoHighLevel is a robust CRM designed to keep you at the top of your game. Track every interaction, from first click to final sale, and gain deep insights into your customer journey. Customize pipelines, manage contacts, and nurture leads with tools that drive conversions.",
    type: "image",
    path: "https://res.cloudinary.com/diikrvcu5/image/upload/v1708666219/asd_wavoh4.png",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
        />
      </svg>
    ),
  },
  {
    title: "Dynamic Sales Funnels & Landing Pages",
    description:
      "Create high-converting sales funnels and landing pages in minutes, not hours. Our drag-and-drop builders and library of templates make it easy to design beautiful, effective pages that match your brand. Optimize for conversion with A/B testing and real-time analytics.",
    type: "image",
    path: "https://res.cloudinary.com/diikrvcu5/image/upload/v1708667012/new_l2sexd.png",
    alt: "A computer",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
  },
  {
    title: "Comprehensive Reporting & Analytics",
    description:
      "Make data-driven decisions with our advanced reporting tools. Monitor your marketing performance, track sales conversions, and understand customer behaviors. Customizable reports and dashboards give you the insights you need to optimize your strategies and grow your business.",
    type: "image",
    path: "https://res.cloudinary.com/diikrvcu5/image/upload/v1708667100/analasdaldad_nsim1z.png",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "Unified Marketing Automation",
    description:
      "Ditch the clutter of disjointed tools and embrace a seamless experience with our all-in-one platform. Automate your email campaigns, social media posts, and SMS messages with precision and ease. Schedule and send communications based on customer behavior, ensuring your message always lands at the perfect moment.",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        />
      </svg>
    ),
  },
  {
    title: "Integrated Scheduling & Booking",
    description:
      "Simplify appointment booking and reduce no-shows with our integrated scheduling tool. Allow clients to book their own appointments through your website, and send automated reminders via email or SMS. Sync calendars to keep your team on track and maximize efficiency.",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        />
      </svg>
    ),
  },
] as Feature[];

// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({
  feature,
  isOpen,
  setFeatureSelected,
}: {
  index: number;
  feature: Feature;
  isOpen: boolean;
  setFeatureSelected: () => void;
}) => {
  const accordion = useRef(null);
  const { title, description, svg } = feature;

  return (
    <li
      className={cn(
        "border-2 rounded-xl py-1 px-4",
        isOpen ? "border-primary" : "border-gray-300"
      )}
    >
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span className={`duration-100 ${isOpen ? "text-primary" : ""}`}>
          {svg}
        </span>
        <span
          className={`flex-1 text-base-content ${
            isOpen ? "text-primary font-semibold" : ""
          }`}
        >
          <h3 className="inline">{title}</h3>
        </span>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden`}
        style={
          isOpen
            ? // @ts-ignore
              { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div
          className={cn(
            "pb-5 leading-relaxed text-sm md:text-base",
            isOpen && "text-orange-400"
          )}
        >
          {description}
        </div>
      </div>
    </li>
  );
};

// A component to display the media (video or image) of the feature. If the type is not specified, it will display an empty div.
// Video are set to autoplay for best UX.
const Media = ({ feature }: { feature: Feature }) => {
  const { type, path, format, alt } = feature;
  const style = "rounded-2xl aspect-square w-full sm:w-[29rem]";
  const size = {
    width: 600,
    height: 600,
  };

  if (type === "video") {
    return (
      <video
        className={style}
        autoPlay
        muted
        loop
        playsInline
        controls
        width={size.width}
        height={size.height}
      >
        <source src={path} type={format} />
      </video>
    );
  } else if (type === "image") {
    return (
      <Image
        // @ts-ignore
        src={path}
        // @ts-ignore
        alt={alt}
        className={`${style} object-cover object-center`}
        width={size.width}
        height={size.height}
      />
    );
  } else {
    return <div className={`${style} !border-none`}></div>;
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState<number>(0);

  return (
    <section id="features" className="grainy bg-slate-100 relative">
      <MaxWidthWrapper className="py-24 md:py-32 space-y-24 md:space-y-32">
        <div className="px-8">
          <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24">
            Panorama has everything you
            {/* <span className="bg-primary text-white px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap relative"> */}
            <span className="px-2 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap relative">
              need to succeed
              <svg
                // className="absolute -bottom-1 right-0 w-32 sm:-bottom-1 sm:w-[168px]"
                className="absolute -bottom-4 right-[20px] lg:inset-x-0 w-[290px] lg:w-[500px] sm:-bottom-4 lg:-bottom-6"
                viewBox="0 0 432.5 28.14"
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="Unbenannter_Verlauf"
                    x1="-27.23"
                    y1="419.23"
                    x2="-26.23"
                    y2="419.23"
                    gradientTransform="matrix(415.04, 0, 0, -10.68, 11312.81, 4492.83)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset={0} stopColor="#FBA834"></stop>
                    <stop offset={1} stopColor="#FB8B24"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M12.74,22.37c62.64-3.26,49.59-7.18,187.94-9.79s151.4,1.3,227.1,2"
                  transform="translate(-4 -2.96)"
                  fill="none"
                  strokeLinecap="round"
                  strokeMiterlimit="8px"
                  strokeWidth="10px"
                  strokeDasharray="0,0"
                  stroke="url(#Unbenannter_Verlauf)"
                ></path>
              </svg>
            </span>
          </h2>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-10">
              <ul className="w-full space-y-4">
                {features.map((feature, i) => (
                  <Item
                    key={feature.title}
                    index={i}
                    feature={feature}
                    isOpen={featureSelected === i}
                    setFeatureSelected={() => setFeatureSelected(i)}
                  />
                ))}
              </ul>

              <div className="w-full h-full flex items-center justify-center">
                <Media
                  feature={features[featureSelected]}
                  key={featureSelected}
                />
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 rotate-180 -top-40 z-50 transform-gpu overflow-hidden blur-3xl sm:-top-20"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FC6736] to-[#FC6736] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </section>
  );
};

export default FeaturesAccordion;
