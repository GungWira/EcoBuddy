import React, { useEffect, useState } from "react";
import { useTheme } from "../../hooks/ThemeProvider";

interface LoadingResult {
  setIsCalculate: (value: boolean) => void;
}

export default function LoadingResult({ setIsCalculate }: LoadingResult) {
  const { loading } = useTheme();
  const [intro, setIntro] = useState({ init: false, loading: false });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // SHOW INTRO
    setTimeout(() => {
      setIntro({
        init: true,
        loading: false,
      });
      // HIDE INTRO
      setTimeout(() => {
        setIntro({
          init: false,
          loading: false,
        });

        // SHOW LOADING
        setTimeout(() => {
          setIntro({
            init: false,
            loading: true,
          });
        }, 1000);
      }, 1500);
    }, 1000);
  }, []);

  useEffect(() => {
    if (intro.loading) {
      if (loading) {
        if (progress < 95) {
          setTimeout(() => {
            setProgress(progress + 1);
          }, 50);
        }
      } else {
        setProgress(100);
        setTimeout(() => {
          setIntro({
            init: false,
            loading: false,
          });
          setIsCalculate(true);
        }, 1500);
      }
    }
  }, [progress, intro.loading, loading]);

  return (
    <div
      className={`w-screen h-screen absolute flex flex-col justify-center items-center transition-all ease-in-out duration-500 gap-4 px-8`}
    >
      <div className="w-screen h-screen absolute flex justify-center items-center">
        <div
          className={`relative flex justify-center items-center text-center overflow-hidden w-full bg-greenMain text-6xl font-poppins font-semibold text-darkMain transition-all ease-in-out duration-700 ${
            intro.init ? "h-24" : "h-0"
          }`}
        >
          <p className="text-darkMain font-poppins text-6xl font-semibold py-4">
            FINISH!
          </p>
        </div>
      </div>
      {/* PROGRES BAR */}
      <div
        className={`${
          intro.loading
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"
        } relative w-screen h-screen flex justify-center items-center transition-all ease-in-out duration-500`}
      >
        <div className="flex flex-col justify-center items-center max-w-2xl w-full px-8 gap-5">
          <h1 className="font-poppins text-white text-center font-bold text-xl sm:text-xl md:text-2xl lg:text-3xl mb-4">
            Greening Your Results...
          </h1>
          <div className="flex justify-start items-center w-full bg-[#707070] h-2 rounded-full">
            <div
              className="h-2 bg-greenMain rounded-full transition-all ease-in-out duration-150"
              style={{ width: progress + "%" }}
            ></div>
          </div>
          <p className="text-whiteSoft font-poppins text-sm sm:text-sm md:text-base text-center mb-2">
            Hold on! We're calculating your score.
          </p>
        </div>
        {/* NOTIF */}
        <div className="w-full px-8 flex justify-center items-center absolute bottom-16">
          <div className="w-full max-w-fit px-6 py-2 rounded-full bg-[#6D7134] border border-[#E0EA53] text-center font-poppins text-white font-medium text-sm sm:text-sm md:text-base">
            Note: Do not refresh the page to avoid interrupting process.
          </div>
        </div>
      </div>
    </div>
  );
}
