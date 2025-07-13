import { Link } from "react-router";
import heroImg from "../assets/hero-img.png";

import HeroSection from "../components/home/HeroSection";
import ExplorerFeatures from "../components/home/ExplorerFeatures";
import MockExamFeatures from "../components/home/MockExamFeatures";

const Home = () => {
    return (
        <div className="font-sans text-gray-800">
            <HeroSection />

            {/* Exam Explorer Section */}
            <ExplorerFeatures />

            {/* Mock Exam Section */}
            <MockExamFeatures />
        </div>
    );
};

export default Home;
