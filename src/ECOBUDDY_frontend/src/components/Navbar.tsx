import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isMobileNavVisible, setMobileNavVisible] = useState(false);

    const handleToggleNav = () => setMobileNavVisible(!isMobileNavVisible);
    const handleCloseNav = () => setMobileNavVisible(false);

    return (
        <>
            <nav className="fixed top-0 md:top-6 left-0 w-full flex justify-center items-center z-50">
                <div className="cover w-full md:max-w-[900px] md:w-[92%] md:rounded-full md:px-8 md:py-3 bg-[#202020]/50 backdrop-blur-lg px-4 py-5 flex justify-between items-center z-50">
                    {/* LOGO */}
                    <div className="flex flex-1 justify-start items-center">
                        <Link to={'/'} className="w-28">
                            <img src="/navbar/logo.svg" alt="Logo EcoBuddy" className="w-full" />
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
                        <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">Home</Link>
                        <Link to={'#about'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">About</Link>
                        <Link to={'#services'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">Services</Link>
                        <Link to={'#pricing'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">Pricing</Link>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex justify-end items-center flex-1">
                        <button typeof="button" className="bg-greenMain text-darkMain text-base rounded-full px-5 py-2 font-poppins font-semibold">Get Started</button>
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
                <div className="triggerClose w-screen h-screen bg-transparent absolute z-10" onClick={handleCloseNav}></div>

                {/* NAVLINK */}
                <div className="w-4/5 h-screen fixed z-50 bg-darkSoft px-4 py-8 flex flex-col justify-between items-start gap-8">
                    <div className="flex flex-col justify-start items-start w-full gap-8">
                        <div className="flex flex-row justify-between items-center w-full gap-6 border-b pb-6 border-[#707070]">
                            <Link to={'/'} className="w-28" onClick={handleCloseNav}>
                                <img src="/navbar/logo.svg" alt="Logo EcoBuddy" className="w-full" />
                            </Link>
                            <button
                                typeof="button"
                                className="bg-transparent w-6 aspect-square overflow-hidden flex justify-center items-center"
                                onClick={handleCloseNav}
                            >
                                <img src="/navbar/close.svg" alt="Logo EcoBuddy" className="w-full" />
                            </button>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2 w-full">
                            <p className="font-poppins font-semibold text-white text-lg">Links</p>

                            {["Home", "About", "Service", "Pricing"].map((link, index) => (
                                <Link
                                    key={index}
                                    to={`#${link.toLowerCase()}`}
                                    className="group font-poppins text-white py-2 text-base md:text-base font-semibold flex flex-row justify-start w-full items-center gap-4 opacity-70 transition-all duration-300 hover:opacity-100 hover:bg-greenMain hover:text-darkMain hover:rounded-lg hover:px-3"
                                    onClick={handleCloseNav}
                                >
                                    <img src={`/navbar/${link.toLowerCase()}-white.svg`} alt={`${link} EcoBuddy`} className="max-w-4 m-0 group-hover:hidden" />
                                    <img src={`/navbar/${link.toLowerCase()}-dark.svg`} alt={`${link} EcoBuddy`} className="hidden max-w-4 m-0 group-hover:block" />

                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 border-t border-[#707070] w-full">
                        <Link to={"/login"} className="bg-greenMain w-full flex justify-center items-center rounded-lg font-poppins font-semibold text-darkMain py-2 text-lg">Get Started</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
