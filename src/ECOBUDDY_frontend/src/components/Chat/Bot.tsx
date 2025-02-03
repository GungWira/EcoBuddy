import { gsap } from "gsap";

import { Link } from "react-router-dom";
import Button from "../Button";
import Shine from "../Shine";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { useNotification } from "../../hooks/NotificationProvider";

interface BotProps {
  level: number;
  title: string;
  description: string;
  isIntro: boolean;
  prog?: number;
  hidden: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function Bot({
  level,
  title,
  description,
  isIntro,
  prog = 0,
  hidden,
  loading,
  onClick,
}: BotProps) {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const element = useRef(null);
  const [lastExp, setLastExp] = useState(-1);
  const [userLevel, setUserLevel] = useState(1);
  const [userPlot, setUserPlot] = useState(5);

  useEffect(() => {
    if (!loading) {
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
    } else {
      gsap.fromTo(
        element.current,
        {
          translateY: "0%",
        },
        {
          translateY: "-100%",
          duration: 0,
          ease: "back.out(0)",
        }
      );
    }
  }, [hidden, loading]);

  useEffect(() => {
    if (level || userLevel) {
      if (userLevel < 5) {
        setUserPlot(5);
      } else {
        setUserPlot((Math.floor(userLevel / 5) + 1) * 5);
      }
    }
  }, [level, userLevel]);

  useEffect(() => {
    if (prog && level) {
      if (userLevel == 1) {
        setUserLevel(level);
      }

      if (prog < lastExp) {
        setUserLevel(userLevel + 1);
      }
      lastExp != -1 && addNotification(true, undefined, prog - lastExp);
      setLastExp(prog);
    }
  }, [prog]);

  return (
    <div
      className={`w-screen h-screen fixed top-0 left-0 bg-transparent z-50 flex justify-center items-center `}
      ref={element}
    >
      <div className="flex flex-col justify-center items-center gap-12 sm:rounded-2xl bg-darkSoft h-screen sm:h-auto px-12 py-8">
        {isIntro ? (
          <div className="flex justify-between items-center gap-4 absolute top-8 w-full px-8 sm:hidden">
            <Link to={"/"}>
              <img src="/chat/logo.svg" alt="Logo EcoBuddy" className="w-28" />
            </Link>
            <Shine>ver 1.0</Shine>
          </div>
        ) : (
          <div className="flex flex-col justify-start items-start w-full gap-4 absolute top-8 sm:top-0 sm:relative px-6 sm:px-0">
            <div className="flex justify-between items-center gap-4 sm:gap-8 w-full">
              <div className="flex justify-start items-center gap-2 sm:gap-3">
                <img
                  src={`/chat/badge-lv-${Math.ceil(userLevel / userPlot)}.png`}
                  alt="Badge"
                  className="max-w-none max-h-none h-6 sm:h-7 m-0"
                />
                {userLevel + 1 <= 30 && (
                  <img
                    src={`/chat/speed.svg`}
                    alt="Badge"
                    className="max-w-none max-h-none h-2 sm:h-3 m-0"
                  />
                )}
                {userLevel + 1 <= 30 ? (
                  <img
                    src={`/chat/badge-lv-${
                      Math.ceil(userLevel / userPlot) + 1
                    }.png`}
                    alt="Badge"
                    className="max-w-none max-h-none h-6 sm:h-7 m-0"
                  />
                ) : (
                  <div className=""></div>
                )}
              </div>
              <div className="flex flex-row justify-end items-center gap-1">
                <p className="font-poppins text-sm sm:text-base text-whiteSoft">
                  Level
                </p>
                <p className="font-poppins text-sm sm:text-base text-white">
                  {userLevel}/{userPlot}
                </p>
              </div>
            </div>
            <div className="flex justify-start items-start w-full bg-whiteSoft h-1 rounded-full">
              <div
                className={`prog bg-greenMain rounded-full h-1`}
                style={{
                  width:
                    (prog / (100 * (userLevel + 1) * (userLevel + 1) - 100)) *
                      100 +
                    "%",
                }}
              ></div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-stretch gap-4">
          <div
            className={`sm:flex hidden justify-start items-start ${
              !isIntro && "w-24"
            }`}
          >
            {isIntro && (
              <img
                src="/chat/shine-l.svg"
                alt="Shine Icon"
                className="m-0 w-24"
              />
            )}
          </div>
          <div className="flex justify-center items-center relative">
            <img
              src="/chat/background-bot.svg"
              alt="Background EcoBuddy"
              className="w-64 md:w-80 max-w-none max-h-none z-10 relative"
            />
            <img
              src={user && user.avatar ? user.avatar : `/chat/bot-lv-${-1}.svg`}
              alt="Bot"
              className="w-48 md:w-52 max-w-none max-h-none z-20 absolute"
            />
            <div className="flex justify-center items-center px-4 py-1 border border-greenMain rounded-lg bg-darkMain font-poppins text-white text-sm md:text-base font-semibold absolute z-20 -bottom-3">
              Lv {userLevel}
            </div>
          </div>
          <div
            className={`sm:flex justify-start items-end hidden ${
              !isIntro && "w-24"
            }`}
          >
            {isIntro && (
              <img
                src="/chat/shine-r.svg"
                alt="Shine Icon"
                className="m-0 w-24"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-3 max-w-[520px]">
          <h1
            className="font-poppins text-white text-center font-bold text-2xl sm:text-2xl md:text-2xl lg:text-3xl"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h1>
          <p className="text-whiteSoft font-poppins text-sm sm:text-sm md:text-base text-center mb-2">
            {description}
          </p>
          {isIntro ? (
            <Button link="" type="primary" onClick={onClick}>
              Start Chatting Now!
            </Button>
          ) : (
            <Button link="" type="primary" onClick={onClick}>
              Keep Chatting!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
