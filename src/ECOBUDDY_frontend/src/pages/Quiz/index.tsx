import CardTheme from "../../components/Quiz/CardTheme";
import { useState } from "react";
import { useTheme } from "../../hooks/ThemeProvider";
import { useNavigate } from "react-router-dom";
import themes from "../../datas/theme.json";

export default function Quiz() {
  const navigate = useNavigate();
  const {
    selectedTheme,
    setSelectedTheme,
    setLoading,
    setScore,
    dailyQuiz,
    loading,
  } = useTheme();
  const [isIntro, setIsIntro] = useState<Boolean>(true);

  const handlerStart = async () => {
    setLoading(true);
    navigate("/quiz/start");
    setScore(0);
  };
  return (
    <main>
      <div className="bg-darkMain w-full relative">
        <div className="min-w-screen min-h-screen bg-mainBackground bg-4 px-4 md:px-8 flex flex-col justify-start items-center">
          {/* STARTER */}
          <div className="flex flex-col justify-center items-center w-screen h-screen relative overflow-visible px-8">
            {/* CONTENT */}
            <div className="relative flex flex-row h-fit justify-start items-center w-full overflow-hidden pb-24 overflow-y-visible">
              {/* INTRO */}
              <div
                className={`flex flex-col justify-center items-center gap-10 min-w-full relative h-full transition-all ease-in-out duration-700 ${
                  isIntro
                    ? "translate-y-0 z-10"
                    : "-translate-y-4 z-0 opacity-0"
                }`}
              >
                <div className="w-52 sm:w-64 md:w-80 lg:w-96 relative overflow-hidden">
                  <img
                    src="/quiz/starter.png"
                    alt="Starter Image"
                    className="max-w-none max-h-none m-0 w-full"
                  />
                </div>
                <div className="w-full max-w-[512px] flex flex-col justify-center items-center gap-3">
                  <h1 className="font-poppins text-white text-center font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl">
                    <span className="text-greenMain">GreenMind</span> Challenge
                  </h1>
                  <p className="text-whiteSoft font-poppins text-sm sm:text-sm md:text-base text-center mb-2">
                    Test your knowledge in a fun way! Choose from 3 exciting
                    themes, and let our AI challenge you with unique questions.
                    Ready to give it a try?
                  </p>
                </div>
              </div>
              {/* THEME */}
              <div
                className={`flex flex-col justify-center items-center min-w-full relative h-full -translate-x-full transition-all ease-in-out duration-700 delay-1000 ${
                  isIntro
                    ? "-translate-y-4 z-0 opacity-0"
                    : "translate-y-0 z-10"
                }`}
              >
                <div className="w-full max-w-[512px] flex flex-col justify-start sm:justify-center items-start sm:items-center gap-3">
                  <h1 className="font-poppins text-white text-left sm:text-center font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl">
                    Choose Your{" "}
                    <span className="text-greenMain">Quiz Theme!</span>
                  </h1>
                  <p className="text-whiteSoft font-poppins text-sm sm:text-sm md:text-base sm:text-center mb-2">
                    Pick a theme and start your eco-quiz journey! Test your
                    knowledge while learning to protect our planet.
                  </p>
                </div>
                <div className="flex flex-row w-full justify-start sm:justify-center items-start sm:items-center gap-4 mt-6 overflow-x-scroll no-scrollbar">
                  {dailyQuiz.map((quiz) => (
                    <CardTheme
                      key={quiz.id}
                      id={quiz.id}
                      isComplete={quiz.status}
                      onClick={() =>
                        quiz.status
                          ? ""
                          : !loading &&
                            setSelectedTheme(
                              themes.find((theme) => quiz.id == theme.id)!.title
                            )
                      }
                      themeChoose={selectedTheme}
                    />
                  ))}
                </div>
              </div>
              {/* BUTTON */}
              <div className="flex flex-col justify-start items-center w-full gap-4 mt-0 md:mt-8 absolute bottom-0">
                <div className="flex flex-row justify-center items-center gap-1">
                  <div
                    className={`h-2 md:h-3  rounded-full transition-all ease-in-out duration-300 ${
                      isIntro ? "bg-greenMain w-7" : "bg-[#303030] w-3"
                    }`}
                  ></div>
                  <div
                    className={`h-2 md:h-3  rounded-full transition-all ease-in-out duration-300 ${
                      !isIntro ? "bg-greenMain w-7" : "bg-[#303030] w-3"
                    }`}
                  ></div>
                </div>
                <div
                  className={`relative overflow-visible flex justify-center items-center group min-w-56 mt-0 m-0 transition-all ease-in-out duration-300 ${
                    !isIntro && !selectedTheme && "opacity-40"
                  }`}
                >
                  <button
                    typeof="button"
                    onClick={() =>
                      isIntro
                        ? setIsIntro(false)
                        : selectedTheme && handlerStart()
                    }
                    className={`px-6 py-2 w-full text-darkMain bg-greenMain relative z-20 rounded-full font-poppins font-semibold text-xs sm:text-sm md:text-base flex justify-center items-center gap-2 ease-in-out transition-all duration-100`}
                  >
                    {isIntro ? "Next" : "Start Quiz!"}
                  </button>
                  <div
                    className="absolute z-10 w-full h-full rounded-full bg-red opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500"
                    style={{
                      boxShadow: "0px 0px 40.5px 0px rgba(19, 242, 135, 0.45)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
