import { memo } from "react";
import { MathJax } from "better-react-mathjax";

const ReviewQuestionCard = memo(
    ({
        question,
        index,
        selectedOptionIndex,
        questionTime,
        handleExplainQuestion,
    }) => {
        const isCorrect =
            question.answer === question.options[selectedOptionIndex];
        const hasAnswered = selectedOptionIndex !== null;

        // Construct the HTML for the question text and all options with their respective styles
        const questionReviewHtml = `
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Q${index + 1}: ${
            question.questionText || "No question text available"
        }
        </h3>

        <div class="space-y-2 mb-4">
            ${
                question.options && question.options.length > 0
                    ? question.options
                          .map((option, optIndex) => {
                              let optionClass = "p-2 rounded-md border";
                              let labelClass = "ml-2 font-semibold";
                              let labelText = "";

                              if (optIndex === selectedOptionIndex) {
                                  // This is the user's selected answer
                                  if (isCorrect) {
                                      optionClass +=
                                          " bg-green-100 border-green-400 text-green-800";
                                      labelText = "(Your Correct Answer)";
                                      labelClass += " text-green-700";
                                  } else {
                                      optionClass +=
                                          " bg-red-100 border-red-400 text-red-800";
                                      labelText = "(Your Incorrect Answer)";
                                      labelClass += " text-red-700";
                                  }
                              } else if (question.answer === option) {
                                  // This is the correct answer, but user didn't select it
                                  optionClass +=
                                      " bg-blue-100 border-blue-400 text-blue-800";
                                  labelText = "(Correct Answer)";
                                  labelClass += " text-blue-700";
                              } else {
                                  // Other options
                                  optionClass +=
                                      " bg-gray-50 border-gray-200 text-gray-700";
                              }

                              return `
                        <p class="${optionClass}">
                            <span class="font-medium mr-2">${String.fromCharCode(
                                65 + optIndex
                            )}.</span>
                            ${option || "No option text available"}
                            ${
                                labelText
                                    ? `<span class="${labelClass}">${labelText}</span>`
                                    : ""
                            }
                        </p>
                    `;
                          })
                          .join("")
                    : '<p class="text-gray-700">No options available</p>'
            }
        </div>

        ${
            !hasAnswered
                ? '<p class="text-orange-700 font-semibold mb-3">You did not answer this question.</p>'
                : ""
        }

        <p class="text-gray-600 text-sm mb-3">
         Time Spent: ${questionTime || 0} seconds
        </p>
    `;

        return (
            <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
                {question.imageUrl && (
                    <div className="mb-4 flex justify-center">
                        <img
                            src={question.imageUrl}
                            alt={
                                question.imageAltText || "Diagram for question"
                            }
                            className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://placehold.co/600x400/cccccc/000000?text=Image+Load+Error";
                            }}
                        />
                    </div>
                )}

                {/* Render the entire question review block with one MathJax instance */}
                <MathJax dynamic={true}>
                    <div
                        dangerouslySetInnerHTML={{ __html: questionReviewHtml }}
                    />
                </MathJax>

                {/* Explain Button */}
                <button
                    onClick={() =>
                        handleExplainQuestion(question, selectedOptionIndex)
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    Explain
                </button>
            </div>
        );
    }
);

export default ReviewQuestionCard;
