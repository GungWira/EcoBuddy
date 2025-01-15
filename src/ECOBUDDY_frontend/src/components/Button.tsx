import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  link: string;
  type?: "primary" | "secondary" | "image";
}

export default function Button({
  children,
  link,
  type = "primary",
}: ButtonProps) {
  return (
    <Link to={link}>
      <button
        typeof="button"
        className={`px-6 py-2 w-fit rounded-full font-poppins font-semibold text-xs sm:text-sm md:text-base flex justify-center items-center gap-2 ${
          type == "primary"
            ? "text-darkMain bg-greenMain"
            : "text-white bg-[#202020]"
        }`}
      >
        {children}
      </button>
    </Link>
  );
}
