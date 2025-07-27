import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, ScrollRestoration } from "react-router";
import { MathJax } from "better-react-mathjax";
import { createPortal } from "react-dom";
import QuestionDisplay from "./QuestionDisplay";
import { TimerIcon } from "../../components/icons";
import ScrollToLocation from "../../components/ScrollToLocation";

const ExamPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { questions, formData } = location.state || {};

    console.log("ExamPage questions:", questions);
    // console.log("ExamPage formData:", formData);

    // States for exam progress and selected answers
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(
        Array(questions?.length).fill(null)
    ); // Stores selected option indices
    const [questionTimes, setQuestionTimes] = useState(
        Array(questions?.length).fill(0)
    ); // Stores cumulative time spent on each question

    // Global timer states
    const [totalTimeleft, setTotalTimeLeft] = useState(0); // Total time left for the exam
    const [examStarted, setExamStarted] = useState(false); // Flag to indicate if the exam has started
    const [examEnded, setExamEnded] = useState(false); // Flag to indicate if the exam has ended
    const globalTimerRef = useRef(null); // Ref to store the global timer interval
    const questionStartTimeRef = useRef(null); // Ref to store the timmestamp when the current question starts

    console.log("Total Time left:", totalTimeleft);
    console.log("Global Time Ref:", globalTimerRef);
    console.log("Selected Answers:", selectedAnswers);
    console.log("Question Times:", questionTimes);

    // Modal state for ending the exam
    const [showEndExamModal, setShowEndExamModal] = useState(false);

    // Calculate time per question based on exam type (used for total exam time calculation)
    const getTimePerQuestion = useCallback((examType) => {
        switch (examType) {
            case "WAEC":
            case "NECO":
                return 5; // 60 secs per question
            case "UTME":
                return 30; // 90 secs per question
            default:
                return 10; // defaults to 60 secs
        }
    });

    // Initialize exam, total timer, and first question start time
    useEffect(() => {
        if (!questions || questions?.length === 0) {
            return;
        }

        const initialTotalTime =
            questions?.length * getTimePerQuestion(formData?.examType);
        setTotalTimeLeft(initialTotalTime);
        setExamStarted(true);
        questionStartTimeRef.current = Date.now(); // Set start time for the very first question

        //   Cleanup question for initial mount
        // return () => {
        //     if (globalTimerRef.current) {
        //         clearInterval(globalTimerRef.current);
        //     }
        // };
    }, [questions?.length, formData?.examType, navigate]);

    // Function to record time for the current question
    const recordCurrentQuestionTime = useCallback(() => {
        if (questionStartTimeRef.current) {
            const timeSpentOnVisit = Math.floor(
                (Date.now() - questionStartTimeRef.current) / 1000
            ); // Time in secs for this visit
            setQuestionTimes((prevTimes) => {
                const newTimes = [...prevTimes];

                // Add timeSpentOnVisit to the existing cumulative time for this question
                newTimes[currentQuestionIndex] =
                    (newTimes[currentQuestionIndex] || 0) + timeSpentOnVisit;
                return newTimes;
            });
        }
    }, [currentQuestionIndex]); //Dependency on currentQuestionIndex to ensure correct array slot

    // Function to submit the entire exam
    const handleSubmitExam = useCallback(
        (isAutoSubmit = false) => {
            if (globalTimerRef.current) {
                clearInterval(globalTimerRef.current); // Stop the global timer
            }

            setExamEnded(true); // Mark exam as ended

            // Ensure time for the very last question is recorded if not already
            // This handles cases where exam ends by timer or manual submission on last question
            recordCurrentQuestionTime();

            // Navigate to results page with all necessary data
            navigate("/mock-exam/result", {
                state: {
                    questions,
                    selectedAnswers,
                    questionTimes,
                    formData, // Original form data for context
                    isAutoSubmit, // Indicate if it was an auto-submission
                },
            });
        },
        [
            questions,
            selectedAnswers,
            questionTimes,
            formData,
            navigate,
            recordCurrentQuestionTime,
        ]
    );

    // Global Timer logic
    useEffect(() => {
        if (examStarted && !examEnded && totalTimeleft > 0) {
            if (!globalTimerRef.current) {
                globalTimerRef.current = setInterval(() => {
                    setTotalTimeLeft((prevTime) => {
                        // Check inside the interval if time has run out
                        if (prevTime <= 1) {
                            // If next tick will be 0 or less
                            clearInterval(globalTimerRef.current); // Stop the timer immediately
                            globalTimerRef.current = null; // Clear the globalTimerRef
                            handleSubmitExam(true); // Auto-submit the exam
                            return 0; //Ensure time is exactly 0
                        }

                        return prevTime - 1; // Otherwise decrement time
                    });
                }, 1000);
            }
        } else if (totalTimeleft <= 0 && examStarted && !examEnded) {
            // This condition is a fallback, primarily for initial renders if time starts at 0 or less,
            // but the main logic for auto-submit is now inside the setInterval.
            // Ensure timer is cleared if it wasn't already.
            if (globalTimerRef.current) {
                clearInterval(globalTimerRef.current);
                globalTimerRef.current = null;
            }

            // Only submit if not already ended to prevent multiple submissions
            if (!examEnded) {
                handleSubmitExam(true);
            }
        }

        // Cleanup interval on component unmount or state change
        return () => {
            if (globalTimerRef.current) {
                clearInterval(globalTimerRef.current);
                globalTimerRef.current = null;
            }
        };
    }, [examStarted, examEnded, handleSubmitExam]);

    // Effect to manage body overflow when modal is open
    useEffect(() => {
        if (showEndExamModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showEndExamModal]);

    // Function to handle answer selection
    const handleAnswerSelect = useCallback((optionIndex) => {
        setSelectedAnswers(
            (prevAnswers) => {
                const newAnswers = [...prevAnswers];
                newAnswers[currentQuestionIndex] = optionIndex;
                return newAnswers;
            },
            [currentQuestionIndex]
        );
    });

    // Handle modal actions
    const handleConfirmEndExam = useCallback(() => {
        setShowEndExamModal(false);
        handleSubmitExam(false); // Manual submission confirmed
    }, [handleSubmitExam]);

    const handleCancelEndExam = useCallback(() => {
        setShowEndExamModal(false);
    }, []);

    // Function to handle moving to the next question or submitting
    const handleNextQuestion = useCallback(
        (autoSubmit = false) => {
            recordCurrentQuestionTime(); // Record time for the question just completed

            if (currentQuestionIndex < questions?.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                questionStartTimeRef.current = Date.now(); // Reset start time for the new question
            } else if (!autoSubmit) {
                // Only show modal if manually submitting on last question
                // Open modal on last question, trigger manual submission
                setShowEndExamModal(true);
            } else {
                // Auto-submit on time-out for last question
                handleSubmitExam(true);
            }
        },
        [
            currentQuestionIndex,
            questions?.length,
            recordCurrentQuestionTime,
            handleSubmitExam,
        ]
    );

    // Function to handle moving to the previous question
    const handlePreviousQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            recordCurrentQuestionTime(); // Record time for current question before going back
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            questionStartTimeRef.current = Date.now(); // Reset start time for the new (previous) question
        }
    }, [currentQuestionIndex, recordCurrentQuestionTime]);

    // Function to jump to a specific question
    const handleQuestionJump = useCallback(
        (questionIndex) => {
            if (
                questionIndex !== currentQuestionIndex &&
                questionIndex >= 0 &&
                questionIndex < questions?.length
            ) {
                recordCurrentQuestionTime(); // Record time for the question we are leaving
                setCurrentQuestionIndex(questionIndex);
                questionStartTimeRef.current = Date.now(); // Reset start time for the question we are jumping to
            }
        },
        [currentQuestionIndex, questions?.length, recordCurrentQuestionTime]
    );

    // If no questions are passed, redirect to the explorer index
    if (!questions || questions?.length === 0 || !examStarted) {
        // addToast("No questions generated. Please try again.", "error");

        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Loading mock exam questions...
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    If you are not redirected, please return to the Mock Exam
                    Home to select your exam preferences.
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

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswerIndex = selectedAnswers[currentQuestionIndex];

    return (
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                Mock Exam Session
            </h1>

            <div
                className={`fixed top-30 right-20 z-50 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-xl font-bold ${
                    totalTimeleft <= 20
                        ? "bg-red-200 text-red-600"
                        : "bg-green-200 text-green-800"
                }`}
            >
                <TimerIcon />
                {Math.floor(totalTimeleft / 60)
                    .toString()
                    .padStart(2, "0")}
                :{(totalTimeleft % 60).toString().padStart(2, "0")}
            </div>

            {/* Exam Info */}
            <div className="bg-blue-100 text-blue-800 p-4 text-lg rounded-lg shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="">
                    <span className="font-semibold">Subject:</span>{" "}
                    {formData.subject || "N/A"}
                </p>

                <p className="">
                    <span className="font-semibold">Question:</span>{" "}
                    {currentQuestionIndex + 1} / {questions?.length}
                </p>

                {formData.topic && formData.topic !== "Any Topic" && (
                    <p>
                        <span className="font-semibold">Topic:</span>{" "}
                        {formData.topic}
                    </p>
                )}
            </div>

            <ScrollToLocation
                dependencies={[currentQuestionIndex]}
                targetSelector="question-card"
            >
                {/* Question Navigation Grid */}
                <div
                    className="bg-white p-4 rounded-lg shadow-md mb-8 overflow-x-auto whitespace-nowrap"
                    id="question-card"
                >
                    <div className="inline-flex space-x-2 pb-2">
                        {questions.map((_, index) => {
                            const isAnswered = selectedAnswers[index] !== null;
                            const isCurrent = index === currentQuestionIndex;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionJump(index)}
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                                        isCurrent
                                            ? "bg-blue-600 text-white ring-2 ring-blue-400" // Current question
                                            : isAnswered
                                            ? "bg-green-500 text-white hover:bg-green-600" // Answered
                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300" // Unanswered
                                    } transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        isCurrent
                                            ? "ring-blue-500"
                                            : isAnswered
                                            ? "ring-green-400"
                                            : "ring-gray-300"
                                    }`}
                                    title={
                                        isAnswered
                                            ? `Question ${index + 1} (Answered)`
                                            : `Question ${
                                                  index + 1
                                              } (Unanswered)`
                                    }
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Current Question Display */}
                <QuestionDisplay
                    question={currentQuestion}
                    currentQuestionIndex={currentQuestionIndex}
                    selectedAnswerIndex={selectedAnswerIndex}
                    handleAnswerSelect={handleAnswerSelect}
                />

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {currentQuestionIndex < questions?.length - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowEndExamModal(true)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Exam
                        </button>
                    )}
                </div>
            </ScrollToLocation>

            {/* End Exam Confirmation Modal */}
            {showEndExamModal &&
                createPortal(
                    <div className="fixed inset-0 bg-gray-800 flex items-center justify-center z-[10000]">
                        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full text-center">
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    End Exam?
                                </h3>
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to submit your exam?
                                    You cannot make changes after submission.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handleConfirmEndExam}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300 ease-in-out"
                                    >
                                        Yes, Submit Exam
                                    </button>
                                    <button
                                        onClick={handleCancelEndExam}
                                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            <ScrollRestoration />
        </div>
    );
};

export default ExamPage;
