import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-darkSoft flex flex-col justify-center items-center mt-16 sm:mt-24 md:mt-32 pt-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 w-full max-w-6xl px-4 md:px-8">
        <div className="flex flex-3 flex-col justify-start items-start gap-2">
          <Link to={"/"}>
            <img
              src="/home/logo.svg"
              alt="Logo EcoBuddy"
              className="text-x-24 md:w-32"
            />
          </Link>
          <p className="font-poppins text-white opacity-70 text-sm sm:text-sm md:text-base">
            Your green Companion
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-start md:justify-between items-start gap-4 flex-4 w-full">
          <div className="flex flex-col justify-start items-start gap-2 flex-1 md:flex-none">
            <p className="font-poppins text-white text-sm sm:text-lg md:text-xl font-medium">
              Pages
            </p>
            <Link
              to={"/"}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              Home
            </Link>
            <Link
              to={"/"}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              Chat
            </Link>
            <Link
              to={"/"}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              Profile
            </Link>
          </div>
          <div className="flex flex-col justify-start items-start gap-2 flex-1 md:flex-none">
            <p className="font-poppins text-white text-sm sm:text-lg md:text-xl font-medium">
              Useful Links
            </p>
            <Link
              to={""}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              Docs
            </Link>
            <Link
              to={""}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              Github
            </Link>
            <Link
              to={""}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              Youtube
            </Link>
          </div>
          <div className="flex flex-col justify-start items-start gap-2 flex-1 md:flex-none">
            <p className="font-poppins text-white text-sm sm:text-lg md:text-xl font-medium">
              Contact
            </p>
            <Link
              to={""}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              info@ecobuddy.com
            </Link>
            <Link
              to={""}
              className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-60"
            >
              +62 831-1422-6818
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-[#2F2F2F] mt-12 sm:mt-16 md:mt-20 px-4 py-5 flex justify-center items-center">
        <div className="flex justify-center items-center w-full max-w-6xl">
          <p className="font-poppins text-white text-sm sm:text-sm md:text-base opacity-50">
            Copyright © ecobuddy | Developed by Try and Astungkara Team.
          </p>
        </div>
      </div>
    </footer>
  );
}
