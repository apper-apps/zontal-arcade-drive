import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "game":
        return "Gamepad2";
      case "auth":
        return "UserX";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Problem";
      case "game":
        return "Game Load Failed";
      case "auth":
        return "Authentication Error";
      default:
        return "Oops! Something went wrong";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name={getErrorIcon()} size={32} className="text-red-500" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-dark-text mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-dark-muted mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 btn-glow"
        >
          <ApperIcon name="RefreshCw" size={16} className="inline mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;