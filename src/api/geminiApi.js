import { GoogleGenAI, Type } from "@google/genai/web";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const key = "AIzaSyB2tXcY9yRN7LSvuPwNbMBaFP1rJuSBaMQ";
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define the expected structure for a single question object
const questionSchema = {
    type: Type.OBJECT,
    properties: {
        questionText: { type: Type.STRING },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 4,
            maxItems: 4,
        },
        answer: { type: Type.STRING },
        explanation: { type: Type.STRING },
    },
    required: ["questionText", "options", "answer", "explanation"],
    propertyOrdering: ["questionText", "options", "answer", "explanation"],
};

// Define schema for the array of questions
const responseSchema = {
    type: Type.ARRAY,
    items: questionSchema,
};

/**
 * Calls the Gemini API to generate exam questions based on the provided formData.
 * @param {Object} formData - Object containing examType, subject, year, numQuestions.
 * @returns {promise<Array<Object>>} - Promise resolving to an array of generated question objects.
 */
export const generateExamQuestions = async (formData) => {
    const { examType, subject, year, numQuestions } = formData;

    // MODIFIED PROMPT: More precise instructions for LaTeX in explanations
    // const prompt = `Generate ${numQuestions} multiple-choice questions for the ${examType} ${subject} exam from the year ${year}. Each question should have exactly 4 options. The options should have no labels (such as A. or (A) or A). For all mathematical expressions, use LaTeX syntax. Use \\(...\\) for inline mathematical expressions (e.g., "If \\(x^2 + y^2 = r^2\\)...") and $$...$$ for display mathematical expressions.
    // If a question *requires* a diagram or image to be understood (e.g., geometry, diagrams, charts, graphs), **you MUST include an 'imageUrl' field and an 'imageAltText' field.** The 'imageUrl' should be a placeholder URL from 'https://placehold.co/600x400/cccccc/000000?text=**Descriptive+Image+Content**' where 'Descriptive+Image+Content' accurately describes the diagram needed (e.g., 'Triangle+ABC', 'Circuit+Diagram', 'Bar+Chart+Data'). The 'imageAltText' should also provide a clear, concise description of the diagram. If no image is needed, omit both 'imageUrl' and 'imageAltText' fields.
    // For each question, provide the question text, all four options, the correct answer (as one of the options), a detailed explanation for the correct answer, and both imageUrl and imageAltText if applicable.

    // All question texts should appear on a single line, and mathematical expressions found in the questionn text should be formatted using LaTeX syntax.

    // For example,
    // "Simplify: (16^(-1/4) * 8^(1/3)) / (4^(1/2) * 2^(-1))" should be formatted as "Simplify: \\((16^{-1/4} \\times 8^{1/3}) / (4^{1/2} \\times 2^{-1})\\)".
    // Explanation fields that contain **mathematical step, equation, or formula** should be detailed and contain mathematical steps, with each significant step or equation presented on a new line and enclosed in display math delimiters ($$...$$).
    // For example,
    // "To solve this problem, we can use the third equation of motion, which relates initial velocity, final velocity, acceleration, and displacement:
    // $$v^2 = u^2 + 2as$$
    // Where:
    // \\(v\\) is the final velocity
    // \\(u\\) is the initial velocity (since the car starts from rest, \\(u = 0\\))
    // \\(a\\) is the acceleration (\\(4.0\text{ m/s}^2\\))
    // \\(s\\) is the displacement (\\(50\text{ m}\\))

    // Substitute the given values into the equation:
    // $$v^2 = 0^2 + 2 \times 4.0 \times 50$$
    // $$v^2 = 0 + 400$$
    // $$v^2 = 400$$

    // To find \\(v\\), take the square root of both sides:
    // $$v = \sqrt{400}$$
    // $$v = 20.0\text{ m/s}$$"

    // If the final answer gotten in the explanation could not be found in the options, simply tell the user that the answer could not be found in the option, do not make any further manipulations to either the question or the options, simply fill the correct answer field with the answer gotten from the explanation with a descriptive message.

    // IMPORTANT: In the 'explanation' field, general explanatory sentences or definitions should NOT be enclosed in $$...$$ delimiters. For example, instead of:
    // "Producers are organisms that produce their own food, primarily through photosynthesis, using light energy and inorganic substances.
    // $$Autotrophs are organisms that can produce their own food, making them the primary producers in most ecosystems.$$
    // $$Carnivores are consumers that eat other animals.$$
    // $$Herbivores are primary consumers that eat plants.$$
    // $$Decomposers break down dead organic matter, recycling nutrients back into the ecosystem.$$"
    // It should be:
    // "Producers are organisms that produce their own food, primarily through photosynthesis, using light energy and inorganic substances.
    // Autotrophs are organisms that can produce their own food, making them the primary producers in most ecosystems.
    // Carnivores are consumers that eat other animals.
    // Herbivores are primary consumers that eat plants.
    // Decomposers break down dead organic matter, recycling nutrients back into the ecosystem."

    // The output MUST be a JSON array of objects, strictly following this schema.`;

    const prompt = `Generate ${numQuestions} multiple-choice questions for the ${examType} ${subject} exam from the year ${year}. Each question should have exactly 4 options. **IMPORTANT: Options MUST NOT include any labels like "A.", "(A)", or "A" within the option text itself.** For all mathematical expressions, use LaTeX syntax. Use \\(...\\) for inline mathematical expressions (e.g., "If \\(x^2 + y^2 = r^2\\)...") and $$...$$ for display mathematical expressions that are **equations, formulas, or calculations** and should be on their own line (e.g., "The formula is: $$E=mc^2$$").

        IMPORTANT: In the 'explanation' field, general explanatory sentences or definitions should be clearly separated by paragraph breaks (use double newlines for new paragraphs). Each significant **mathematical step, equation, or formula** should be presented on a new line and enclosed in display math delimiters ($$...). General explanatory sentences or definitions should NOT be enclosed in $$...$$ delimiters. For example, instead of:
        "Producers are organisms that produce their own food, primarily through photosynthesis, using light energy and inorganic substances.
        $$Autotrophs are organisms that can produce their own food, making them the primary producers in most ecosystems.$$
        $$Carnivores are consumers that eat other animals.$$
        $$Herbivores are primary consumers that eat plants.$$
        $$Decomposers break down dead organic matter, recycling nutrients back into the ecosystem.$$"
        It should be:
        "Producers are organisms that produce their own food, primarily through photosynthesis, using light energy and inorganic substances.
        
        Autotrophs are organisms that can produce their own food, making them the primary producers in most ecosystems.
        
        Carnivores are consumers that eat other animals.
        
        Herbivores are primary consumers that eat plants.
        
        Decomposers break down dead organic matter, recycling nutrients back into the ecosystem."

        If a question *requires* a diagram or image to be understood (e.g., geometry, diagrams, charts, graphs), **you MUST include an 'imageUrl' field and an 'imageAltText' field.** The 'imageUrl' should be a placeholder URL from 'https://placehold.co/600x400/cccccc/000000?text=**Descriptive+Image+Content**' where 'Descriptive+Image+Content' accurately describes the diagram needed (e.g., 'Triangle+ABC', 'Circuit+Diagram', 'Bar+Chart+Data'). The 'imageAltText' should also provide a clear, concise description of the diagram. If no image is needed, omit both 'imageUrl' and 'imageAltText' fields.
        For each question, provide the question text, all four options, the correct answer (as one of the options), and a detailed explanation for the correct answer. The output MUST be a JSON array of objects, strictly following this schema.`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        if (
            result.candidates &&
            result.candidates.length > 0 &&
            result.candidates[0].content &&
            result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0
        ) {
            const jsonString = result.candidates[0].content.parts[0].text;
            const questionsJson = JSON.parse(jsonString);

            // Validate the structure of the generated questions
            if (!Array.isArray(questionsJson) || questionsJson.length === 0) {
                throw new Error(
                    "Invalid response format: Expected an array of questions."
                );
            }

            // parsedJson.forEach((q, index) => {
            //     // CHANGED: Check for 'answer' property instead of 'correctAnswer'
            //     if (
            //         !q.questionText ||
            //         !Array.isArray(q.options) ||
            //         q.options.length !== 4 ||
            //         !q.answer ||
            //         !q.explanation
            //     ) {
            //         console.warn(
            //             `Question ${index} has an invalid structure or missing 'answer' property:`,
            //             q
            //         );
            //         // Optionally, you could filter out invalid questions or throw a more specific error
            //     }
            // });

            return questionsJson.map((q) => ({
                questionText: q.questionText || "No question text available",
                options: q.options || [
                    "No option 1",
                    "No option 2",
                    "No option 3",
                    "No option 4",
                ],
                answer: q.answer || "No answer provided",
                explanation: q.explanation || "No explanation provided",
            }));
        } else {
            throw new Error("No valid content returned from the API.");
        }
    } catch (error) {
        console.error("Error generating exam questions:", error);
        throw new Error(
            "Failed to generate exam questions: " + error.message ||
                "Unknown error"
        );
    }
};
