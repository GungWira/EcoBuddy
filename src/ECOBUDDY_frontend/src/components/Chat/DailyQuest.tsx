import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface DailyQuestType {
  date: string;
  login: boolean;
  chatCount: number;
  quizCount: number;
}

interface DailyQuestProps {
  dailyQuest: DailyQuestType | null;
  hidden: boolean;
  onClick: () => void;
}

export default function DailyQuest({
  hidden,
  onClick,
  dailyQuest,
}: DailyQuestProps) {
  const element = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (start) {
      if (hidden) {
        gsap.fromTo(
          element.current,
          {
            translateY: 0,
          },
          {
            translateY: "-100%",
            duration: 1,
            ease: "back.in(.8)",
          }
        );
      } else {
        gsap.fromTo(
          element.current,
          {
            translateY: "-100%",
          },
          {
            translateY: "0%",
            duration: 0.7,
            ease: "back.out(1)",
          }
        );
      }
    }
  }, [hidden]);

  useEffect(() => {
    gsap.fromTo(
      element.current,
      {
        translateY: "0%",
      },
      {
        translateY: "-100%",
        duration: 0,
      }
    );
    setTimeout(() => setStart(true), 500);
  }, []);
  return (
    <div
      className={`w-screen h-screen fixed top-0 left-0 bg-transparent z-50 flex justify-center items-center px-4 sm:px-8`}
      ref={element}
    >
      <div className="flex flex-col justify-center items-center gap-5 rounded-2xl bg-darkSoft p-5 sm:p-6 md:p-8 w-full max-w-3xl">
        {/* HEADER */}
        <div className="flex flex-row justify-between items-center w-full gap-8">
          <p className="font-poppins text-base sm:text-lg text-white font-semibold">
            Daily Quest
          </p>
          <button onClick={onClick}>
            <img
              src="/chat/close.svg"
              alt="Close Icon"
              className="max-w-none max-h-none m-0 w-6 "
            />
          </button>
        </div>
        {/* QUEST */}
        <div className="flex flex-col justify-start items-start gap-3 w-full">
          {/* ITEM QUEST LOGIN */}
          <div className="flex flex-row justify-between items-center gap-4 px-4 py-4 border border-[#303030] rounded-xl w-full">
            <div className="w-6 sm:w-8 aspect-square overflow-hidden">
              {dailyQuest && dailyQuest.login ? (
                <img
                  src="/chat/complete.svg"
                  alt="Lighting Icon"
                  className="max-w-none max-h-none m-0 w-full"
                />
              ) : (
                <img
                  src="/chat/lighting.svg"
                  alt="Lighting Icon"
                  className="max-w-none max-h-none m-0 w-full"
                />
              )}
            </div>
            <div className="flex flex-col justify-start items-start w-full gap-1 sm:gap-0">
              <p className="text-sm sm:text-sm md:text-base text-white font-semibold font-poppins">
                Login to EcoBuddy{" "}
                <span className="text-greenMain">(+20 EXP)</span>
              </p>
              <div className="flex flex-row w-full justify-start items-center gap-3">
                <div className="flex flex-row justify-start items-center w-full relative">
                  <div className="flex justify-start items-center w-full bg-[#303030] rounded-full h-1"></div>
                  <div
                    className="flex justify-start items-center w-full bg-greenMain rounded-full h-1 absolute"
                    style={{
                      width: dailyQuest && dailyQuest.login ? "100%" : "0%",
                    }}
                  ></div>
                </div>
                <p className="text-xs sm:text-xs md:text-sm text-white font-medium font-poppins m-0 p-0">
                  {dailyQuest && dailyQuest.login ? "1" : "0"}/1
                </p>
              </div>
            </div>
          </div>
          {/* ITEM QUEST CHATCOUNT */}
          <div className="flex flex-row justify-between items-center gap-4 px-4 py-4 border border-[#303030] rounded-xl w-full">
            <div className="w-6 sm:w-8 aspect-square overflow-hidden">
              {dailyQuest && dailyQuest.chatCount >= 10 ? (
                <img
                  src="/chat/complete.svg"
                  alt="Lighting Icon"
                  className="max-w-none max-h-none m-0 w-full"
                />
              ) : (
                <img
                  src="/chat/lighting.svg"
                  alt="Lighting Icon"
                  className="max-w-none max-h-none m-0 w-full"
                />
              )}
            </div>
            <div className="flex flex-col justify-start items-start w-full gap-1 sm:gap-0">
              <p className="text-sm sm:text-sm md:text-base text-white font-semibold font-poppins">
                Chat with your EcoBuddy 10 times{" "}
                <span className="text-greenMain">(+20 EXP)</span>
              </p>
              <div className="flex flex-row w-full justify-start items-center gap-3">
                <div className="flex flex-row justify-start items-center w-full relative">
                  <div className="flex justify-start items-center w-full bg-[#303030] rounded-full h-1"></div>
                  <div
                    className="flex justify-start items-center w-full bg-greenMain rounded-full h-1 absolute"
                    style={{
                      width:
                        dailyQuest && dailyQuest.chatCount <= 9
                          ? dailyQuest.chatCount * 10 + "%"
                          : "100%",
                    }}
                  ></div>
                </div>
                <p className="text-xs sm:text-xs md:text-sm text-white font-medium font-poppins m-0 p-0">
                  {dailyQuest && dailyQuest.chatCount <= 9
                    ? dailyQuest.chatCount
                    : "10"}
                  /10
                </p>
              </div>
            </div>
          </div>
          {/* ITEM QUEST QUIZCOUNT*/}
          <div className="flex flex-row justify-between items-center gap-4 px-4 py-4 border border-[#303030] rounded-xl w-full">
            <div className="w-6 sm:w-8 aspect-square overflow-hidden">
              {dailyQuest && dailyQuest.quizCount >= 10 ? (
                <img
                  src="/chat/complete.svg"
                  alt="Lighting Icon"
                  className="max-w-none max-h-none m-0 w-full"
                />
              ) : (
                <img
                  src="/chat/lighting.svg"
                  alt="Lighting Icon"
                  className="max-w-none max-h-none m-0 w-full"
                />
              )}
            </div>
            <div className="flex flex-col justify-start items-start w-full gap-1 sm:gap-0">
              <p className="text-sm sm:text-sm md:text-base text-white font-semibold font-poppins">
                Complete EcoQuiz 3 times{" "}
                <span className="text-greenMain">(+20 EXP)</span>
              </p>
              <div className="flex flex-row w-full justify-start items-center gap-3">
                <div className="flex flex-row justify-start items-center w-full relative">
                  <div className="flex justify-start items-center w-full bg-[#303030] rounded-full h-1"></div>
                  <div
                    className="flex justify-start items-center w-full bg-greenMain rounded-full h-1 absolute"
                    style={{
                      width:
                        dailyQuest && dailyQuest.quizCount <= 2
                          ? dailyQuest.quizCount * 33.3 + "%"
                          : "100%",
                    }}
                  ></div>
                </div>
                <p className="text-xs sm:text-xs md:text-sm text-white font-medium font-poppins m-0 p-0">
                  {dailyQuest && dailyQuest.quizCount <= 2
                    ? dailyQuest.quizCount
                    : "3"}
                  /3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
