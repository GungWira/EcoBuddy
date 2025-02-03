import React from "react";
import { Link } from "react-router-dom";

interface MenuProps {
  onClick: () => void;
}

export default function Menu({ onClick }: MenuProps) {
  return (
    <div className="flex justify-center items-center relative w-fit group z-0">
      <div className="aspect-square rounded-full w-10 md:w-12 flex justify-center items-center bg-darkSoft p-3">
        <img
          src="/chat/menu.svg"
          alt="Lighting Icon"
          className="max-w-none max-h-none m-0 w-full"
        />
        <div className="flex flex-row justify-start items-start gap-6 px-6 py-2 bg-darkSoft absolute -bottom-16 translate-y-2 right-0 rounded-xl opacity-0 group-hover:opacity-100">
          <Link
            to={"/quiz"}
            className="flex flex-col justify-center items-center gap-1"
          >
            <div className="w-8 aspect-square overflow-hidden">
              <img
                src="/chat/quiz.svg"
                alt="Lighting Icon"
                className="max-w-none max-h-none m-0 w-full"
              />
            </div>
            <p className="font-poppins text-white text-sm">Quiz</p>
          </Link>
          <button
            onClick={onClick}
            className="flex flex-col justify-center items-center gap-1"
          >
            <div className="w-8 aspect-square overflow-hidden">
              <img
                src="/chat/quest.svg"
                alt="Lighting Icon"
                className="max-w-none max-h-none m-0 w-full"
              />
            </div>
            <p className="font-poppins text-white text-sm">Quest</p>
          </button>
          <Link
            to={"/garden"}
            className="flex flex-col justify-center items-center gap-1"
          >
            <div className="w-8 aspect-square overflow-hidden">
              <img
                src="/chat/donate.png"
                alt="Donate Icon"
                className="max-w-none max-h-none m-0 w-full"
              />
            </div>
            <p className="font-poppins text-white text-sm">Garden</p>
          </Link>
          <Link
            to={"/news"}
            className="flex flex-col justify-center items-center gap-1"
          >
            <div className="w-8 aspect-square overflow-hidden">
              <img
                src="/chat/news.png"
                alt="Lighting Icon"
                className="max-w-none max-h-none m-0 w-full"
              />
            </div>
            <p className="font-poppins text-white text-sm">News</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
