import React from "react";

interface ComandProps {
  children: React.ReactNode;
}

export default function Comand({ children }: ComandProps) {
  return (
    <div className="w-full flex justify-end items-start">
      <div className="w-fit px-4 py-3 bg-greenMain font-poppins max-w-[80%] text-darkMain text-sm sm:text-sm md:text-base rounded-2xl rounded-tr-sm">
        {children}
      </div>
    </div>
  );
}
