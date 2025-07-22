// import { memo, useRef, useEffect } from "react";

// const QuestionDisplay = memo(
//     ({
//         question,
//         currentQuestionIndex,
//         selectedAnswerIndex,
//         handleAnswerSelect,
//     }) => {
//         //   Construct HTML for the question and options
//         const questionHtml = `
//         <h3 class="text-xl font-semibold text-gray-900 mb-4">
//             Q${currentQuestionIndex + 1}: ${
//             question.questionText || "No question text available"
//         }
//         </h3>
//         <div class="space-y-3">
//             ${
//                 question.options && question.options.length > 0
//                     ? question.options
//                           .map(
//                               (option, optIndex) => `
//                 <button
//                     data-option-index="${optIndex}"
//                     class="w-full text-left p-3 rounded-lg border-2 ${
//                         selectedAnswerIndex === optIndex
//                             ? "bg-blue-500 text-white border-blue-600 shadow-md"
//                             : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
//                     } transition duration-200 ease-in-out focus:outline-none focus:ring-blue-500 focus:ring-offset-2">
//                     <span class="font-medium mr-2">${String.fromCharCode(
//                         65 + optIndex
//                     )}.</span>
//                     ${option || "No option available"}
//                 </button>`
//                           )
//                           .join("")
//                     : `<p class="text-gray-500">No options available for this question.</p>`
//             }
//         </div>`;

//         // Use a ref for the container to attach a single click event listener for option selection
//         const optionsContainerRef = useRef(null);

//         // Attach a single click event listener to the container instead of each option button
//         useEffect(() => {
//             const container = optionsContainerRef.current;
//             if (!container) return;

//             const handleOptionClick = (event) => {
//                 const button = event.target.closest(
//                     "button[data-option-index]"
//                 );
//                 if (button) {
//                     const optionIndex = parseInt(
//                         button.dataset.optionIndex,
//                         10
//                     );
//                     handleAnswerSelect(optionIndex);
//                 }
//             };

//             container.addEventListener("click", handleOptionClick);

//             return () => {
//                 container.removeEventListener("click", handleOptionClick);
//             };
//         }, [handleAnswerSelect]);

//         return (
//             <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
//                 {question.imageUrl && (
//                     <div className="mb-4 flex justify-center">
//                         <img
//                             src={question.imageUrl}
//                             alt={
//                                 question.imageAltText ||
//                                 "Diagram for the question"
//                             }
//                             className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
//                             onError={(e) => {
//                                 e.target.onerror = null; // Prevent infinite loop
//                                 e.target.src =
//                                     "https://placehold.co/600x400/cccccc/000000?text=Image+Not+Available";
//                             }}
//                         />
//                     </div>
//                 )}

//                 {/* Render the entire question and options block with one MathJax instance */}
//                 {/* MathJax will process all LaTeX within this dangerouslySetInnerHTML content */}
//                 <MathJax dynamic={true}>
//                     <div
//                         ref={optionsContainerRef}
//                         dangerouslySetInnerHTML={{ __html: questionHtml }}
//                     />
//                 </MathJax>

//                 {/* Clear Selected Answer Button */}
//                 {selectedAnswerIndex !== null && (
//                     <button
//                         onClick={() => handleAnswerSelect(null)} // Pass null to clear selection
//                         className="mt-6 px-5 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//                     >
//                         Clear Selected Answer
//                     </button>
//                 )}
//             </div>
//         );
//     }
// );

// export default QuestionDisplay;

import { memo, useRef, useEffect } from "react";
import { MathJax } from "better-react-mathjax"; // Ensure MathJax is imported if used here directly

const QuestionDisplay = memo(
    ({
        question,
        currentQuestionIndex,
        selectedAnswerIndex,
        handleAnswerSelect,
    }) => {
        //   Construct HTML for the question and options
        const questionHtml = `
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Q${currentQuestionIndex + 1}: ${
            question.questionText || "No question text available"
        }
        </h3>
        <div class="space-y-3">
            ${
                question.options && question.options.length > 0
                    ? question.options
                          .map(
                              (option, optIndex) => `
                <button
                    data-option-index="${optIndex}"
                    class="w-full text-left p-3 rounded-lg border-2 ${
                        selectedAnswerIndex === optIndex
                            ? "bg-blue-500 text-white border-blue-600 shadow-md"
                            : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200" // Fixed: bg-grey-100 to bg-gray-100
                    } transition duration-200 ease-in-out focus:outline-none focus:ring-blue-500 focus:ring-offset-2">
                    <span class="font-medium mr-2">${String.fromCharCode(
                        65 + optIndex
                    )}.</span>
                    ${option || "No option available"}
                </button>` // FIXED: Changed <button> to </button> for closing tag
                          )
                          .join("")
                    : `<p class="text-gray-500">No options available for this question.</p>`
            }
        </div>`;

        // Use a ref for the container to attach a single click event listener for option selection
        const optionsContainerRef = useRef(null);

        // Attach a single click event listener to the container instead of each option button
        useEffect(() => {
            const container = optionsContainerRef.current;
            if (!container) return;

            const handleOptionClick = (event) => {
                const button = event.target.closest(
                    "button[data-option-index]"
                );
                if (button) {
                    const optionIndex = parseInt(
                        button.dataset.optionIndex,
                        10
                    );
                    handleAnswerSelect(optionIndex);
                }
            };

            container.addEventListener("click", handleOptionClick);

            return () => {
                container.removeEventListener("click", handleOptionClick);
            };
        }, [handleAnswerSelect]);

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                {question.imageUrl && (
                    <div className="mb-4 flex justify-center">
                        <img
                            src={question.imageUrl}
                            alt={
                                question.imageAltText ||
                                "Diagram for the question"
                            }
                            className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src =
                                    "https://placehold.co/600x400/cccccc/000000?text=Image+Not+Available";
                            }}
                        />
                    </div>
                )}

                {/* Render the entire question and options block with one MathJax instance */}
                {/* MathJax will process all LaTeX within this dangerouslySetInnerHTML content */}
                <MathJax dynamic={true}>
                    <div
                        ref={optionsContainerRef}
                        dangerouslySetInnerHTML={{ __html: questionHtml }}
                    />
                </MathJax>

                {/* Clear Selected Answer Button */}
                {selectedAnswerIndex !== null && (
                    <button
                        onClick={() => handleAnswerSelect(null)} // Pass null to clear selection
                        className="mt-6 px-5 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" // Fixed: focus:rind-red-500 to focus:ring-red-500
                    >
                        Clear Selected Answer
                    </button>
                )}
            </div>
        );
    }
);

export default QuestionDisplay;