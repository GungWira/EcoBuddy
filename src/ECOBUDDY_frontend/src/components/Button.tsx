import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  link: string;
  type?: "primary" | "secondary" | "image";
  onClick?: () => void;
}

export default function Button({
  children,
  link,
  type = "primary",
  onClick,
}: ButtonProps) {
  return (
    <Link
      to={link}
      className="relative overflow-visible flex justify-center items-center group"
      onClick={onClick}
    >
      <button
        typeof="button"
        className={`px-6 py-2 w-fit relative z-10 rounded-full font-poppins font-semibold text-xs sm:text-sm md:text-base flex justify-center items-center gap-2 ease-in-out transition-all duration-100 ${
          type == "primary"
            ? "text-darkMain bg-greenMain"
            : "text-white bg-[#202020]"
        }`}
      >
        {children}
      </button>
      <div
        className="absolute z-10 w-full h-full rounded-full bg-red opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500"
        style={{
          boxShadow: "0px 0px 40.5px 0px rgba(19, 242, 135, 0.45)",
        }}
      ></div>
    </Link>
  );
}
