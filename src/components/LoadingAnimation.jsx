// components/LoadingAnimation.jsx
"use client";
import React from "react";

const LoadingAnimation = ({
  message = "Memproses...",
  subtitle = "Mohon tunggu sebentar...",
  isVisible = true,
  onClose = null,
  showLogo = true,
  variant = "default", // "default", "success", "error"
}) => {
  if (!isVisible) return null;

  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return {
          primary: "bg-green-600",
          secondary: "bg-green-100",
          border: "border-green-200",
          spinner: "border-t-green-600",
          spinnerBg: "border-green-200",
          dots: "bg-green-600",
        };
      case "error":
        return {
          primary: "bg-red-600",
          secondary: "bg-red-100",
          border: "border-red-200",
          spinner: "border-t-red-600",
          spinnerBg: "border-red-200",
          dots: "bg-red-600",
        };
      default:
        return {
          primary: "bg-teal-600",
          secondary: "bg-teal-100",
          border: "border-teal-200",
          spinner: "border-t-teal-600",
          spinnerBg: "border-teal-200",
          dots: "bg-teal-600",
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-6 max-w-sm mx-4 relative animate-fade-in">
        {/* Close button (optional) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close loading"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Logo atau Brand */}
        {showLogo && (
          <div
            className={`w-16 h-16 ${colors.secondary} rounded-full flex items-center justify-center`}
          >
            <div
              className={`w-8 h-8 ${colors.primary} rounded-full animate-pulse`}
            ></div>
          </div>
        )}

        {/* Spinner utama */}
        <div className="relative">
          <div
            className={`w-12 h-12 border-4 ${colors.spinnerBg} rounded-full animate-spin ${colors.spinner}`}
          ></div>
          <div
            className={`absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping ${colors.spinner}`}
          ></div>
        </div>

        {/* Progress dots */}
        <div className="flex space-x-2">
          <div
            className={`w-3 h-3 ${colors.dots} rounded-full animate-bounce`}
          ></div>
          <div
            className={`w-3 h-3 ${colors.dots} rounded-full animate-bounce`}
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className={`w-3 h-3 ${colors.dots} rounded-full animate-bounce`}
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {message}
          </h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${colors.primary} h-2 rounded-full`}
            style={{
              width: "100%",
              animation: "loading-progress 2s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 20%;
          }
          25% {
            width: 40%;
          }
          50% {
            width: 70%;
          }
          75% {
            width: 90%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
