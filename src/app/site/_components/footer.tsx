import { Instagram } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer id="footer" className="bg-white border-t border-gray-200">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <span className="inline-flex justify-center w-full gap-3 lg:ml-auto md:justify-start md:w-auto">
            <a className="w-6 h-6 transition fill-black hover:text-orange-500 cursor-pointer">
              <span className="sr-only">github</span>
              <FaGithub className="w-5 h-5" />
            </a>
            <a className="w-6 h-6 transition fill-black hover:text-orange-500 cursor-pointer">
              <span className="sr-only">twitter</span>
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a className="w-6 h-6 transition fill-black hover:text-orange-500 cursor-pointer">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </a>
            <a className="w-6 h-6 transition fill-black hover:text-orange-500 cursor-pointer">
              <span className="sr-only">Linkedin</span>
              <FaLinkedin className="w-5 h-5" />
            </a>
          </span>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-base text-center text-gray-400">
            <span className="mx-auto mt-2 text-sm text-gray-500">
              © 2024 Panorama, All rigths reserved.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
