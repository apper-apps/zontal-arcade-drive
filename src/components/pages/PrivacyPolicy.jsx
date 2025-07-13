import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import * as contentService from "@/services/api/contentService";

const PrivacyPolicy = ({ onBack }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");
      const contentData = await contentService.getByType("privacy");
      setContent(contentData);
    } catch (err) {
      console.error("Error loading privacy content:", err);
      setError("Failed to load content. Please try again.");
      toast.error("Failed to load privacy policy");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadContent} type="network" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {content?.title || "Privacy Policy"}
          </h1>
          <p className="text-dark-muted">How we protect and handle your information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-dark-muted hover:text-dark-text transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span className="hidden sm:block">Back to Home</span>
        </motion.button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-surface rounded-xl p-6 md:p-8 shadow-lg"
      >
        <div className="prose prose-invert max-w-none">
          {content?.content.split('\n\n').map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="mb-6"
            >
              {section.split('\n').map((line, lineIndex) => {
                const isHeader = line.endsWith(':') && !line.includes('•');
                const isBulletPoint = line.startsWith('•');
                
                if (isHeader) {
                  return (
                    <h3 key={lineIndex} className="text-xl font-semibold text-primary-400 mb-3 mt-6">
                      {line}
                    </h3>
                  );
                }
                
                if (isBulletPoint) {
                  return (
                    <p key={lineIndex} className="text-dark-text ml-4 mb-2 flex items-start">
                      <span className="text-secondary-500 mr-2">•</span>
                      <span>{line.substring(1).trim()}</span>
                    </p>
                  );
                }
                
                return (
                  <p key={lineIndex} className="text-dark-text leading-relaxed mb-3">
                    {line}
                  </p>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Shield" size={24} className="text-accent-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-accent-400 mb-2">
                Your Privacy Matters
              </h3>
              <p className="text-dark-muted text-sm leading-relaxed">
                We are committed to protecting your privacy and ensuring transparency about our data practices. 
                If you have any questions about this privacy policy, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;