import React from "react";

interface ShineProps {
  children: React.ReactNode;
}

export default function Shine({ children }: ShineProps) {
  return (
    <div
      className="font-poppins font-medium text-xs sm:text-sm md:text-base text-white px-6 py-1 rounded-full flex justify-center items-center w-fit"
      style={{
        background:
          "linear-gradient(90deg, #202020 0%, rgba(19, 242, 135, 0.30) 140%)",
        border: "1.5px solid rgba(15, 100, 65, 0.8)",
      }}
    >
      {children}
    </div>
  );
}
