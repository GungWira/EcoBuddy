import React, { useEffect, useState } from "react";
import LoadingResult from "../../components/Quiz/LoadingResult";
import QuizResult from "../../components/Quiz/QuizResult";
import { useTheme } from "../../hooks/ThemeProvider";
import themes from "../../datas/theme.json";

export default function Result() {
  const { submitQuiz, selectedTheme } = useTheme();
  const [isCalculate, setIsCalculate] = useState(false);
  useEffect(() => {
    submitQuiz(themes.find((theme) => selectedTheme == theme.title)!.id);
  }, []);
  return (
    <div className="bg-darkMain w-full relative">
      <div className="min-w-screen min-h-screen bg-mainBackground bg-4 px-4 md:px-8 flex flex-col justify-start items-center relative">
        {/* LOADING */}
        <LoadingResult setIsCalculate={setIsCalculate} />
        {/* RESULT */}
        <QuizResult isCalculate={isCalculate} />
      </div>
    </div>
  );
}
