import { motion } from "framer-motion";

const Loading = ({ type = "games" }) => {
  if (type === "games") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-surface rounded-xl overflow-hidden shadow-lg"
          >
            <div className="shimmer h-48 w-full" />
            <div className="p-4 space-y-3">
              <div className="shimmer h-4 w-3/4 rounded" />
              <div className="shimmer h-3 w-1/2 rounded" />
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <div key={starIndex} className="shimmer h-4 w-4 rounded" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "comments") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="comment-bubble"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="shimmer h-6 w-24 rounded" />
              <div className="shimmer h-4 w-16 rounded" />
            </div>
            <div className="space-y-2">
              <div className="shimmer h-3 w-full rounded" />
              <div className="shimmer h-3 w-2/3 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;