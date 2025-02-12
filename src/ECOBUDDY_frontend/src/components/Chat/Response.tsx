import { useState, useEffect } from "react";

interface ResponseProps {
  children: string;
  onFinish: () => void;
}

export default function Response({
  children = "...",
  onFinish,
}: ResponseProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + children[index]);
      index++;
      if (index === children.length - 1) {
        clearInterval(interval);
        onFinish();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [children]);

  return (
    <div className="flex justify-start items-start gap-4 w-full">
      <img
        src={`/chat/bot-lv-1.svg`}
        alt="Bot"
        className="max-w-none max-h-none m-0 w-9 hidden sm:flex"
      />
      <div className="w-full flex justify-start items-start">
        <div className="w-fit px-4 py-3 bg-darkSoft font-poppins max-w-[80%] text-white text-sm sm:text-sm md:text-base rounded-2xl rounded-tl-sm whitespace-pre-wrap">
          {displayedText}
        </div>
      </div>
    </div>
  );
}
