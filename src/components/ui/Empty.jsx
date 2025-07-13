import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "There's nothing here yet", 
  icon = "Inbox",
  action,
  actionLabel = "Get Started",
  type = "general"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "games":
        return {
          title: "No games found",
          description: "No games match your search criteria. Try adjusting your search or browse all games.",
          icon: "Gamepad2"
        };
      case "comments":
        return {
          title: "No comments yet",
          description: "Be the first to share your thoughts about this game!",
          icon: "MessageCircle"
        };
      case "search":
        return {
          title: "No search results",
          description: "We couldn't find any games matching your search. Try different keywords.",
          icon: "Search"
        };
      case "admin":
        return {
          title: "No games in arcade",
          description: "Start building your game collection by adding your first game.",
          icon: "Plus"
        };
      default:
        return { title, description, icon };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={content.icon} size={40} className="text-primary-500" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-dark-text mb-3 gradient-text"
      >
        {content.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-dark-muted mb-8 max-w-md text-lg"
      >
        {content.description}
      </motion.p>
      
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 btn-glow"
        >
          <ApperIcon name="Sparkles" size={18} className="inline mr-2" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;