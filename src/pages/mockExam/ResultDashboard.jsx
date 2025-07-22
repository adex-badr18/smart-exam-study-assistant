import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { MathJax } from "better-react-mathjax";
import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Cell,
    Legend,
    Tooltip,
} from "recharts";
import { formatTitle } from "../../utils/formatting";
import Spinner from "../../components/Spinner";
import ReviewQuestionCard from "./components/ReviewQuestionCard";

// Assuming you'll create these later: useReviewExplanation and useStrengthsWeaknesses hooks

const ResultDashboard = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const {
        questions,
        selectedAnswers,
        questionTimes,
        formData,
        isAutoSubmit,
    } = state;

    console.log(state);

    // States for AI explanation modal
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [explanationContent, setExplanationContent] = useState("");
    const [isExplanationLoading, setIsExplanationLoading] = useState(false);

    // States for strengths and weaknesses (will be populated by AI hook later)
    const [strengthsWeaknesses, setStrengthsWeaknesses] = useState({
        strengths: [],
        weaknesses: [],
    });
    const [isSWLoading, setIsSWLoading] = useState(false);

    // Data Processing for result and performance metrics
    const calculateMetrics = useCallback(() => {
        if (!questions || questions?.length === 0) {
            return {
                totalScore: 0,
                accuracy: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                unansweredQuestions: 0,
                totalTimeSpent: 0,
                performanceByTopic: {},
            };
        }

        let correctCount = 0;
        let incorrectCount = 0;
        let unansweredCount = 0;
        let totalTime = 0;
        const topicPerformance = {}; // {'Algebra': {correct: 0, total: 0, time: 0}, ...}

        questions?.forEach((q, index) => {
            const selectedAnswerIndex = selectedAnswers[index];
            const correctAnswerText = q.answer;
            const questionTopic = q.topicTag || "General"; // Default topic if not provided by AI

            // Initialize topic if not exist
            if (!topicPerformance[questionTopic]) {
                topicPerformance[questionTopic] = {
                    correct: 0,
                    total: 0,
                    time: 0,
                };
            }

            // Track time spent
            totalTime += questionTimes[index] || 0;
            topicPerformance[questionTopic].time += questionTimes[index] || 0;

            // Check answer correctness
            if (selectedAnswerIndex !== null) {
                // Compare selected option texxt with correct answer text
                const selectedOptionText = q.options[selectedAnswerIndex];
                if (correctAnswerText === selectedOptionText) {
                    correctCount++;
                    topicPerformance[questionTopic].correct++;
                } else {
                    incorrectCount++;
                }
            } else {
                unansweredCount++;
            }

            topicPerformance[questionTopic].total++;
        });

        const totalQuestions = questions.length;
        const score = correctCount;
        const accuracy =
            totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

        return {
            totalScore: score,
            accuracy: accuracy.toFixed(2), // Round to 2 decimal places
            correctAnswers: correctCount,
            incorrectAnswers: incorrectCount,
            unansweredQuestions: unansweredCount,
            totalTimeSpent: totalTime,
            performanceByTopic: topicPerformance,
        };
    }, [questions, selectedAnswers, questionTimes]);

    const metrics = calculateMetrics();

    // Data for Pie Chart
    const pieChartData = [
        { name: "Correct", value: metrics.correctAnswers },
        { name: "Incorrect", value: metrics.incorrectAnswers },
        { name: "Unanswered", value: metrics.unansweredQuestions },
    ];
    const PIE_COLORS = ["#4CAF50", "#F44336", "#FFC107"]; // Green, Red, Amber

    // Metrics Card Data
    const metricsCardData = {
        totalScore: `${metrics.totalScore} / ${questions.length}`,
        accuracy: `${metrics.accuracy}%`,
        totalTimeSpent: `${Math.floor(metrics.totalTimeSpent / 60)
            .toString()
            .padStart(2, "0")}:${(metrics.totalTimeSpent % 60)
            .toString()
            .padStart(2, "0")}`,
        correctAnswers: metrics.correctAnswers,
        incorrectAnswers: metrics.incorrectAnswers,
        unanswered: metrics.unansweredQuestions,
    };

    // AI Explanation Logic (Placeholder for now)
    const handleExplanation = useCallback(
        async (question, selectedAnswerIndex) => {
            setIsExplanationLoading(true);
            setShowExplanationModal(true);
            setExplanationContent("Generating explanation...");

            try {
                // In a real implementation, call an API here to get explanation

                // Mocking AI response for now
                await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
                // setExplanationContent(
                //     `AI Explanation for Q${question.questionText.slice(
                //         0,
                //         50
                //     )}...\n\nThis is a detailed AI-generated explanation based on your performance. The correct answer was "${
                //         question.answer
                //     }". You selected "${
                //         selectedAnswerIndex !== null
                //             ? question.options[selectedAnswerIndex]
                //             : "no option"
                //     }". \n\nThe original explanation was: ${
                //         question.explanation
                //     }`
                // );

                setExplanationContent(question.explanation);
            } catch (error) {
                console.error("Error generating explanation:", error);
                setExplanationContent(
                    "Failed to generate explanation. Please try again."
                );
            } finally {
                setIsExplanationLoading(false);
            }
        },
        []
    );

    const handleCloseExplanationModal = useCallback(() => {
        setShowExplanationModal(false);
        setExplanationContent("");
    }, []);

    const handleStartNewExam = useCallback(() => {
        navigate("/mock-exam");
    }, [navigate]);

    // AI Strengths & Weaknesses Logic (Placeholder for now)
    useEffect(() => {
        const fetchStrengthsWeaknesses = async () => {
            setIsSWLoading(true);

            try {
                // Call the API to generate strengths and weaknesses

                // Mocking AI response for now
                await new Promise((resolve) => setTimeout(resolve, 2000)); //Simulate API call
                setStrengthsWeaknesses({
                    strengths: [
                        "Strong in Algebra (if applicable)",
                        "Good time management on simpler questions.",
                    ],
                    weaknesses: [
                        "Needs improvement in Geometry (if applicable)",
                        "Struggles with complex word problems.",
                        "Spends too much time on difficult questions.",
                    ],
                });
            } catch (error) {
                console.error(
                    "Error generating strengths and weaknesses:",
                    error
                );
                setStrengthsWeaknesses({
                    strengths: ["Could not generate insights."],
                    weaknesses: ["Please try again later."],
                });
            } finally {
                setIsSWLoading(false);
            }
        };

        // Only fetxh if questions exists and we haven't already loaded it or are loading
        if (
            questions &&
            questions.length > 0 &&
            !isSWLoading &&
            strengthsWeaknesses.strengths.length === 0
        ) {
            fetchStrengthsWeaknesses();
        }
    }, [
        questions,
        formData,
        metrics.totalScore,
        metrics.performanceByTopic,
        metrics.totalTimeSpent,
        strengthsWeaknesses.strengths.length,
        isSWLoading,
    ]);

    // If no questions are passed, redirect to the explorer index
    if (!questions || questions?.length === 0) {
        // addToast("No questions generated. Please try again.", "error");

        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    No exam result and performance analysis found.
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Please return to the Mock Exam Home to get started.
                </p>
                <button
                    onClick={() => navigate("/mock-exam")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg
                     hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md
                     focus:outline-none"
                >
                    Return to Mock Exam Home
                </button>
                <p className="mt-4 text-sm text-gray-500">
                    If you need assistance, please contact support.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                Mock Exam Results
            </h1>

            {isAutoSubmit && (
                <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md mb-8 text-center text-lg font-semibold">
                    Your exam was automatically submitted due to time running
                    out!
                </div>
            )}

            {/* Exam Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {Object.entries(metricsCardData).map(([key, value]) => {
                        let bgColorClass = "";
                        let textColorClass = "";

                        if (key === "totalScore") {
                            bgColorClass = "bg-blue-50";
                            textColorClass = "text-blue-600";
                        } else if (key === "accuracy") {
                            bgColorClass = "bg-purple-50";
                            textColorClass = "text-purple-600";
                        } else if (key === "totalTimeSpent") {
                            bgColorClass = "bg-yellow-50";
                            textColorClass = "text-yellow-600";
                        } else if (key === "correctAnswers") {
                            bgColorClass = "bg-green-50";
                            textColorClass = "text-green-600";
                        } else if (key === "incorrectAnswers") {
                            bgColorClass = "bg-red-50";
                            textColorClass = "text-red-600";
                        } else if (key === "unanswered") {
                            bgColorClass = "bg-orange-50";
                            textColorClass = "text-orange-600";
                        }

                        return (
                            <div
                            key={key}
                                className={`${bgColorClass} p-4 rounded-lg text-center`}
                            >
                                <p className="text-lg text-gray-700">
                                    {formatTitle(key)}
                                </p>
                                <p
                                    className={`text-3xl font-bold ${textColorClass}`}
                                >
                                    {value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <p className="text-lg text-gray-700 text-center">
                    <span className="font-semibold">Exam Type:</span>{" "}
                    {formData?.examType || "N/A"} |{" "}
                    <span className="font-semibold">Subject:</span>{" "}
                    {formData?.subject}
                    {formData?.topic && formData?.topic !== "Any Topic" && (
                        <>
                            {" "}
                            | <span className="font-semibold">Topic:</span>{" "}
                            {formData?.topic}
                        </>
                    )}
                </p>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Answer Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) =>
                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                }
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            PIE_COLORS[
                                                index % PIE_COLORS.length
                                            ]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Strengths and Weaknesses (AI-generated) */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Strengths & Weaknesses
                    </h2>
                    {isSWLoading ? (
                        <div className="text-center text-gray-600">
                            <Spinner
                                secondaryText="Generating insights..."
                                borderClass="border-gray-800"
                            />
                        </div>
                    ) : (
                        <>
                            {strengthsWeaknesses.strengths.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-green-700 mb-2">
                                        Strengths:
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {strengthsWeaknesses.strengths.map(
                                            (s, index) => (
                                                <li key={index} className="">
                                                    {s}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                            {strengthsWeaknesses.weaknesses.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-red-700 mb-2">
                                        Weaknesses:
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {strengthsWeaknesses.weaknesses.map(
                                            (w, index) => (
                                                <li key={index} className="">
                                                    {w}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                            {strengthsWeaknesses.strengths.length === 0 &&
                                strengthsWeaknesses.weaknesses.length === 0 && (
                                    <p className="text-gray-600 text-center">
                                        No specific strengths or weaknesses
                                        identified yet.
                                    </p>
                                )}
                        </>
                    )}
                </div>
            </div>

            {/* Question Review Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Question Review
                </h2>
                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <ReviewQuestionCard
                            key={index}
                            question={q}
                            index={index}
                            selectedOptionIndex={selectedAnswers[index]}
                            questionTime={questionTimes[index]}
                            handleExplainQuestion={handleExplanation}
                        />
                    ))}
                </div>
            </div>

            {/* Button to start a new mock exam */}
            <div className="text-center mt-10">
                <button
                    onClick={handleStartNewExam}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Start New Mock Exam
                </button>
            </div>

            {/* AI Explanation Modal */}
            {showExplanationModal &&
                createPortal(
                    <div className="fixed inset-0 bg-gray-800 flex items-center justify-center z-[1000]">
                        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full text-center p-8 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Explanation
                            </h3>
                            {isExplanationLoading ? (
                                <Spinner
                                    secondaryText="Generating explanation..."
                                    borderClass="border-gray-800"
                                />
                            ) : (
                                <p className="text-gray-700 whitespace-pre-wrap text-left">
                                    <MathJax>{explanationContent}</MathJax>
                                </p>
                            )}
                            <button
                                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300 ease-in-out"
                                onClick={handleCloseExplanationModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default ResultDashboard;
