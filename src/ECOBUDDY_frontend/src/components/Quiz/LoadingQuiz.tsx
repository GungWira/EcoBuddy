import React, { useEffect, useState } from "react";
import { useTheme } from "../../hooks/ThemeProvider";

export default function LoadingQuiz() {
  const { loading } = useTheme();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (loading) {
      if (progress < 100) {
        if (progress == 50) {
          setTimeout(() => {
            setProgress(progress + 1);
          }, 2500);
        } else if (progress == 70) {
          setTimeout(() => {
            setProgress(progress + 1);
          }, 1500);
        } else if (progress >= 95) {
          setTimeout(() => {
            setProgress(progress + 0.05);
          }, 1000);
        } else {
          setTimeout(() => {
            setProgress(progress + 1);
          }, 100);
        }
      }
    } else {
      setProgress(100);
    }
  }, [progress]);
  return (
    <div
      className={`w-screen h-screen absolute flex flex-col justify-center items-center transition-all ease-in-out duration-500 gap-4 ${
        !loading && "opacity-0 -translate-y-2"
      }`}
    >
      <div className="flex flex-col justify-center items-center max-w-6xl px-8 gap-5">
        <h1 className="font-poppins text-white text-center font-bold text-xl sm:text-xl md:text-2xl lg:text-3xl mb-4">
          Creating Your Eco-Quiz..
        </h1>
        <div className="flex justify-start items-center w-full bg-[#707070] h-2 rounded-full">
          <div
            className="h-2 bg-greenMain rounded-full transition-all ease-in-out duration-150"
            style={{ width: progress + "%" }}
          ></div>
        </div>
        <p className="text-whiteSoft font-poppins text-sm sm:text-sm md:text-base text-center mb-2">
          Almost ready! We're generating the perfect questions for you.
        </p>
      </div>
      {/* NOTIF */}
      <div className="w-fit bottom-16 absolute px-6 py-2 rounded-full bg-[#6D7134] border border-[#E0EA53] text-center font-poppins text-white font-medium text-base">
        Note: Do not refresh the page to avoid interrupting the quiz creation
        process.
      </div>
    </div>
  );
}
