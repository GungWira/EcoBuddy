import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/ThemeProvider";

export default function CountdownQuiz() {
  const { loading } = useTheme();
  const [count, setCount] = useState<any>(3);
  useEffect(() => {
    if (!loading) {
      if (count == 3) {
        setTimeout(() => {
          setCount(count - 1);
        }, 2200);
      } else if (count > 1) {
        setTimeout(() => {
          setCount(count - 1);
        }, 1200);
      } else {
        setTimeout(() => {
          setCount("GO!");
        }, 1200);
      }
    }
  }, [count, loading]);
  return (
    <div
      className={`w-screen h-screen opacity-0 -translate-y-2 absolute top-0 left-0 flex flex-col justify-center items-center transition-all ease-in-out duration-500 delay-1000 gap-4 ${
        !loading && "opacity-100 -translate-y-0"
      }`}
    >
      <div
        className={`relative flex justify-center items-center text-center overflow-hidden w-full bg-greenMain text-6xl font-poppins font-semibold text-darkMain transition-all ease-in-out delay-1000 duration-700 ${
          !loading ? (count == "GO!" ? "h-0" : "h-24") : "h-0"
        }`}
      >
        <p className="text-darkMain font-poppins text-6xl font-semibold py-4">
          {count}
        </p>
      </div>
    </div>
  );
}
