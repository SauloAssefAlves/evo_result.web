import React from "react";

interface AlertProps {
    message: string;
    type?: "success" | "error" | "warning" | "info";
}

const Alert: React.FC<AlertProps> = ({ message, type = "info" }) => {
    const typeClasses = {
        success: "alert-success bg-green-100 text-green-800",
        error: "alert-error bg-red-100 text-red-800",
        warning: "alert-warning bg-yellow-100 text-yellow-800",
        info: "alert-info bg-blue-100 text-blue-800",
    };
    return (
        <div
            role="alert"
            className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow ${typeClasses[type]}`}
        >
            <div className="flex items-center space-x-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Alert;