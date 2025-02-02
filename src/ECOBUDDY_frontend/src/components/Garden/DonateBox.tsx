import { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";

interface DonateBoxProps {
  isActive: boolean;
  onSuccess: (inputUser: number) => void;
  onClick: () => void;
}

export default function DonateBox({
  isActive,
  onSuccess,
  onClick,
}: DonateBoxProps) {
  const { principal, ecoBuddyPrincipal, callFunction } = useAuth();
  const [value, setValue] = useState<number | string>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlerDonate = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (value != "") {
        const amount = Number(value) * 100000000;
        const res = await callFunction.transferICP(
          principal,
          ecoBuddyPrincipal,
          amount
        );
        console.log(res);
        if ("ok" in res) {
          setValue(0);
          onSuccess(Number(value));
        } else {
          setErrorMessage("Failed to donate your ICP, please try again later");
        }
      }
    } catch (error) {
      setErrorMessage("Failed to donate your ICP, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-screen h-screen fixed top-0 left-0 justify-center items-center z-50 ${
        isActive ? "flex" : "hidden"
      }`}
    >
      <div className="w-full h-full bg-darkSoft/30 backdrop-blur-sm absolute top-0 left-0 z-40"></div>
      <div className="w-full px-8 flex justify-center items-center relative z-50 ">
        <div className="max-w-md gap-4 bg-darkSoft rounded-xl flex flex-col justify-center items-center px-5 py-6 relative w-full shadow-[0_0_32px_0px_rgba(19,242,135,0.3)]">
          {/* CLOSE BUTTON */}
          <div className="w-full flex justify-end items-center mb-2">
            <button
              typeof="button"
              className="absolute top-4 right-4 aspect-square flex justify-center items-center border-none bg-transparent"
              onClick={onClick}
            >
              <img
                src="/garden/close.svg"
                alt="close icon"
                className="max-w-none max-h-none m-0 w-6"
              />
            </button>
          </div>
          <h2 className="text-white font-poppins text-xl font-bold mb-3">
            Donate & Grow Your Tree
          </h2>
          {/* BOX SELECTION */}
          <div className="flex flex-row justify-between items-center gap-3 w-full">
            <div
              className={`flex flex-1 justify-center items-center py-1 px-4 rounded-md border gap-2 ${
                value == 1
                  ? "bg-[#104E30] border-greenMain"
                  : "bg-[#303030] border-[#303030]"
              }`}
              onClick={() => setValue(1)}
            >
              <p className="font-poppins text-white font-medium text-sm">1</p>
              <img
                src="/garden/ICP.png"
                alt="ICP"
                className="max-w-none max-h-none m-0 w-6"
              />
            </div>
            <div
              className={`flex flex-1 justify-center items-center py-1 px-4 rounded-md border gap-2 ${
                value == 5
                  ? "bg-[#104E30] border-greenMain"
                  : "bg-[#303030] border-[#303030]"
              }`}
              onClick={() => setValue(5)}
            >
              <p className="font-poppins text-white font-medium text-sm">5</p>
              <img
                src="/garden/ICP.png"
                alt="ICP"
                className="max-w-none max-h-none m-0 w-6"
              />
            </div>
            <div
              className={`flex flex-1 justify-center items-center py-1 px-4 rounded-md border gap-2 ${
                value == 10
                  ? "bg-[#104E30] border-greenMain"
                  : "bg-[#303030] border-[#303030]"
              }`}
              onClick={() => setValue(10)}
            >
              <p className="font-poppins text-white font-medium text-sm">10</p>
              <img
                src="/garden/ICP.png"
                alt="ICP"
                className="max-w-none max-h-none m-0 w-6"
              />
            </div>
          </div>
          {/* INPUT */}
          <div className="w-full relative overflow-hidden flex justify-center items-center">
            <input
              type="number"
              className="w-full bg-darkMain font-poppins text-white font-medium text-sm px-3 py-2 rounded-md outline-none"
              value={value}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "") {
                  setValue("");
                } else {
                  setValue(newValue);
                }
              }}
              onBlur={() => {
                setValue((prev) =>
                  prev === "" ? 0 : parseInt(prev as string, 10)
                );
              }}
            />
            <img
              src="/garden/ICP.png"
              alt="ICP"
              className="max-w-none max-h-none m-0 w-6 absolute right-3"
            />
          </div>
          {/* DESCRIPTIONS */}
          <div className="flex flex-col justify-start items-start gap-1 w-full">
            <p className="font-poppins text-whiteSoft font-medium text-sm">
              Donation for Reforestation
            </p>
            <p className="font-poppins text-whiteSoft font-medium text-sm">
              Managed by EcoBuddy
            </p>
            <p className="font-poppins text-whiteSoft font-medium text-sm">
              Support Global Reforestation
            </p>
          </div>
          {/* ACTION */}
          <div className="flex flex-col w-full justify-center items-start">
            <button
              typeof="button"
              onClick={handlerDonate}
              disabled={loading}
              className={`w-full bg-greenMain rounded-full font-poppins text-darkMain text-base font-semibold px-8 py-2 ${
                loading ? "bg-[#21c073]" : "bg-greenMain"
              }`}
            >
              {loading ? "Processing" : "Donate Now"}
            </button>
            <p className="font-poppins text-red-400 text-sm mt-1">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
