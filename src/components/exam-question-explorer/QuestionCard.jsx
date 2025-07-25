import { memo } from "react";
import { MathJax } from "better-react-mathjax";

const QuestionCard = memo(
    ({ q, index, isAnswerRevealed, toggleAnswerVisibility }) => {
        const questionId = `question-${index + 1}`; // Unique ID for each question

        // Construct the full question content as a single string for MathJax processing
        // We'll use template literals to build the HTML structure with LaTeX.
        // Note: We are building raw HTML strings here, which will be rendered using dangerouslySetInnerHTML.
        // This is generally safe as the content comes from our controlled AI model.
        // However, ensure that the content does not include any user-generated input to avoid XSS vulnerabilities.
        const questionContentHtml = `
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Q${index + 1}: ${q.questionText || "No question text available"}
            </h3>
            <div class="options">
                ${q.options
                    .map(
                        (option, optIndex) => `
                        <p class="option">
                            <span class="option-label">${String.fromCharCode(
                                65 + optIndex
                            )}.</span>
                            ${option || "No option text available"}
                        </p>`
                    )
                    .join("")}
            </div>
        `;

        const answerContentHtml = `
            <div class="bg-green-50 text-green-800 p-3 rounded-lg mb-3">
                <p class="font-semibold">
                    Correct Answer: ${q.answer || "No answer provided"}
                </p>
            </div>
            <div class="bg-blue-50 text-blue-800 p-3 rounded-lg">
                <p class="font-semibold">Explanation:</p>
                <p class="mt-1">
                    ${q.explanation || "No explanation provided"}
                </p>
            </div>
        `;

        return (
            <div key={questionId} className="bg-white p-6 rounded-lg shadow-md">
                {/* Conditionally render image if imageUrl exists */}
                {q.imageUrl && (
                    <div className="mb-4 flex justify-center">
                        <img
                            src={q.imageUrl}
                            alt={q.imageAltText || "Diagram for question"}
                            className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://placehold.co/600x400/cccccc/000000?text=Image+Load+Error";
                            }}
                        />
                    </div>
                )}

                {/* <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    <MathJax inline>
                        Q{index + 1}:{" "}
                        {q.questionText || "No question text available"}
                    </MathJax>
                </h3>
                <div className="mb-4 space-y-2">
                    {q.options && q.options.length > 0 ? (
                        q.options.map((option, optIndex) => (
                            <p key={optIndex} className="text-gray-700">
                                <span className="font-medium">
                                    {String.fromCharCode(65 + optIndex)}.{" "}
                                </span>
                                <MathJax inline>
                                    {option || "No option text available"}{" "}
                                </MathJax>
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-700">No options available</p>
                    )}
                </div> */}

                <MathJax dynamic={true}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: questionContentHtml,
                        }}
                    />
                </MathJax>

                {/* Button to toggle answer visibility */}
                <button
                    onClick={() => toggleAnswerVisibility(index)}
                    className="my-4 px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none"
                >
                    {isAnswerRevealed
                        ? "Hide Answer and Explanation"
                        : "Reveal Answer and Explanation"}
                </button>

                {/* Conditional rendering of Answer and Explanation */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isAnswerRevealed
                            ? "max-h-[20000px] opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <MathJax dynamic={true}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: answerContentHtml,
                            }}
                        />
                    </MathJax>
                    {/* <div className="bg-green-50 text-green-800 p-3 rounded-lg mb-3">
                        <p className="font-semibold">
                            <MathJax inline>
                                Correct Answer:{" "}
                                {q.answer || "No answer provided"}
                            </MathJax>
                        </p>
                    </div>
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg">
                        <p className="font-semibold">Explanation:</p>
                        <p className="mt-1">
                            <MathJax>
                                {q.explanation || "No explanation provided"}
                            </MathJax>
                        </p>
                    </div> */}
                </div>
            </div>
        );
    }
);

export default QuestionCard;
