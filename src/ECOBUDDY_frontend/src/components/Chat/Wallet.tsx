import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface WalletProps {
  balance: number;
  address: string;
  hidden: boolean;
  onClick: () => void;
  isLoading: boolean;
}

export default function Wallet({
  balance,
  address,
  hidden,
  onClick,
  isLoading,
}: WalletProps) {
  const element = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [start, setStart] = useState(false);

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

  const handlerCopy = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Gagal menyalin teks: ", error);
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
            My Wallet
          </p>
          <button onClick={onClick}>
            <img
              src="/chat/close.svg"
              alt="Close Icon"
              className="max-w-none max-h-none m-0 w-6 "
            />
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-start items-stretch gap-4 w-full max-w-full">
          <div className="flex flex-col justify-start items-start gap-2 pr-10 px-4 py-4 bg-greenGradient rounded-xl">
            <p className="font-poppins text-darkMain text-base">Balance</p>
            <p className="font-poppins text-darkMain text-2xl font-semibold">
              {isLoading ? 0 : balance / 100000000} ICP
            </p>
          </div>
          <div className="flex flex-col justify-start items-start gap-3 p-4 border border-whiteSoft rounded-xl w-full max-w-full overflow-hidden">
            <p className="font-poppins text-white opacity-90 text-base">
              Address
            </p>
            <div className="flex justify-between items-center gap-8 bg-whiteSoft px-2 py-1 rounded-lg w-full max-w-full relative overflow-hidden">
              <p className="font-poppins text-white text-base opacity-90 cursor-pointer">
                {address}
              </p>
              {isCopied ? (
                <p className="font-poppins text-white text-sm opacity-60 bg-whiteSoft absolute z-10 right-0 top-0 p-2 rounded-lg">
                  Copied
                </p>
              ) : (
                <button
                  typeof="button"
                  onClick={() => handlerCopy(address)}
                  className="bg-whiteSoft absolute z-10 right-0 top-0 p-2 rounded-lg"
                >
                  <img src="/chat/copy.svg" alt="Copy Icon" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
