import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import * as contentService from "@/services/api/contentService";

const ContactUs = ({ onBack }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");
      const contentData = await contentService.getByType("contact");
      setContent(contentData);
    } catch (err) {
      console.error("Error loading contact content:", err);
      setError("Failed to load content. Please try again.");
      toast.error("Failed to load contact content");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Name, email, and message are required");
      return;
    }

    setSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {content?.title || "Contact Us"}
          </h1>
          <p className="text-dark-muted">Get in touch with our team</p>
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-surface rounded-xl p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-6">
            Get in Touch
          </h2>
          
          <div className="space-y-4">
            {content?.content.split('\n\n').map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                {section.split('\n').map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className={`text-dark-text ${
                      line.includes(':') && !line.includes('@') 
                        ? 'font-semibold text-primary-400 mb-2' 
                        : 'text-dark-muted mb-1'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Quick Contact Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex space-x-4"
          >
            <div className="flex items-center space-x-2 text-dark-muted">
              <ApperIcon name="Mail" size={20} className="text-primary-500" />
              <span className="text-sm">Email Support</span>
            </div>
            <div className="flex items-center space-x-2 text-dark-muted">
              <ApperIcon name="Clock" size={20} className="text-secondary-500" />
              <span className="text-sm">Quick Response</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-surface rounded-xl p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-6">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={6}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
                placeholder="Tell us how we can help you..."
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 btn-glow"
            >
              {submitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <ApperIcon name="Send" size={16} className="inline mr-2" />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;