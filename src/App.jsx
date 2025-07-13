import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="">
            <h1 className="text-2xl text-amber-700">Welcome to Smart Exam Study Assistant</h1>
        </div>
    );
}

export default App;
