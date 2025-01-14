import { Link } from "react-router-dom";

export default function Navbar () {
    return (
        <>
            <nav className="fixed top-0 md:top-6 left-0 w-full flex justify-center items-center z-50">
                <div className="cover w-full md:max-w-[900px] md:w-[92%] md:rounded-full md:px-8 md:py-3 bg-[#202020]/50 backdrop-blur-lg px-4 py-5 flex justify-between items-center z-50">
                    {/* LOGO */}
                    <div className="flex flex-1 justify-start items-center">
                        <Link to={'/'} className="w-28">
                            <img src="/navbar/logo.svg" alt="Logo EcoBuddy" className="w-full"/>
                        </Link>
                    </div>
                    {/* MOBILE */}
                    {/* HAM MENU */}
                    <div className="flex flex-1 justify-end items-center md:hidden">
                        <button typeof="button" className="flex flex-col items-center justify-center w-10 h-10 cursor-pointer md:hidden">
                            <div className="w-6 h-0.5 bg-white mb-1"></div>
                            <div className="w-6 h-0.5 bg-white mb-1"></div>
                            <div className="w-6 h-0.5 bg-white"></div>
                        </button>
                    </div>
                    {/* DESKTOP */}
                    {/* NAVIGATION */}
                    <div className="hidden md:flex justify-center items-center gap-6 flex-1">
                        <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">Home</Link>
                        <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">About</Link>
                        <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">Services</Link>
                        <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium opacity-70">Pricing</Link>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex justify-end items-center flex-1">
                        <button  typeof="button" className="bg-greenMain text-darkMain text-base rounded-full px-5 py-2 font-poppins font-semibold">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* MOBILE NAVIGATION */}
            <div className="w-screen h-screen z-50 bg-darkMain px-4 py-12 flex flex-col justify-start items-start gap-8 md:hidden">
                <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium">Home</Link>
                <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium">About</Link>
                <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium">Services</Link>
                <Link to={'/'} className="font-poppins text-white text-sm md:text-base font-medium">Pricing</Link>
            </div>
        </>
    )
}