import { gsap } from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../Button";
import { useAuth } from "../../hooks/AuthProvider";
import { Principal } from "@dfinity/principal";

interface EditProfileProps {
  urlProfile: string;
  username: string | undefined;
  setUsername: any;
  principal: Principal | null;
  hidden: boolean;
  onClick: () => void;
}

export default function EditProfile({
  urlProfile,
  username,
  setUsername,
  principal,
  hidden,
  onClick,
}: EditProfileProps) {
  const { callFunction, updateUser } = useAuth();
  const element = useRef(null);
  const [start, setStart] = useState(false);
  const [name, setName] = useState<string | undefined>();

  useEffect(() => {
    if (username) {
      setName(username);
    }
  }, [username]);

  useEffect(() => {
    if (start) {
      if (hidden) {
        gsap.fromTo(
          element.current,
          {
            translateY: 0,
          },
          {
            translateY: "-100%",
            duration: 1,
            ease: "back.in(.8)",
          }
        );
      } else {
        gsap.fromTo(
          element.current,
          {
            translateY: "-100%",
          },
          {
            translateY: "0%",
            duration: 0.7,
            ease: "back.out(1)",
          }
        );
      }
    }
  }, [hidden]);

  useEffect(() => {
    gsap.fromTo(
      element.current,
      {
        translateY: "0%",
      },
      {
        translateY: "-100%",
        duration: 0,
      }
    );
    setTimeout(() => setStart(true), 500);
  }, []);

  const handlerUpdateProfile = async () => {
    if (!callFunction || !principal) {
      return;
    }
    try {
      const updatedUser = await callFunction.updateUser(name);
      updateUser(updatedUser.ok);
      setUsername(name);
      onClick();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`w-screen h-screen fixed top-0 left-0 bg-transparent z-50 flex justify-center items-center px-4 sm:px-8`}
      ref={element}
    >
      <div className="flex flex-row justify-between items-start gap-5 rounded-2xl bg-darkSoft p-0 md:p-8 w-full max-w-7xl md:max-w-6xl relative">
        {/* PROFILE */}
        <button onClick={onClick} className="absolute top-4 right-4 md:hidden">
          <img
            src="/chat/close.svg"
            alt="Close Icon"
            className="max-w-none max-h-none m-0 w-6"
          />
        </button>
        <div className="flex flex-col justify-center items-center w-full gap-4 bg-[#303030] px-6 py-8 rounded-xl md:max-w-sm">
          <div className="flex justify-center items-center relative w-fit">
            <img
              src={urlProfile}
              alt="User Profile"
              className="max-w-none max-h-none m-0 relative w-40"
            />
            <input
              type="file"
              name="profile"
              id="profile"
              className="w-full aspect-square absolute z-10 opacity-0"
            />
            <img
              src="/chat/editProfile.svg"
              alt="Icon Edit Profile"
              className="max-w-none max-h-none m-0 w-12 absolute bottom-0 right-0"
            />
          </div>
          <div className="flex flex-col mt-4 md:mt-0 justify-start items-start gap-2 w-full overflow-hidden no-scrollbar md:hidden">
            <div className="flex flex-row justify-start items-center gap-4">
              <p className="font-poppins text-base sm:text-lg text-white font-semibold">
                Achievements
              </p>
              <div className="px-3 bg-greenMain rounded-full font-poppins text-darkMain font-semibold text-sm">
                6<span className="text-darkSoft opacity-40">/15</span>
              </div>
            </div>
            <div className="flex flex-row justify-start w-full items-center gap-2 overflow-scroll no-scrollbar">
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
              <div className="w-full aspect-square max-w-12 min-w-12 flex justify-center items-center relative overflow-hidden">
                <img
                  src="/chat/default-profile.png"
                  alt=""
                  className="max-w-none max-h-none m-0 w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full gap-4">
            <div className="flex flex-col justify-start items-start gap-2 w-full md:mt-6">
              <p className="font-poppins text-white opacity-70 text-sm sm:text-sm md:text-base">
                Name
              </p>
              <div className="flex justify-center items-center w-full relative">
                <input
                  type="text"
                  placeholder="Your username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2 rounded-md outline-none bg-darkSoft font-poppins text-sm sm:text-sm md:text-base text-white"
                />
                <img
                  src="/chat/pencil.svg"
                  alt="Edit Icon"
                  className="max-w-none max-h-none m-0 w-4 absolute right-3"
                />
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              <p className="font-poppins text-white opacity-70 text-sm sm:text-sm md:text-base">
                Principal
              </p>
              <div className="w-full px-4 py-2 rounded-md outline-none bg-darkSoft font-poppins text-sm sm:text-sm md:text-base text-whiteSoft">
                {principal?.toText()}
              </div>
            </div>
            <Button
              link=""
              onClick={() => handlerUpdateProfile()}
              className={"w-full mt-2"}
            >
              Save Change
            </Button>
          </div>
        </div>
        {/* ACHIEVEMENT */}
        <div className="hidden md:flex flex-col justify-start items-start gap-4 w-full">
          {/* HEADER ACHIEVEMENT */}
          <div className="flex flex-row justify-between items-center w-full gap-8">
            <div className="flex flex-row justify-start items-center gap-4">
              <p className="font-poppins text-base sm:text-lg text-white font-semibold">
                Achievements
              </p>
              <div className="px-3 bg-greenMain rounded-full font-poppins text-darkMain font-semibold text-sm">
                6<span className="text-darkSoft opacity-40">/15</span>
              </div>
            </div>
            <button onClick={onClick}>
              <img
                src="/chat/close.svg"
                alt="Close Icon"
                className="max-w-none max-h-none m-0 w-6 "
              />
            </button>
          </div>
          {/* BADAGE LIST */}
          <div className="w-full grid grid-flow-row md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
            <div className="w-full aspect-square max-w-32 flex justify-center items-center relative overflow-visible group">
              <img
                src="/chat/default-profile.png"
                alt=""
                className="max-w-none max-h-none m-0 w-full"
              />
              <div className="absolute whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-150 -bottom-0 font-poppins text-sm text-center font-medium text-darkMain bg-greenMain rounded-full px-4">
                Conversation Starter
              </div>
            </div>
            <div className="w-full aspect-square max-w-32 flex justify-center items-center relative overflow-visible group">
              <img
                src="/chat/default-profile.png"
                alt=""
                className="max-w-none max-h-none m-0 w-full"
              />
              <div className="absolute whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-150 -bottom-0 font-poppins text-sm text-center font-medium text-darkMain bg-greenMain rounded-full px-4">
                Conversation Starter
              </div>
            </div>
            <div className="w-full aspect-square max-w-32 flex justify-center items-center relative overflow-visible group">
              <img
                src="/chat/default-profile.png"
                alt=""
                className="max-w-none max-h-none m-0 w-full"
              />
              <div className="absolute whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-150 -bottom-0 font-poppins text-sm text-center font-medium text-darkMain bg-greenMain rounded-full px-4">
                Conversation Starter
              </div>
            </div>
            <div className="w-full aspect-square max-w-32 flex justify-center items-center relative overflow-visible group">
              <img
                src="/chat/default-profile.png"
                alt=""
                className="max-w-none max-h-none m-0 w-full"
              />
              <div className="absolute whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-150 -bottom-0 font-poppins text-sm text-center font-medium text-darkMain bg-greenMain rounded-full px-4">
                Conversation Starter
              </div>
            </div>
            <div className="w-full aspect-square max-w-32 flex justify-center items-center relative overflow-visible group">
              <img
                src="/chat/default-profile.png"
                alt=""
                className="max-w-none max-h-none m-0 w-full"
              />
              <div className="absolute whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-150 -bottom-0 font-poppins text-sm text-center font-medium text-darkMain bg-greenMain rounded-full px-4">
                Conversation Starter
              </div>
            </div>
            <div className="w-full aspect-square max-w-32 flex justify-center items-center relative overflow-visible group">
              <img
                src="/chat/default-profile.png"
                alt=""
                className="max-w-none max-h-none m-0 w-full"
              />
              <div className="absolute whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-150 -bottom-0 font-poppins text-sm text-center font-medium text-darkMain bg-greenMain rounded-full px-4">
                Conversation Starter
              </div>
            </div>
            <div className="w-full aspect-square max-w-32 flex justify-center items-center relative overflow-visible group">
              <img
                src="/chat/default-profile.png"
                alt=""
                className="max-w-none max-h-none m-0 w-full"
              />
              <div className="absolute whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-150 -bottom-0 font-poppins text-sm text-center font-medium text-darkMain bg-greenMain rounded-full px-4">
                Conversation Starter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
