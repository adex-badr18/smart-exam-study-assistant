import { useState } from "react";
import { Link, NavLink } from "react-router";
import { CloseIcon, MenuIcon } from "./icons";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuList = [
        { name: "Home", path: "/" },
        { name: "Exam Explorer", path: "/exam-question-explorer" },
        { name: "Mock Exam", path: "/mock-exam" },
        // { name: "About", path: "/about" },
        // { name: "Contact", path: "/contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-4 sm:px-6 lg:py-6 flex justify-between items-center">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <a href="/" className="text-2xl font-bold text-gray-800">
                        <span className="text-blue-600">Exam</span>Prep
                    </a>
                </div>

                {/* Navigation Menu */}
                <div className="hidden md:flex justify-center flex-grow">
                    <ul className="flex space-x-8">
                        {menuList.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className="text-gray-800 hover:text-blue-600 font-medium transition-colors duration-300"
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <NavLink
                        to={`/exam-question-explorer`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Start Exam Prep
                    </NavLink>
                </div>

                {/* Mobile menu button - hamburger/close icon */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-800 focus:outline-none"
                    >
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>

                {/* Mobile menu overlay */}
                <div
                    className={`${
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    } fixed inset-0 w-full h-full z-40 bg-white transition-transform duration-300 ease-in-out md:hidden`}
                >
                    <div className="flex justify-between gap-4 p-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a
                                href="/"
                                className="text-2xl font-bold text-gray-800"
                            >
                                <span className="text-blue-600">Exam</span>Prep
                            </a>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="text-gray-800 focus:outline-none"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <ul className="flex flex-col space-y-4 mt-8 divide-y p-4">
                        {menuList.map((item) => (
                            <li key={item.name} className="pb-4">
                                <NavLink
                                    to={item.path}
                                    className="text-gray-800 hover:text-blue-600 text-center transition-colors duration-300 ease-in-out"
                                    onClick={toggleMenu}
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                        <li className="pt-4">
                            <NavLink
                                to={`/exam-question-explorer`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                onClick={toggleMenu}
                            >
                                Start Exam Prep
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
