import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                © 2023 Smart Exam Study Assistant
            </footer>
        </div>
    );
};

export default RootLayout;
