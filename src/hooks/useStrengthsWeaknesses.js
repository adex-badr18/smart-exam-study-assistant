import { useMutation } from "@tanstack/react-query";
import { generateStrengthsWeaknesses } from "../api/strengthsWeaknessesApi";
import { useToast } from "../context/ToastProvider";

/**
 * Custom hook for generating AI-powered strengths and weaknesses analysis.
 * Uses Tanstack Query's useMutation to manage the async operation.
 */
export const useStrengthsWeaknesses = () => {
    const { addToast } = useToast;

    return useMutation({
        mutationFn: generateStrengthsWeaknesses,
        onSuccess: (data) => {
            // No toast needed here, as the UI will update directly
            console.log(
                "Strengths and weaknesses generated successfully:",
                data
            );
        },
        onError: (error) => {
            console.error("Error!", error);
            addToast(`Failed to generate insights: ${error.message}`, "error");
        },
    });
};
