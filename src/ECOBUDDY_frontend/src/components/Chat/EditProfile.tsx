import { gsap } from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../Button";
import { AuthContext } from "../../hooks/AuthContext";

interface EditProfileProps {
  urlProfile: string;
  username: string | undefined;
  setUsername: any;
  principal: string | null;
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
  const auth = useContext(AuthContext);
  const { actor } = auth;
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
    if (!actor || !principal) {
      return;
    }
    try {
      await actor.setUsername(name);
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
      <div className="flex flex-col justify-center items-center gap-5 rounded-2xl bg-darkSoft p-5 sm:p-6 md:p-8 w-full max-w-3xl">
        <div className="flex flex-row justify-between items-center w-full gap-8">
          <p className="font-poppins text-base sm:text-lg text-white font-semibold">
            Edit Profile
          </p>
          <button onClick={onClick}>
            <img
              src="/chat/close.svg"
              alt="Close Icon"
              className="max-w-none max-h-none m-0 w-6 "
            />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-4">
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
          <div className="flex flex-col justify-start items-start w-full gap-4">
            <div className="flex flex-col justify-start items-start gap-2 w-full">
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
                  className="w-full px-4 py-2 rounded-md outline-none bg-[#303030] font-poppins text-sm sm:text-sm md:text-base text-white"
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
              <div className="w-full px-4 py-2 rounded-md outline-none bg-[#303030] font-poppins text-sm sm:text-sm md:text-base text-whiteSoft">
                {principal}
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
      </div>
    </div>
  );
}
