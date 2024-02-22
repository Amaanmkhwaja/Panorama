const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative flex min-h-screen w-screen items-center justify-start overflow-y-auto rounded-3xl bg-content1 p-2 sm:p-4 lg:p-8 2xl:pl-20"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/diikrvcu5/image/upload/v1708639291/deep-dusk-012_ttctef.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
