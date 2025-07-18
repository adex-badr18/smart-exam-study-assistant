import { useState, memo } from "react";
import { useLocation, useNavigate } from "react-router";
import { useToast } from "../../context/ToastProvider";
import { MathJax } from "better-react-mathjax";
import QuestionCard from "../../components/exam-question-explorer/QuestionCard";

const GeneratedQuestions = memo(() => {
    const { state } = useLocation();
    const { questions, formData } = state || {};
    const addToast = useToast().addToast;
    const navigate = useNavigate();

    const [revealedAnswers, setRevealedAnswers] = useState(new Set());
    const [showEndSessionModal, setShowEndSessionModal] = useState(false);

    const handleEndSessionClick = () => {
        setShowEndSessionModal(true);
    };

    const handleConfirmEndSession = () => {
        setShowEndSessionModal(false);
        navigate("/exam-question-explorer", { replace: true });
    };

    const handleCancelEndSession = () => {
        setShowEndSessionModal(false);
    };

    const toggleAnswerVisibility = (index) => {
        setRevealedAnswers((prev) => {
            const newRevealed = new Set(prev);
            if (newRevealed.has(index)) {
                newRevealed.delete(index);
            } else {
                newRevealed.add(index);
            }
            return newRevealed;
        });
    };

    console.log("Received questions:", questions);

    // If no questions are passed, redirect to the explorer index
    if (!questions || questions.length === 0) {
        // addToast("No questions generated. Please try again.", "error");

        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    No Questions Found
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Please go back to the form to generate questions.
                </p>
                <button
                    onClick={() => navigate("/exam-question-explorer")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg
                     hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md
                     focus:outline-none"
                >
                    Go Back to Explorer
                </button>
                <p className="mt-4 text-sm text-gray-500">
                    If you need assistance, please contact support.
                </p>
            </div>
        );
    }

    // Render the generated questions
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                Practice Questions
            </h1>

            {/* Display Question Session Info */}
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-lg">
                        <span className="font-semibold">Exam Type:</span>{" "}
                        {formData.examType || "N/A"}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Year:</span>{" "}
                        {formData.year || "N/A"}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Subject:</span>{" "}
                        {formData.subject || "N/A"}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">
                            Number of Questions:
                        </span>{" "}
                        {questions.length || "N/A"}
                    </p>
                </div>
                <button
                    onClick={handleEndSessionClick}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none cursor-pointer"
                >
                    End Session
                </button>
            </div>

            <div className="space-y-8">
                {questions.map((q, index) => {
                    const isAnswerRevealed = revealedAnswers.has(index);

                    return (
                        <QuestionCard
                            key={index}
                            q={q}
                            index={index}
                            isAnswerRevealed={isAnswerRevealed}
                            toggleAnswerVisibility={toggleAnswerVisibility}
                        />
                    );
                })}
            </div>

            {/* End Session Confirmation Modal */}
            {showEndSessionModal && (
                <div className="fixed inset-0 bg-gray-800 flex items-center justify-center z-[10000]">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full text-center">
                        <div className="p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                End Session?
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to end the current
                                practice session and return to the form?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleConfirmEndSession}
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold
                           hover:bg-red-600 transition duration-300 ease-in-out"
                                >
                                    Yes, End Session
                                </button>
                                <button
                                    onClick={handleCancelEndSession}
                                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold
                                hover:bg-gray-400 transition duration-300 ease-in-out"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default GeneratedQuestions;
