import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { generateMockExamQuestions } from "../api/mockExamApi";
import { useToast } from "../context/ToastProvider";

/** * Custom hook to generate mock exam questions.
 * @returns {object} - Contains mutate function and isPending state.
 */
export const useGenerateMockExam = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: generateMockExamQuestions,
        onSuccess: (data, variables) => {
            addToast("Mock exam generated successfully!", "success");

            setTimeout(() => {
                // Navigate to the mock exam results page with the generated questions
                navigate("/mock-exam/exam", {
                    state: {
                        questions: data,
                        formData: variables,
                    },
                });
            }, 5000);
        },
        onError: (error) => {
            console.error("Error generating mock exam:", error);
            addToast(`Failed to generate mock exam: ${error.message}`, "error");
        },
    });
};
