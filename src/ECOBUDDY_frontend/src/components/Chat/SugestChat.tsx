import React from "react";

interface SugestChatProps {
  children: React.ReactNode;
  imageUrl: string;
  onClick?: () => void;
}

export default function SugestChat({
  children,
  imageUrl,
  onClick,
}: SugestChatProps) {
  return (
    <button
      typeof="button"
      onClick={onClick}
      className="flex flex-col justify-start items-start gap-6 px-4 py-3 rounded-xl bg-darkSoft flex-1 min-w-56 mb-4 sm:mb-0 sm:min-w-0"
    >
      <img src={imageUrl} alt="Icon" className="max-w-none max-h-none m-0" />
      <p className="font-poppins text-white opacity-70 text-sm sm:text-sm md:text-base text-left">
        {children}
      </p>
    </button>
  );
}
