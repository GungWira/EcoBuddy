interface AboutCardProps {
  count: number;
  title: string;
  description: string;
}

export default function AboutCard({
  count,
  title,
  description,
}: AboutCardProps) {
  return (
    <div className="group flex flex-1 flex-col justify-start items-start gap-6 md:gap-8 rounded-lg bg-darkSoft ease-linear transition-all px-6 py-4 md:px-8 md:py-6 hover:bg-greenMain duration-200">
      <div className="flex justify-center items-center aspect-square rounded-full border border-white w-8 group-hover:bg-darkMain group-hover:border-darkMain transition-all ease-in duration-200">
        <p className="font-poppins text-white font-bold text-lg sm:text-xl md:text-2xl">
          {count}
        </p>
      </div>
      <div className="flex flex-col justify-start items-start w-full gap-2">
        <h2 className="text-white font-poppins font-semibold text-base sm:text-lg md:text-xl group-hover:text-darkMain transition-all ease-in duration-200">
          {title}
        </h2>
        <p className="text-white opacity-60 font-poppins text-xs sm:text-sm md:text-base group-hover:text-darkMain transition-all ease-in duration-200">
          {description}
        </p>
      </div>
    </div>
  );
}
