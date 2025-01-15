import { Link } from "react-router-dom";

interface PricingCardProps {
  isBest?: boolean;
  title?: string;
  description?: string;
  price?: number;
  benefits?: string[];
  link?: string;
  buttonNode?: string;
}

export default function PricingCard({
  isBest = false,
  title = "Default Title",
  description = "Default Description",
  price = 0,
  benefits = ["Default benefit 1", "Default benefit 2"],
  link = "/",
  buttonNode = "Start for Free",
}: PricingCardProps) {
  return (
    <div
      className={`flex flex-col justify-between items-start flex-1 w-full md:max-w-[367px] min-h-[280px] md:min-h-[400px] rounded-2xl px-6 py-5 ${
        isBest ? "bg-greenGradient" : "bg-darkGradient"
      }`}
    >
      <div className="flex flex-col w-full justify-start items-start">
        <h2
          className={`font-poppins text-base sm:text-lg md:text-xl font-semibold mb-1 ${
            isBest ? "text-darkMain" : "text-white"
          }`}
        >
          {title}
        </h2>
        <p
          className={`font-poppins text-xs sm:text-sm md:text-base opacity-60 ${
            isBest ? "text-darkMain" : "text-white"
          }`}
        >
          {description}
        </p>
        <div className="flex flex-row justify-start items-end my-3 md:my-6">
          <div className="flex flex-row justify-center items-center gap-2">
            <img
              src="/home/icp.png"
              alt="ICP Token"
              className="w-8 sm:w-10 md:w-12"
            />
            <p
              className={`font-bold font-poppins text-2xl sm:text-3xl md:text-4xl ${
                isBest ? "text-darkMain" : "text-white"
              }`}
            >
              {price}
            </p>
          </div>
          <p
            className={`ml-2 opacity-60 font-poppins text-xs sm:text-sm md:text-base ${
              isBest ? "text-darkMain" : "text-white"
            }`}
          >
            Monthly
          </p>
        </div>
        <div className="flex flex-col justify-start items-start gap-2 md:gap-3 w-full">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-row justify-start items-start gap-2"
            >
              <img
                className="w-3 sm:w-4 md:w-5 opacity-70"
                src={isBest ? "/home/check-black.svg" : "/home/check-green.svg"}
                alt={isBest ? "Black Checkmark" : "Green Checkmark"}
              />
              <p
                className={`font-poppins text-xs sm:text-sm md:text-base opacity-70 ${
                  isBest ? "text-darkMain" : "text-white"
                }`}
              >
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Link
        to={link}
        className={`w-full flex justify-center items-center mt-4 md:mt-8`}
      >
        <button
          className={`w-full border rounded-full flex justify-center items-center px-4 py-2 font-poppins text-xs sm:text-sm md:text-base font-semibold ${
            !isBest
              ? "border-greenMain text-greenMain bg-transparent"
              : "border-darkMain bg-darkMain text-white"
          }`}
        >
          {buttonNode}
        </button>
      </Link>
    </div>
  );
}
