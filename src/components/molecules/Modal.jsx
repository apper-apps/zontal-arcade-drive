import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return { name: "CheckCircle", color: "text-secondary-500" };
      case "warning":
        return { name: "AlertTriangle", color: "text-accent-500" };
      case "danger":
        return { name: "AlertCircle", color: "text-red-500" };
      default:
        return { name: "Info", color: "text-primary-500" };
    }
  };

  const icon = getIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-dark-surface border border-dark-card rounded-2xl shadow-2xl max-w-md w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-card">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${icon.color}`}>
                  <ApperIcon name={icon.name} size={32} />
                </div>
                <h3 className="text-lg font-semibold text-dark-text">
                  {title}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-dark-muted hover:text-dark-text transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-6">
              {children}
            </div>

            {/* Footer */}
            {(onConfirm || onCancel) && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-dark-card">
                {onCancel && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCancel}
                    className="px-4 py-2 text-dark-muted hover:text-dark-text border border-dark-card rounded-lg hover:bg-dark-card transition-all duration-200"
                  >
                    {cancelText}
                  </motion.button>
                )}
                {onConfirm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onConfirm}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      type === "danger"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg btn-glow"
                    }`}
                  >
                    {confirmText}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;