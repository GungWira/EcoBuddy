import { useEffect, useState } from "react";
import CardNews from "../../components/News/CardNews";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

export default function News() {
  const { authUser, callFunction } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 12;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await callFunction.getNews();
        const datas = await JSON.parse(res);
        console.log(datas.posts);
        setNews(datas.posts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (callFunction) {
      fetchNews();
    }
  }, [callFunction]);

  // Pagination logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(news.length / newsPerPage);

  return (
    <div className="bg-darkMain w-full relative pb-24">
      <div className="min-w-screen min-h-screen bg-mainBackground bg-4 px-4 md:px-8 flex flex-col justify-start items-center">
        {/* BACK BUTTON */}
        <div className="flex justify-start items-start w-full my-8">
          <Link
            to={"/"}
            className="flex flex-row justify-center items-center gap-2 py-2 ps-3 pe-6  sm:ps-4 sm:pe-8 bg-greenMain rounded-xl"
          >
            <div className="w-3 md:w-6 aspect-square overflow-hidden">
              <img
                src="/news/back.svg"
                alt="Back Icon"
                className="max-w-none max-h-none m-0 w-full h-fit"
              />
            </div>
            <p className="font-poppins text-darkMain text-xs sm:text-sm font-medium">
              Back
            </p>
          </Link>
        </div>
        {/* TITLE */}
        <div className="flex flex-col w-full justify-center items-center gap-2">
          <div className="w-16 aspect-square overflow-hidden">
            <img
              src="/news/logo.svg"
              alt="Logo Icon"
              className="max-w-none max-h-none m-0 w-full h-fit"
            />
          </div>
          <h1 className="font-poppins text-white font-3xl font-bold text-center">
            <span className="text-greenMain">Eco</span> News
          </h1>
          <p className="text-[#cbcbcb] text-center font-poppins text-sm sm:text-sm md:text-base sm:text-center mb-2 max-w-96 w-full">
            Discover the latest environmental news, green innovations, and real
            actions for our planet.
          </p>
        </div>
        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center w-full mt-8">
            <div className="w-10 h-10 border-4 border-greenMain border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* NEWS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full mt-8 max-w-6xl justify-stretch items-stretch gap-3">
          {currentNews.map((item: any, key) => (
            <CardNews
              title={item.title}
              description={item.headline}
              key={key}
              imageUrl={item.image}
              linkTo={item.link}
              isLoading={loading}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {!loading && news.length != 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-transparent flex flex-row justify-center items-center gap-2 text-white disabled:opacity-40 font-poppins text-sm"
            >
              <div className="w-2 aspect-square overflow-hidden">
                <img
                  src="/news/prev.svg"
                  alt="Prev Icon"
                  className="max-w-none max-h-none m-0 w-full h-fit"
                />
              </div>
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-lg font-poppins text-sm  ${
                  currentPage === index + 1
                    ? "bg-greenMain text-darkMain"
                    : "bg-transparent opacity-50 text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-transparent flex flex-row justify-center items-center gap-2 text-white disabled:opacity-40 font-poppins text-sm"
            >
              Next
              <div className="w-2 aspect-square overflow-hidden">
                <img
                  src="/news/next.svg"
                  alt="Prev Icon"
                  className="max-w-none max-h-none m-0 w-full h-fit"
                />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
