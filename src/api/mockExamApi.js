import { GoogleGenAI } from "@google/genai/web";
import { Type } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define the expected structure for a single question object
const mockQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        questionText: { type: Type.STRING }, // The question text
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }, // The question text
            minItems: 4,
            maxItems: 4,
        },
        answer: { type: Type.STRING }, // The question text // The correct option text
        explanation: { type: Type.STRING }, // The question text // Detailed explanation for the correct answer
        // Optional properties for image
        imageUrl: { type: Type.STRING }, // The question text // URL for the image (will be a placeholder)
        imageAltText: { type: Type.STRING }, // The question text // Alt text describing the image
        // New: optional topic tag for analytics
        topicTag: { type: Type.STRING }, // The question text
    },
    required: ["questionText", "options", "answer", "explanation"],
    propertyOrdering: [
        "questionText",
        "options",
        "answer",
        "explanation",
        "imageUrl",
        "imageAltText",
        "topicTag",
    ],
};

// Define the schema for the array of questions
const mockResponseSchema = {
    type: Type.ARRAY,
    items: mockQuestionSchema,
};

/**
 * Calls the Gemini API to generate mock exam questions based on provided formData.
 * @param {object} formData - Object containing examType, subject, numQuestions, topic.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of question objects.
 */
export const generateMockExamQuestions = async (formData) => {
    const { examType, subject, numQuestions, topic } = formData;

    // Construct the prompt for the AI model
    let prompt = `Generate ${numQuestions} multiple-choice questions (A-D) for a mock ${examType} ${subject} exam.`;

    if (topic && topic !== "Any Topic") {
        prompt += ` Focus specifically on the topic of "${topic}".`;
    }

    prompt += `If a question *requires* a diagram or image to be understood (e.g., geometry, diagrams, charts, graphs), **you MUST include an 'imageUrl' field and an 'imageAltText' field.** The 'imageUrl' should be a placeholder URL from 'https://placehold.co/600x400/cccccc/000000?text=**Descriptive+Image+Content**' where 'Descriptive+Image+Content' accurately describes the diagram needed (e.g., 'Triangle+ABC', 'Circuit+Diagram', 'Bar+Chart+Data'). The 'imageAltText' should also provide a clear, concise description of the diagram. If no image is needed, omit both 'imageUrl' and 'imageAltText' fields.
    For each question, provide the question text, all four options, the correct answer (as one of the options), a detailed explanation for the correct answer, and both imageUrl and imageAltText if applicable.
  
    All question texts should appear on a single line, and mathematical expressions found in the questionn text should be formatted using LaTeX syntax.
  
    For example, 
    "Simplify: (16^(-1/4) * 8^(1/3)) / (4^(1/2) * 2^(-1))" should be formatted as "Simplify: \\((16^{-1/4} \\times 8^{1/3}) / (4^{1/2} \\times 2^{-1})\\)". 
    Explanation fields that contain **mathematical step, equation, or formula** should be detailed and contain mathematical steps, with each significant step or equation presented on a new line and enclosed in display math delimiters ($$...$$).
    For example,
    "To solve this problem, we can use the third equation of motion, which relates initial velocity, final velocity, acceleration, and displacement:
    $$v^2 = u^2 + 2as$$
    Where:
    \\(v\\) is the final velocity
    \\(u\\) is the initial velocity (since the car starts from rest, \\(u = 0\\))
    \\(a\\) is the acceleration (\\(4.0\text{ m/s}^2\\))
    \\(s\\) is the displacement (\\(50\text{ m}\\))

    Substitute the given values into the equation:
    $$v^2 = 0^2 + 2 \times 4.0 \times 50$$
    $$v^2 = 0 + 400$$
    $$v^2 = 400$$

    To find \\(v\\), take the square root of both sides:
    $$v = \sqrt{400}$$
    $$v = 20.0\text{ m/s}$$"

    If the final answer gotten in the explanation could not be found in the options, simply tell the user that the answer could not be found in the option, do not make any further manipulations to either the question or the options, simply fill the correct answer field with the answer gotten from the explanation with a descriptive message.

    IMPORTANT: In the 'explanation' field, general explanatory sentences or definitions should NOT be enclosed in $$...$$ delimiters. For example, instead of:
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
    
    The output MUST be a JSON array of objects, strictly following this schema.`;

    try {
        // Call the Gemini API to generate questions
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: mockResponseSchema,
                // maxOutputTokens: 1000, // Adjust as needed
                // temperature: 0.7, // Adjust for creativity vs. accuracy
                // topP: 0.9, // Adjust for diversity in responses
                // stopSequences: ["\n"], // Stop generation at new line
            },
        });

        if (
            response.candidates &&
            response.candidates.length > 0 &&
            response.candidates[0].content &&
            response.candidates[0].content.parts &&
            response.candidates[0].content.parts.length > 0
        ) {
            const jsonString = response.candidates[0].content.parts[0].text;
            const questionsJson = JSON.parse(jsonString);

            // Validate the structure of the generated questions
            if (!Array.isArray(questionsJson) || questionsJson.length === 0) {
                throw new Error(
                    "Invalid response format: Expected an array of questions."
                );
            }

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
