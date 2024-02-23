import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const Logos = () => {
  return (
    <MaxWidthWrapper className="pb-24">
      <div className="w-full flex items-center justify-center lg:justify-evenly flex-wrap lg:flex-nowrap gap-5 lg:gap-0">
        <Badge
          variant={"outline"}
          className="text-gray-500 px-3 py-1 text-sm border-gray-400"
        >
          CRM
        </Badge>
        <Badge
          variant={"outline"}
          className="text-gray-500 px-3 py-1 text-sm border-gray-400"
        >
          White Label
        </Badge>
        <Badge
          variant={"outline"}
          className="text-gray-500 px-3 py-1 text-sm border-gray-400"
        >
          Automations
        </Badge>
        <Badge
          variant={"outline"}
          className="text-gray-500 px-3 py-1 text-sm border-gray-400"
        >
          Pipelines
        </Badge>
        <Badge
          variant={"outline"}
          className="text-gray-500 px-3 py-1 text-sm border-gray-400"
        >
          Website Builder
        </Badge>
        <Badge
          variant={"outline"}
          className="text-gray-500 px-3 py-1 text-sm border-gray-400"
        >
          Content Management
        </Badge>
      </div>

      <div className="text-center mt-10 mb-2">
        <h1 className="text-lg font-medium leading-6">Loved by businesses</h1>
      </div>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-6 pt-6">
        <div className="flex justify-center col-span-1 px-8 w-full relative h-[30px] lg:h-[50px]">
          <Image
            fill
            className="object-contain"
            src="logoipsum1.svg"
            alt="logo"
          />
        </div>
        <div className="flex justify-center col-span-1 px-8 w-full relative h-[30px] lg:h-[50px]">
          <Image
            fill
            className="object-contain"
            src="logoipsum2.svg"
            alt="logo"
          />
        </div>
        <div className="flex justify-center col-span-1 px-8 w-full relative h-[30px] lg:h-[50px]">
          <Image
            fill
            className="object-contain"
            src="logoipsum3.svg"
            alt="logo"
          />
        </div>
        <div className="flex justify-center col-span-1 px-8 w-full relative h-[30px] lg:h-[50px]">
          <Image
            fill
            className="object-contain"
            src="logoipsum4.svg"
            alt="logo"
          />
        </div>
        <div className="flex justify-center col-span-1 px-8 w-full relative h-[30px] lg:h-[50px]">
          <Image
            fill
            className="object-contain"
            src="logoipsum5.svg"
            alt="logo"
          />
        </div>
        <div className="flex justify-center col-span-1 px-8 w-full relative h-[30px] lg:h-[50px]">
          <Image
            fill
            className="object-contain"
            src="logoipsum6.svg"
            alt="logo"
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
