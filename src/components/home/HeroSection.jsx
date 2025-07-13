import { Link } from "react-router";

import heroImg from "../../assets/hero.png";

const HeroSection = () => {
    return (
        <section
            className="relative h-screen bg-hero bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImg}')` }}
        >
            {/* Overlay for text readability (optional, adjust opacity as needed) */}
            <div className="absolute inset-0 bg-black opacity-40"></div>

            <div className="relative z-10 flex h-full items-center px-4 md:px-8 lg:px-16">
                <div className="container w-full max-w-2xl text-white flex flex-col justify-center">
                    {/* Header Text with animation */}
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Unlock Your Potential with Top Exam Prep
                    </h1>

                    {/* Descriptive Paragraph with animation */}
                    <p
                        className="text-lg md:text-xl mb-8 animate-fade-in-up"
                        style={{ animationDelay: "0.4s" }}
                    >
                        Prepare effectively for WAEC, NECO, and UTME with our
                        comprehensive resources, expert guidance, and a modern
                        learning experience designed for your success.
                    </p>

                    {/* Call to Action Button with hover effect and animation */}
                    <Link
                        to="/exam-question-explorer"
                        className="self-start bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up"
                        style={{ animationDelay: "0.6s" }}
                    >
                        Start Your Journey Now
                    </Link>
                </div>
                {/* The right side is implicitly occupied by the background image featuring the student */}
            </div>
        </section>
    );
};

export default HeroSection;
