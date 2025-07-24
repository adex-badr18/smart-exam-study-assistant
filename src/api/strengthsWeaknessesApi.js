import { GoogleGenAI, Type } from "@google/genai/web";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define the expected structure for the strengths and weaknesses response
const strengthsWeaknessesSchema = {
    type: Type.OBJECT,
    properties: {
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
    },
    required: ["strengths", "weaknesses"],
    propertyOrdering: ["strengths", "weaknesses"],
};

/**
 * Calls the Gemini API to analyze mock exam results and identify strengths and weaknesses.
 * @param {object} resultData - Object containing exam performance metrics.
 * @param {string} resultData.examType - Type of exam (e.g. "WAEC").
 * @param {string} resultData.subject - Subject of the exam.
 * @param {number} resultData.totalScore - Total score obtained.
 * @param {number} resultData.totalQuestions - Total number of questions.
 * @param {object} resultData.performanceByTopic - Object mapping topics to their performance (correct, total, time).
 * @param {number} resultData.totalTimeSpent - Total time spent on the exam in seconds.
 * @returns {Promise<{strengths: string[], weaknesses: string[]}>} - A promise that resolves to an object with strengths and weaknesses arrays.
 */
export const generateStrengthsWeaknesses = async (resultData) => {
    const {
        examType,
        subject,
        totalScore,
        totalQuestions,
        performanceByTopic,
        totalTimeSpent,
    } = resultData;

    // Format performanceByTopic for the prompt
    let topicSummary = "";
    for (const topic in performanceByTopic) {
        const data = performanceByTopic[topic];
        const topicAccuracy =
            data.total > 0 ? ((data.correct / data.total) * 100).toFixed(2) : 0;
        topicSummary += `- Topic: ${topic}, Correct: ${data.correct}/${data.total} (${topicAccuracy}%), Time: ${data.time}s.\n`;
    }

    if (!topicSummary) {
        topicSummary = "No specific topic breakdown available.";
    }

    const prompt = `Analyze the following mock exam results for a ${examType} ${subject} exam. Based on the data, identify the student's key strengths and weaknesses. Provide the response as a JSON object with two arrays: 'strengths' and 'weaknesses'. Each array should contain concise, actionable bullet points (strings).
    
    Exam Summary:
    - Total Score: ${totalScore} out of ${totalQuestions}
    - Overall Accuracy: ${
        totalQuestions > 0
            ? ((totalScore / totalQuestions) * 100).toFixed(2)
            : 0
    }%
    - Total Time Spent: ${totalTimeSpent} seconds

    Performance by Topic:
    ${topicSummary}

    Consider:
    - Topics with high/low accuracy.
    - Topics where disproportionately more/less time was spent relative to correctness.
    - General observations about performance.

    Example Output:
    {
        "strengths": [
            "Strong understanding of Algebra topics.",
            "Efficiently managed time on straightforward questions"
        ],
        "weaknesses": [
            "Struggles with Geometry concepts, particularly proofs.",
            "Spends excessive time on complex word problems, leading to time pressure",
            "Needs to review basic principles of Electromagnetism."
        ]
    }
    The output must be a JSON object, strictly following the schema.
    `;

    try {
        // Call Gemini API to analyze result
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: strengthsWeaknessesSchema,
            }
        })

        if (response.candidates &&
            response.candidates.length > 0 &&
            response.candidates[0].content &&
            response.candidates[0].content.parts &&
            response.candidates[0].content.parts.length > 0
        ) {
            const jsonString = response.candidates[0].content.parts[0].text;
            const reportJson = JSON.parse(jsonString);

            // Basic validation of the parsed JSON response
            if (!reportJson || !Array.isArray(reportJson.strengths) || !Array.isArray(reportJson.weaknesses)) {
                throw new Error("Generated report is not a valid strengths and weaknesses object.")
            }

            return reportJson
        } else {
            console.error("Unexpected API response structure:", response)
            throw new Error("Failed to generate strengths and weaknesses: Unexpected response format.")
        }
    } catch (error) {
        console.error("Error generating strengths and weaknesses:", error)
            throw new Error(`Failed to generate strengths and weaknesses: ${error.message || 'Unknown Error.'}`)
    }
};
