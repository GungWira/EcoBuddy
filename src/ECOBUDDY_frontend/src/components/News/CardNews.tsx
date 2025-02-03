import { Link } from "react-router-dom";

interface CardNewsProps {
  key: number;
  title: string;
  description: string;
  imageUrl: string;
  linkTo: string;
  isLoading: boolean;
}

export default function CardNews({
  key,
  title = "Trash Issue",
  description = "The news of trash issue around world",
  imageUrl,
  linkTo,
  isLoading,
}: CardNewsProps) {
  return (
    <Link
      to={
        "https://www.thejakartapost.com/" +
        linkTo.replace("https://jakpost.vercel.app/api/detailpost", "") +
        ".html"
      }
      className="w-full rounded-xl px-4 py-5 flex flex-col justify-start items-start gap-3 bg-darkSoft cursor-pointer"
      key={key}
    >
      <div className="w-full aspect-video bg-whiteSoft overflow-hidden flex justify-center items-center rounded-md">
        <img
          src={imageUrl}
          alt="Logo Icon"
          className="max-w-none max-h-none m-0 w-full h-fit"
        />
      </div>
      <h2 className="font-poppins text-left font-medium text-base md:text-xl text-white line-clamp-2">
        {title}
      </h2>
      <p className="text-[#cbcbcb] font-poppins text-sm sm:text-sm md:text-base mb-2 max-w-96 w-full line-clamp-3">
        {description}
      </p>
    </Link>
  );
}
