import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  interactive = true, 
  size = 24 
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (interactive) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  return (
    <div 
      className="star-rating"
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starRating = index + 1;
        const isActive = starRating <= (hoveredRating || rating);

        return (
          <motion.button
            key={index}
            type="button"
            disabled={!interactive}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => handleStarHover(starRating)}
            className={`star ${interactive ? "cursor-pointer" : "cursor-default"}`}
          >
            <ApperIcon
              name="Star"
              size={size}
              className={`transition-all duration-200 ${
                isActive
                  ? "text-accent-500 fill-current drop-shadow-lg"
                  : "text-dark-card hover:text-accent-400"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default StarRating;