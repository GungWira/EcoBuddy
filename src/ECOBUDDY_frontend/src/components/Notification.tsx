import { useEffect, useState } from "react";

interface NotificationProps {
  id: number;
  isExp: boolean;
  countExp?: number;
  text?: string;
  onClose: (id: number) => void;
}

export default function Notification({
  id,
  isExp,
  countExp,
  text,
  onClose,
}: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 300); // Hapus setelah animasi selesai
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } w-fit flex justify-between items-center gap-4 px-4 py-2 md:py-3 rounded-md border border-greenMain bg-[#104E30] shadow-lg`}
    >
      <div className="flex flex-row justify-start items-start gap-2">
        <div className="w-5 md:w-6 overflow-hidden flex justify-center items-center rounded-md">
          <img
            src={isExp ? "/home/alertExp.svg" : "/home/alertInformation.svg"}
            alt="Icon"
            className="max-w-none max-h-none m-0 w-full h-fit"
          />
        </div>
        <p className="font-poppins text-white text-sm md:text-base font-semibold">
          {isExp ? `+${countExp} Exp Gained` : text}
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="bg-transparent w-3 md:w-4 flex justify-center items-center cursor-pointer"
      >
        <img
          src="/home/alertClose.svg"
          alt="Close Icon"
          className="w-5 max-w-none max-h-none m-0"
        />
      </button>
    </div>
  );
}
