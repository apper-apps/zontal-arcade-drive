import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const GameCard = ({ game, onClick, averageRating = 0 }) => {
  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/400x300/374151/9CA3AF?text=${encodeURIComponent(game.title)}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(game)}
      className="game-card bg-dark-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer group"
    >
      <div className="game-thumbnail relative">
        <img
          src={game.imageUrl || `https://placehold.co/400x300/374151/9CA3AF?text=${encodeURIComponent(game.title)}`}
          alt={game.title}
          onError={handleImageError}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Play Button Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-xl animate-pulse-soft"
          >
            <ApperIcon name="Play" size={28} className="text-white ml-1" />
          </motion.div>
        </motion.div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {game.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-dark-text mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {game.title}
        </h3>
        
        <p className="text-dark-muted text-sm mb-3 line-clamp-2">
          {game.description}
        </p>

        {/* Rating Display */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <ApperIcon
                key={index}
                name="Star"
                size={14}
                className={`${
                  index < Math.floor(averageRating)
                    ? "text-accent-500 fill-current"
                    : "text-dark-card"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-dark-muted">
            {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;