import { useEffect } from "react";
import LoadingQuiz from "../../components/Quiz/LoadingQuiz";
import CountdownQuiz from "../../components/Quiz/CountdownQuiz";
import QuestionArea from "../../components/Quiz/QuestionArea";
import { useTheme } from "../../hooks/ThemeProvider";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();
  const { selectedTheme, start } = useTheme();
  useEffect(() => {
    if (selectedTheme) {
      start();
    } else {
      navigate("/quiz");
    }
  }, []);
  return (
    <div className="bg-darkMain w-full relative">
      <div className="min-w-screen min-h-screen bg-mainBackground bg-4 px-4 md:px-8 flex flex-col justify-start items-center relative">
        {/* LOADING */}
        <LoadingQuiz />
        {/* COUNTDOWN */}
        <CountdownQuiz />
        {/* QUIZ */}
        <QuestionArea />
      </div>
    </div>
  );
}
