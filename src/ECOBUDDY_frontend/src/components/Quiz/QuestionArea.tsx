import React, { useEffect, useState } from "react";
import { useTheme } from "../../hooks/ThemeProvider";
import { useNavigate } from "react-router-dom";

export default function QuestionArea() {
  const navigate = useNavigate();
  const { loading, quiz, setScore, score } = useTheme();
  const [isStart, setIsStart] = useState(false);
  const [index, setIndex] = useState(0);
  const [progindex, setProgIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setIsStart(true);
      }, 7000);
    }
  }, [loading]);

  const handlerAnswer = async (opt: string) => {
    if (!quiz || selectedAnswer) return;

    setSelectedAnswer(opt);
    const correct = opt === quiz[index].answer;

    if (correct) {
      if (score != null) {
        setScore(score + 1);
      }
    }
    setProgIndex(progindex + 1);

    setTimeout(() => {
      handlerNext();
    }, 1500);
  };

  const handlerNext = () => {
    if (quiz && index + 1 < quiz.length) {
      setIndex(index + 1);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
      setTimeout(() => {
        navigate("/quiz/result");
      }, 1000);
    }
  };

  return (
    <div
      className={`w-screen h-screen relative flex flex-col justify-center items-center transition-all ease-in-out duration-500 gap-4 px-8 ${
        isStart ? "opacity-100" : "opacity-0"
      }`}
    >
      {!quiz ? (
        <div className="font-poppins text-white text-center font-bold text-xl sm:text-xl md:text-xl lg:text-2xl mb-4">
          Error Generating Quiz, Please Try Again Later
        </div>
      ) : (
        <div
          className={`flex flex-col justify-center items-center gap-4 max-w-2xl w-full transition-all ease-in-out duration-500 ${
            isComplete && "opacity-0 -translate-y-4"
          }`}
        >
          <h1 className="font-poppins text-white text-center font-bold text-2xl sm:text-2xl md:text-2xl lg:text-3xl mb-6">
            {quiz[index].question} (
            <span className="text-greenMain">5 EXP</span>)
          </h1>
          {quiz[index].options.map((opt, key) => {
            let bgColor = "bg-[#303030] hover:bg-[#262323]";
            let iconSrc = "";

            if (selectedAnswer) {
              if (opt === quiz[index].answer) {
                bgColor = "bg-[#1B7449] border border-[#13F287]";
                iconSrc = "/quiz/correct.svg";
              } else if (opt === selectedAnswer) {
                bgColor = "bg-[#692323] border border-[#D62828]";
                iconSrc = "/quiz/incorrect.svg";
              }
            }

            return (
              <button
                key={key}
                onClick={() => handlerAnswer(opt)}
                className={`w-full flex justify-start items-center text-white font-poppins text-sm sm:text-sm md:text-base font-medium relative px-4 py-5 rounded-md duration-300 ease-in-out ${bgColor}`}
                disabled={!!selectedAnswer}
              >
                <span>
                  {key == 0 ? "A.  " : key == 1 ? "B.  " : "C.  "}
                  {"   "}
                  {"   " + opt}
                </span>
                {selectedAnswer && iconSrc && (
                  <img
                    src={iconSrc}
                    alt="icon"
                    className="w-6 h-6 absolute right-4"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
      {quiz && (
        <div className="w-full px-8 absolute top-6 flex justify-center items-center flex-col">
          <div className="flex justify-start items-center h-2 w-full rounded-full bg-[#707070]">
            <div
              className="bg-greenMain h-2 rounded-full transition-all ease-in-out duration-300"
              style={{
                width: progindex * 10 + "%",
              }}
            ></div>
          </div>
          <p className="font-poppins text-greenMain text-base text-center mt-4 font-semibold">
            Question : {index + 1 > 10 ? 10 : index + 1}/10
          </p>
        </div>
      )}
    </div>
  );
}
