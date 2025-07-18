import { CloseIcon } from "./icons";

const Toast = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[1000] flex flex-col space-y-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-lg shadow-lg text-white flex items-center justify-between min-w-[250px] max-w-sm 
                        ${toast.type === "success" ? "bg-green-500" : ""} 
                        ${toast.type === "error" ? "bg-red-500" : ""}
                        ${toast.type === "info" ? "bg-blue-500" : ""}
                        ${toast.type === "warning" ? "bg-yellow-500" : ""}`}
                    role="alert"
                >
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                    >
                        <CloseIcon />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
