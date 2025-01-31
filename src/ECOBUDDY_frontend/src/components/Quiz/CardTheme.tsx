import themes from "../../datas/theme.json";

interface CardThemeProps {
  id: string;
  isComplete: boolean;
  themeChoose: string | null;
  onClick: () => void;
}

export default function CardTheme({
  id,
  isComplete,
  onClick,
  themeChoose,
}: CardThemeProps) {
  const selectedTheme = themes.find((theme) => id == theme.id);
  return (
    <div
      onClick={onClick}
      className={`flex flex-col justify-start items-start gap-3 px-3 py-4 rounded-xl w-80 transition-all duration-150 ease-in-out ${
        isComplete
          ? "opacity-60 border border-[#303030]"
          : themeChoose == selectedTheme!.title
          ? "opacity-100 cursor-pointer bg-[#1B7449] border border-greenMain"
          : "opacity-100 cursor-pointer border border-[#303030]"
      }`}
    >
      <p className="text-white font-poppins font-semibold text-base">
        {selectedTheme ? selectedTheme.title : ""}
      </p>
      <div className="w-full overflow-hidden">
        <img
          src={`/quiz/theme-${id}.png`}
          alt="Theme Img"
          className={`max-w-none max-h-none m-0 w-full ${
            isComplete && "grayscale"
          }`}
        />
      </div>
      <p
        className={`font-poppins text-sm sm:text-sm md:text-base text-left mb-2 ${
          themeChoose == selectedTheme!.title
            ? "text-[#CDCDCD]"
            : "text-whiteSoft"
        }`}
      >
        {selectedTheme ? selectedTheme.description : ""}
      </p>
    </div>
  );
}
