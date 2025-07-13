import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import * as contentService from "@/services/api/contentService";

const AboutUs = ({ onBack }) => {
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
      const contentData = await contentService.getByType("about");
      setContent(contentData);
    } catch (err) {
      console.error("Error loading about content:", err);
      setError("Failed to load content. Please try again.");
      toast.error("Failed to load about content");
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
            {content?.title || "About Us"}
          </h1>
          <p className="text-dark-muted">Learn more about our gaming platform</p>
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
          {content?.content.split('\n\n').map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-dark-text leading-relaxed mb-4 text-base md:text-lg"
            >
              {paragraph.split('\n').map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < paragraph.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </motion.p>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold gradient-text mb-2">
              Get in Touch
            </h3>
            <p className="text-dark-muted mb-4">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "#contact"}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 btn-glow"
            >
              <ApperIcon name="Mail" size={16} className="inline mr-2" />
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;