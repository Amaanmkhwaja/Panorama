import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";

const RegisterPage = () => {
  return (
    <>
      {/* brand logo */}
      <div className="absolute right-10 top-10">
        <div className="flex items-center space-x-3">
          <Image
            src="https://res.cloudinary.com/diikrvcu5/image/upload/v1708633357/icon_2_ydjlyt.png"
            alt="Logo"
            width={150}
            height={150}
            className="w-[50px] h-[50px]"
          />
          <p className="font-medium text-white">Panorama</p>
        </div>
      </div>

      {/* testimonial */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <p className="max-w-xl lg:max-w-2xl text-right text-white/60 lg:text-xl">
          <span className="font-medium">“</span>
          Switching to this platform was a game-changer for our agency. Our
          productivity has doubled, and managing campaigns has never been
          smoother. A true all-in-one marvel! 🚀🚀🚀
          <span className="font-medium">”</span>
        </p>
      </div>

      {/* sign-up form */}
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
