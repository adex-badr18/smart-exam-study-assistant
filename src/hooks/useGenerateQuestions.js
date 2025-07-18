import { generateExamQuestions } from "../api/geminiApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useToast } from "../context/ToastProvider";

/** 
 * Custom hook to generate exam questions using the Gemini API.
 * Manages loading, error, and success states, and navigates upon success. 
 * @returns {Array<Object>} - Contains the mutation function and its state.
 */
export const useGenerateQuestions = ({formData}) => {
    const navigate = useNavigate();
    const addToast = useToast().addToast;

    return useMutation({
        mutationFn: generateExamQuestions,
        onSuccess: (data) => {
            // Navigate to the generated questions page with the data
            console.log("Generated Questions:", data);

            addToast("Questions generated successfully! Redirecting...", "success");
            
            setTimeout(() => {
                navigate("/exam-question-explorer/generated-questions", {
                    state: { questions: data, formData },
                });
            }, 5000); // Navigate after 5 seconds to allow for any UI updates
        },
        onError: (error) => {
            console.error("Error generating questions:", error);
            addToast(
                "Failed to generate questions: " + error.message || "Unknown error",
                "error"
            );
        },
    })
}