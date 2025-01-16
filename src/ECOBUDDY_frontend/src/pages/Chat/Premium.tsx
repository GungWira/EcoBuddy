import { Link } from "react-router-dom";
import Shine from "../../components/Shine";
import PricingCard from "../../components/PricingCard";

export default function Premium() {
  return (
    <div className="bg-darkMain w-full relative">
      <div className="min-w-screen min-h-screen bg-mainBackground bg-4 px-4 md:px-8 flex flex-col justify-start items-center relative">
        <div className="w-full flex justify-end items-start py-8 px-4 md:px-8 absolute sm:relative">
          <Link to={"/chat"}>
            <img
              src="/chat/close.svg"
              alt="Close Icon"
              className="max-w-none max-h-none m-0 w-6 md:w-8"
            />
          </Link>
        </div>
        <div className="flex flex-col justify-center  items-start sm:items-center gap-4 max-w-6xl px-4 md:px-8 py-8 sm:py-0">
          <Shine>Exclusive features</Shine>
          <h1 className="md:text-center text-white font-poppins font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-left">
            <span className="text-greenMain">Maximize</span> Your Ecobuddy
            Experience.
          </h1>
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-4 mt-2 md:mt-4">
            <PricingCard
              title="Beginner"
              description="Individuals"
              price={0}
              benefits={[
                "Interact with EcoBuddy’s chatbot",
                "Receive daily reminders",
                "Limited chat token",
              ]}
              link="/"
              buttonNode="Already Owned This Plan"
            />
            <PricingCard
              isBest={true}
              title="Pro"
              description="Individuals or teams"
              price={5}
              benefits={[
                "7-day free trial",
                "Cancel anytime, anywhere",
                "Interact with EcoBuddy’s chatbot",
                "Receive daily reminders",
                "Unlimited chat token",
                "Unlock advanced features",
                "Personalize your EcoBuddy with exclusive bot skins.",
                "Earn extra rewards with bonus achievements and challenges.",
              ]}
              link="/login"
              buttonNode="Start for Free"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
