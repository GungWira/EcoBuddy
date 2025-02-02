import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

export default function Navbar() {
  const [isMobileNavVisible, setMobileNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const sections = ["home", "about", "services", "pricing"];

  const handleToggleNav = () => setMobileNavVisible(!isMobileNavVisible);
  const handleCloseNav = () => setMobileNavVisible(false);

  // Scroll smooth ke section
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileNavVisible(false);
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observerCallback = (entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, [sections]);

  // LOGIN
  const { isAuth, login, logout } = useAuth();

  // if (!isAuth) {
  //   return null;
  // }

  return (
    <>
      <nav className="fixed top-0 md:top-6 left-0 w-full flex justify-center items-center z-50">
        <div className="cover w-full md:max-w-[900px] md:w-[92%] md:rounded-full md:px-8 md:py-3 bg-[#202020]/50 backdrop-blur-lg px-4 py-5 flex justify-between items-center z-50">
          {/* LOGO */}
          <div className="flex flex-1 justify-start items-center">
            <Link to="/" className="w-28">
              <img
                src="/navbar/logo.svg"
                alt="Logo EcoBuddy"
                className="w-full"
              />
            </Link>
          </div>

          {/* MOBILE */}
          {/* HAM MENU */}
          <div className="flex flex-1 justify-end items-center md:hidden">
            <button
              typeof="button"
              className="flex flex-col items-center justify-center w-10 h-10 cursor-pointer md:hidden"
              onClick={handleToggleNav}
            >
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
          </div>

          {/* DESKTOP */}
          {/* NAVIGATION */}
          <div className="hidden md:flex justify-center items-center gap-6 flex-1">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`font-poppins text-sm md:text-base font-medium flex flex-col justify-center items-center ${
                  activeSection === section
                    ? "text-white opacity-100"
                    : "text-white opacity-70"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <div className="w-1/2 h-[2px] bg-greenMain mt-1 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          <div className="hidden md:flex justify-end items-center flex-1">
            {isAuth ? (
              <>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white text-base rounded-full px-5 py-2 font-poppins font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="bg-greenMain text-darkMain text-base rounded-full px-5 py-2 font-poppins font-semibold"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE NAVIGATION */}
      <div
        className={`w-screen h-screen fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileNavVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TRIGGER CLOSE */}
        <div
          className="triggerClose w-screen h-screen bg-transparent absolute z-10"
          onClick={handleCloseNav}
        ></div>

        {/* NAVLINK */}
        <div className="w-4/5 h-screen fixed z-50 bg-darkSoft px-4 py-8 flex flex-col justify-between items-start gap-8">
          <div className="flex flex-col justify-start items-start w-full gap-8">
            <div className="flex flex-row justify-between items-center w-full gap-6 border-b pb-6 border-[#707070]">
              <Link to="/" className="w-28" onClick={handleCloseNav}>
                <img
                  src="/navbar/logo.svg"
                  alt="Logo EcoBuddy"
                  className="w-full"
                />
              </Link>
              <button
                typeof="button"
                className="bg-transparent w-6 aspect-square overflow-hidden flex justify-center items-center"
                onClick={handleCloseNav}
              >
                <img
                  src="/navbar/close.svg"
                  alt="Close EcoBuddy"
                  className="w-full"
                />
              </button>
            </div>
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(section)}
                  className={`group font-poppins py-2 text-base md:text-base font-semibold flex flex-row justify-start w-full items-center gap-4 ${
                    activeSection === section
                      ? "opacity-100 bg-greenMain text-darkMain rounded-lg px-3"
                      : "text-white opacity-70 hover:opacity-100 hover:bg-greenMain hover:text-darkMain hover:rounded-lg hover:px-3"
                  }`}
                >
                  {activeSection === section ? (
                    <img
                      src={`/navbar/${
                        section.charAt(0) + section.slice(1)
                      }-dark.svg`}
                      alt={`Icon EcoBuddy`}
                      className="max-w-4 m-0 group-hover:block"
                    />
                  ) : (
                    <img
                      src={`/navbar/${
                        section.charAt(0) + section.slice(1)
                      }-white.svg`}
                      alt={`Icon EcoBuddy`}
                      className="max-w-4 m-0 group-hover:hidden"
                    />
                  )}
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-[#707070] w-full">
            <Link
              to=""
              onClick={login}
              className="bg-greenMain w-full flex justify-center items-center rounded-lg font-poppins font-semibold text-darkMain py-2 text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
