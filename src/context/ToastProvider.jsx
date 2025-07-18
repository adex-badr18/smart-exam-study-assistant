import {
    useContext,
    createContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { createPortal } from "react-dom";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 5000) => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

        // Automatically remove the toast after the specified duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    // Function to remove a toast by its ID
    const removeToast = useCallback((id) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
    }, []);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (toasts.length > 0) {
    //             removeToast(toasts[0].id);
    //         }
    //     }, 5000);

    //     return () => clearTimeout(timer);
    // }, [toasts, removeToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {createPortal(
                <Toast toasts={toasts} removeToast={removeToast} />,
                document.body
            )}
        </ToastContext.Provider>
    );
};

// Custom hook to use the Toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}