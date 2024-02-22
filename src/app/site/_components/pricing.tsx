import { Check } from "lucide-react";
import Link from "next/link";

export const Pricing = () => {
  return (
    <section id="pricing">
      <div className="relative items-center w-full px-4 py-24 mx-auto md:px-12 lg:px-16 max-w-7xl">
        <div className="grid items-start grid-cols-1 mx-auto lg:grid-cols-3 gap-5 lg:gap-0">
          <div className="lg:pr-12 order-1">
            <div className="flex flex-col p-8 lg:p-0">
              <h2 className="text-4xl font-extrabold text-black">
                Always know
                <span className="lg:block"> what you&apos;ll pay </span>
              </h2>
              <div className="max-w-lg mt-3">
                <p className="text-sm text-gray-500">
                  Choose a plan that works the best for you and your team. Start
                  small, upgrade when you need to.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col px-6 sm:px-8 lg:py-8 order-2 h-full">
            <h3 className="mt-5 text-lg text-gray-500">Unlimited</h3>
            <p className="mt-2 text-sm text-gray-500">
              The ultimate agency kit
            </p>
            <p className="order-first text-5xl font-light tracking-tight text-black">
              $150
              <span className="text-lg font-medium ml-1">/month</span>
            </p>
            <ul
              role="list"
              className="flex flex-col order-last mt-10 text-sm text-gray-500 gap-y-3"
            >
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4"> EVERYTHING IN THE STARTER PLAN </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4">
                  {" "}
                  API ACCESS - INTEGRATE WITH ANYTHING{" "}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4">
                  {" "}
                  UNLIMITED SUB-ACCOUNTS - AS MANY CLIENT ACCOUNTS AS YOU NEED
                  FOR ONE PRICE!{" "}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4"> AI CHAT BOTS READY TO SET UP </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4"> AI WEBSITE GENERATOR </span>
              </li>
            </ul>
            <Link
              className="items-center justify-center w-full px-6 py-2.5 mt-8 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
              aria-label="Unlimited"
              href="/agency"
            >
              Get Started
            </Link>
          </div>
          <div className="flex flex-col px-6 py-8 bg-black rounded-3xl sm:px-8 order-3 h-full">
            <h3 className="mt-5 text-lg text-white">Starter</h3>
            <p className="mt-2 text-sm text-gray-100">
              For serious agency owners
            </p>
            <p className="order-first text-5xl font-light tracking-tight text-white">
              $50
              <span className="text-lg font-medium ml-1">/month</span>
            </p>
            <ul
              role="list"
              className="flex flex-col order-last mt-10 text-sm text-white gap-y-3"
            >
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4">
                  {" "}
                  ALL THE TOOLS TO CAPTURE MORE LEADS{" "}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4">
                  {" "}
                  NURTURE & CLOSE LEADS INTO CUSTOMERS{" "}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4">
                  {" "}
                  FULL ONLINE BOOKING, PIPELINES, SOCIAL CAL, WEBSITE BUILDER,
                  AND MORE!{" "}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />{" "}
                <span className="ml-4">
                  {" "}
                  UNLIMITED CONTACTS & USERS, ADD AS MANY CONTACTS & USERS AS
                  YOU NEED!{" "}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="flex-none" />
                <span className="ml-4"> SETUP UP TO THREE SUB-ACCOUNTS </span>
              </li>
            </ul>
            <Link
              className="items-center justify-center w-full px-6 py-2.5 mt-8 text-center text-black duration-200 bg-white border-2 border-white rounded-full nline-flex hover:bg-transparent hover:border-white hover:text-white focus:outline-none focus-visible:outline-white text-sm focus-visible:ring-white"
              aria-label="Starter"
              href="/agency"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
