import { useEffect, useState } from "react";

export default function LoadingDots() {
  const [dotPosition, setDotPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotPosition((prev) => (prev + 1) % 3);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getDots = () => {
    const dots = [".", "..", "..."];
    return dots[dotPosition];
  };
  return (
    <div className="flex justify-start items-start gap-4 w-full">
      <img
        src={`/chat/bot-lv-1.svg`}
        alt="Bot"
        className="max-w-none max-h-none m-0 w-9 hidden sm:flex"
      />
      <div className="w-full flex justify-start items-start">
        <div className="w-fit px-4 py-3 bg-darkSoft font-poppins max-w-[80%] text-white text-sm sm:text-sm md:text-base rounded-2xl rounded-tl-sm whitespace-pre-wrap">
          <div className="inline-flex relative justify-center items-center gap-2 space-x-1 text-3xl font-poppins">
            <div className="absolute animate-pulse mb-3">{getDots()}</div>
            <div className="relative opacity-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
