import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthProvider";

interface Quiz {
  question: string;
  options: [string];
  answer: string;
}

interface DailyQuiz {
  id: string;
  status: boolean;
}

interface ThemeContextType {
  selectedTheme: string | null;
  setSelectedTheme: (theme: string | null) => void;
  loading: boolean;
  setLoading: (boolen: boolean) => void;
  start: () => Promise<void>;
  quiz: [Quiz] | null;
  score: number | null;
  setScore: (score: number) => void;
  dailyQuiz: DailyQuiz[];
  submitQuiz: (themeId: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { callFunction, principal, isAuth } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<[Quiz] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [dailyQuiz, setDailyQuiz] = useState<DailyQuiz[]>([
    { id: "001", status: false },
    { id: "002", status: false },
    { id: "003", status: false },
  ]);

  const getRandomIDs = () => {
    const allIds = Array.from({ length: 15 }, (_, i) =>
      String(i + 1).padStart(3, "0")
    );

    const shuffled = allIds.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    const initQuiz = async () => {
      setLoading(true);
      if (isAuth && callFunction && principal) {
        const today = new Date()
          .toLocaleDateString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/")
          .reverse()
          .join("-");
        const [id1, id2, id3] = getRandomIDs();
        if (id1 && id2 && id3) {
          const userQuiz = await callFunction.getDailyQuizs(
            principal,
            today,
            id1,
            id2,
            id3
          );
          if ("ok" in userQuiz) {
            setDailyQuiz([
              {
                id: userQuiz.ok.quizNum1,
                status: userQuiz.ok.statQuizNum1,
              },
              {
                id: userQuiz.ok.quizNum2,
                status: userQuiz.ok.statQuizNum2,
              },
              {
                id: userQuiz.ok.quizNum3,
                status: userQuiz.ok.statQuizNum3,
              },
            ]);
          }
          setLoading(false);
        }
      }
    };
    initQuiz();
  }, [isAuth, callFunction]);

  async function start() {
    if (selectedTheme) {
      setLoading(true);
      try {
        const res = await callFunction.askQuiz(selectedTheme);
        if ("ok" in res) {
          const quiz = await JSON.parse(res.ok);
          setQuiz(quiz.questions);
        } else {
          console.log(res);
          console.log("Invalid");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function submitQuiz(themeId: string) {
    setLoading(true);
    if (score) {
      try {
        const userQuiz = await callFunction.submitDailyQuiz(
          principal,
          themeId,
          (score * 5).toString()
        );

        if ("ok" in userQuiz) {
          setDailyQuiz([
            {
              id: userQuiz.ok.quizNum1,
              status: userQuiz.ok.statQuizNum1,
            },
            {
              id: userQuiz.ok.quizNum2,
              status: userQuiz.ok.statQuizNum2,
            },
            {
              id: userQuiz.ok.quizNum3,
              status: userQuiz.ok.statQuizNum3,
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        setSelectedTheme,
        loading,
        start,
        setLoading,
        quiz,
        score,
        setScore,
        dailyQuiz,
        submitQuiz,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
