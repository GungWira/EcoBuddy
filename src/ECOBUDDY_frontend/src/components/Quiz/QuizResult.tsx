import { useTheme } from "../../hooks/ThemeProvider";
import { Link } from "react-router-dom";
import Button from "../Button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/NotificationProvider";

interface QuizResultProps {
  isCalculate: boolean;
}

export default function QuizResult({ isCalculate }: QuizResultProps) {
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const { score, dailyQuiz, loading } = useTheme();

  useEffect(() => {
    if (isCalculate) {
      if (score == null) {
        navigate("/quiz");
      } else {
        if (
          dailyQuiz[0].status == true &&
          dailyQuiz[1].status == true &&
          dailyQuiz[2].status == true
        ) {
          addNotification(false, "1 Daily Complete!");
        } else {
          addNotification(false, "Daily Quest +1");
        }
        addNotification(true, undefined, score * 5);
      }
    } else {
      console.log("Calculating");
    }
  }, [isCalculate]);

  return (
    <div
      className={`${
        isCalculate
          ? "opacity-100 z-50 translate-y-0"
          : "opacity-0 z-0 -translate-y-4"
      } w-screen h-screen flex justify-center items-center absolute top-0 left-0 z-0 duration-500 ease-in-out transition-all`}
    >
      <div className="flex flex-col justify-center items-center gap-6 bg-transparent sm:bg-[#303030] rounded-xl px-6 py-8 w-full max-w-lg h-screen sm:h-fit">
        {/* TITLE */}
        <h1 className="font-poppins text-white text-center font-bold text-xl sm:text-xl md:text-2xl lg:text-3xl mb-4">
          Your Quiz Summary
        </h1>
        {/* SUMMERIZE */}
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="w-36 overflow-hidden">
            <img
              src="/quiz/trophy.svg"
              alt="Throphy Icon"
              className="w-full max-w-none max-h-none m-0"
            />
          </div>
          <p className="text-whiteSoft font-poppins text-sm sm:text-sm md:text-base text-center mb-2">
            Well done! Check out your quiz performance and insights to see how
            you did and where to improve!
          </p>
          <div className="flex flex-row justify-start items-stretch gap-2 w-full">
            {/* ACCURATION */}
            <div className="flex flex-col justify-start items-start rounded-lg px-4 py-3 bg-greenMain flex-1">
              <p className="font-poppins text-darkMain text-lg font-semibold">
                {score ? (score / 10) * 100 : 0}%
              </p>
              <p className="font-poppins text-darkMain text-sm opacity-80 mt-1">
                Accuration
              </p>
            </div>
            {/* CORRECT */}
            <div className="flex flex-col justify-start items-start rounded-lg px-4 py-3 bg-greenMain flex-1">
              <p className="font-poppins text-darkMain text-lg font-semibold">
                {score ? score : 0}/10
              </p>
              <p className="font-poppins text-darkMain text-sm opacity-80 mt-1">
                Correct
              </p>
            </div>
            {/* EXP */}
            <div className="flex flex-col justify-start items-start rounded-lg px-4 py-3 bg-greenMain flex-1">
              <p className="font-poppins text-darkMain text-lg font-semibold">
                +{score ? score * 5 : 0}
              </p>
              <p className="font-poppins text-darkMain text-sm opacity-80 mt-1">
                XP Points
              </p>
            </div>
          </div>
        </div>
        {/* ACTION */}
        <div className="flex flex-col justify-center mt-6 items-center gap-4">
          <Button link="/quiz" className="w-56">
            Continue Playing
          </Button>
          <Link
            to={"/"}
            className="font-poppins text-white opacity-60 font-medium text-sm mt-1"
          >
            Back to chat
          </Link>
        </div>
      </div>
    </div>
  );
}
