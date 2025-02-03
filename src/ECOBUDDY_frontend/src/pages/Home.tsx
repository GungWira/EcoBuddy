import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Shine from "../components/Shine";
import AboutCard from "../components/AboutCard";
import PricingCard from "../components/PricingCard";
import QNA from "../components/QNA";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/AuthProvider";

export default function () {
  const { login } = useAuth();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="bg-darkMain w-full">
      <Navbar />
      <div className="min-w-screen min-h-screen bg-mainBackground bg-4 px-4 md:px-8 pt-28 md:pt-36 flex flex-col justify-start items-center">
        {/* INTRODUCTION */}
        <div
          className="flex flex-col md:justify-center md:items-center w-full gap-4 max-w-[480px] md:max-w-[500px]"
          id="home"
        >
          <Shine>ver 1.0</Shine>
          <h1 className="md:text-center text-white font-poppins font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl">
            Cleaner Future With Your Personal
            <span className="text-greenMain inline-flex justify-center items-center gap-1 mx-1">
              AI
              <span className="w-8 h-[2px] rounded-full bg-greenMain inline-flex"></span>
              Assistant
            </span>
          </h1>
          <p className="text-whiteSoft font-poppins text-sm sm:text-sm md:text-base md:text-center">
            Level up your green journey with EcoBuddy! Chat, explore, and make
            everyday choices for a better planet.
          </p>
          <div className="flex flex-row justify-start items-start gap-2">
            <Button link="" onClick={login}>
              <p>Try it free</p>
              <img
                src="/home/more.svg"
                alt="More Icon"
                className="w-4 overflow-hidden aspect-square"
              />
            </Button>
            <Button
              link="#service"
              type="secondary"
              onClick={() => scrollToSection("services")}
            >
              Explore more
            </Button>
          </div>
        </div>

        {/* VIDEO */}
        <div className="w-full max-w-6xl flex justify-center items-center relative mt-8 md:mt-16">
          {/* BACKLIGHT */}
          <div
            className="absolute z-10 w-full md:min-w-96 h-24 rounded-full bg-transparent top-4"
            style={{
              boxShadow: "0px -25px 54.5px 0px rgba(19, 242, 135, 0.25)",
            }}
          ></div>
          {/* VIDEO */}
          <div className="w-full bg-darkSoft md:rounded-3xl aspect-video relative z-20 rounded-xl overflow-hidden">
            <video autoPlay loop muted>
              <source src="/home/home-vid.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* MEDIA PARTNER */}
        <div className="w-full max-w-6xl overflow-hidden flex flex-col justify-start items-center relative mt-6 md:mt-12 gap-6 md:gap-8">
          <p className="font-poppins text-sm sm:text-sm md:text-base text-whiteSoft">
            Supported by
          </p>
          <div className="flex flex-row justify-start items-start gap-4 overflow-hidden w-full relative">
            <img
              src="/home/media-partner.svg"
              alt="Media Partner"
              className="h-6 max-w-7xl md:h-8 animate-slide"
            />
            <img
              src="/home/media-partner.svg"
              alt="Media Partner"
              className="h-6 max-w-7xl md:h-8 animate-slide"
            />
            <img
              src="/home/media-partner.svg"
              alt="Media Partner"
              className="h-6 max-w-7xl md:h-8 animate-slide"
            />

            <div className="h-6 md:h-8 w-12 absolute left-0 top-0 bg-gradient-to-r from-darkMain to-darkMain/0"></div>
            <div className="h-6 md:h-8 w-12 absolute right-0 top-0 bg-gradient-to-l from-darkMain to-darkMain/0"></div>
          </div>
        </div>

        {/* SERVICE SECTION */}
        <div
          className="flex flex-col max-w-6xl justify-center items-center gap-6 md:gap-8 pt-20 sm:pt-24 md:pt-32"
          id="services"
        >
          <div className="flex flex-col justify-center items-start sm:items-center gap-4">
            <Shine>Ecobuddy On Action</Shine>
            <h1 className="font-poppins font-bold text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl sm:text-center">
              Empowering Your <span className="text-greenMain">Green</span>{" "}
              Lifestyle
            </h1>
          </div>
          <div className="flex flex-col md:flex-row w-full justify-start items-start gap-4">
            <AboutCard
              count={1}
              title="Sort Waste Effortlessly"
              description="EcoBuddy makes waste sorting simple. Learn to categorize recyclables, organics, and non-recyclables to reduce landfill waste and keep the environment clean."
            />
            <AboutCard
              count={2}
              title="Simple Green Solutions"
              description="Discover practical tips to live sustainably. From reducing plastic use to upcycling old items, EcoBuddy helps you build habits that make a positive impact."
            />
            <AboutCard
              count={3}
              title="Measure Your Progress"
              description="Monitor how your eco-friendly actions benefit the planet. EcoBuddy tracks your progress, highlights milestones, and celebrates your green achievements."
            />
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div
          className="w-full max-w-6xl flex md:flex-row flex-col justify-between items-center gap-6 md:gap-12 pt-20 sm:pt-24 md:pt-32"
          id="about"
        >
          <div className="flex flex-1 w-full justify-center items-center rounded-2xl overflow-hidden relative">
            <div className="w-full h-full absolute z-10 bg-aboutBackground bg-center"></div>
            <img
              src="/home/ecoBot.png"
              alt="EcoBot"
              className="h-48 sm:h-72 md:h-96 max-w-[241px] max-h-[287px] z-20 m-0"
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-1 md:gap-3 flex-1">
            <Shine>Your Green Companion</Shine>
            <h1 className="font-poppins font-bold text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-center my-1">
              Meet <span className="text-greenMain">Ecobuddy</span>
            </h1>
            <p className="text-sm sm:text-sm md:text-base font-poppins text-whiteSoft mb-2">
              EcoBuddy is your guide to a greener lifestyle. It helps you sort
              waste, provides eco-friendly tips, and tracks your sustainability
              progress. With personalized advice and easy-to-follow steps,
              EcoBuddy makes living sustainably simple and fun.
            </p>
            <Button link="" onClick={login}>
              <p>Try it now</p>
              <img
                src="/home/more.svg"
                alt="More Icon"
                className="w-4 overflow-hidden aspect-square"
              />
            </Button>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div
          className="flex flex-col justify-center items-center pt-20 sm:pt-24 md:pt-32 w-full max-w-6xl"
          id="pricing"
        >
          <div className="flex flex-col justify-center items-start sm:items-center gap-2">
            <Shine>Exclusive features</Shine>
            <h1 className="font-poppins font-bold text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl sm:text-center my-1">
              <span className="text-greenMain">Maximize</span> Your Ecobuddy
              Experience.
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-4 mt-4 md:mt-8">
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

        {/* QNA SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-8 md:gap-16 rounded-3xl  sm:bg-darkSoft sm:p-6 md:p-12 w-full max-w-6xl mt-16 sm:mt-24 md:mt-32">
          <div className="flex flex-1 justify-start items-start flex-col gap-4">
            <div className="flex flex-col justify-start items-start gap-3">
              <Shine>Got Question?</Shine>
              <h1 className="font-poppins font-bold text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-left">
                We’ve Got You <span className="text-greenMain">Covered</span>
              </h1>
            </div>
            <p className="font-poppins text-whiteSoft sm:text-white text-sm sm:text-sm md:text-base sm:opacity-70">
              Got questions about EcoBuddy? Find answers to the most common
              inquiries about how it works, its features, and how it helps you
              lead a greener lifestyle.
            </p>
          </div>
          <div className="flex flex-1 flex-col justify-start items-start">
            <QNA />
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <Footer />
    </main>
  );
}
