// components/PredictionStatus.jsx
import { Brain, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function PredictionStatus({ predictionInfo }) {
  if (!predictionInfo) return null;

  const getStatusIcon = () => {
    if (predictionInfo.success && predictionInfo.method === "api_prediction") {
      return <Brain className="text-blue-500" size={16} />;
    } else if (predictionInfo.method === "filename_fallback") {
      return <FileText className="text-orange-500" size={16} />;
    } else {
      return <AlertCircle className="text-red-500" size={16} />;
    }
  };

  const getStatusText = () => {
    if (predictionInfo.success && predictionInfo.method === "api_prediction") {
      return `AI Prediction: ${predictionInfo.predicted_class}`;
    } else if (predictionInfo.method === "filename_fallback") {
      return "Detected from filename";
    } else {
      return "AI prediction failed";
    }
  };

  const getStatusColor = () => {
    if (predictionInfo.success && predictionInfo.method === "api_prediction") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    } else if (predictionInfo.method === "filename_fallback") {
      return "bg-orange-50 text-orange-700 border-orange-200";
    } else {
      return "bg-red-50 text-red-700 border-red-200";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${getStatusColor()}`}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {predictionInfo.confidence && (
        <span className="font-medium">
          ({(predictionInfo.confidence * 100).toFixed(0)}%)
        </span>
      )}
    </div>
  );
}
