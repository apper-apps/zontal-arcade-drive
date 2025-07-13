import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import StarRating from "@/components/molecules/StarRating";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AdSense from "@/components/molecules/AdSense";
import ApperIcon from "@/components/ApperIcon";
import * as ratingService from "@/services/api/ratingService";
import * as commentService from "@/services/api/commentService";
import { useFirebase } from "@/hooks/useFirebase";
import { formatDistanceToNow } from "date-fns";

const GameDetailPage = ({ game, onBack }) => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState("");
  const [gameLoaded, setGameLoaded] = useState(false);
  const { db, userId, adsenseSettings } = useFirebase();

  const loadGameData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load user rating
      const userRatingData = await ratingService.getUserRating(db, game.Id, userId);
      setUserRating(userRatingData ? userRatingData.rating : 0);

      // Load average rating
      const allRatings = await ratingService.getGameRatings(db, game.Id);
      if (allRatings.length > 0) {
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }

      // Load comments
      const commentsData = await commentService.getGameComments(db, game.Id);
      setComments(commentsData);
    } catch (err) {
      console.error("Error loading game data:", err);
      setError("Failed to load game data. Please try again.");
      toast.error("Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (game && db && userId) {
      loadGameData();
    }
  }, [game, db, userId]);

  const handleRatingChange = async (rating) => {
    try {
      await ratingService.saveRating(db, {
        gameId: game.Id,
        userId: userId,
        rating: rating,
        timestamp: Date.now()
      });
      
      setUserRating(rating);
      
      // Recalculate average rating
      const allRatings = await ratingService.getGameRatings(db, game.Id);
      if (allRatings.length > 0) {
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        setAverageRating(avg);
      }
      
      toast.success("Rating saved!");
    } catch (err) {
      console.error("Error saving rating:", err);
      toast.error("Failed to save rating");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      
      const comment = {
        gameId: game.Id,
        userId: userId,
        username: `User-${userId.slice(-8).toUpperCase()}`,
        commentText: newComment.trim(),
        timestamp: Date.now()
      };

      await commentService.saveComment(db, comment);
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/800x400/374151/9CA3AF?text=${encodeURIComponent(game.title)}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="shimmer h-8 w-32 rounded mb-4" />
          <div className="shimmer h-12 w-2/3 rounded mb-2" />
          <div className="shimmer h-6 w-1/3 rounded" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="shimmer h-96 w-full rounded-xl mb-6" />
          </div>
          <div className="space-y-6">
            <div className="shimmer h-48 w-full rounded-xl" />
            <Loading type="comments" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadGameData} type="game" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center space-x-2 text-dark-muted hover:text-dark-text mb-6 transition-colors"
      >
        <ApperIcon name="ArrowLeft" size={20} />
        <span>Back to Games</span>
      </motion.button>

      {/* Game Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm px-3 py-1 rounded-full">
            {game.category}
          </span>
          <div className="flex items-center space-x-2">
            <StarRating rating={averageRating} interactive={false} size={16} />
            <span className="text-sm text-dark-muted">
              ({averageRating > 0 ? averageRating.toFixed(1) : "No ratings"})
            </span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-dark-text mb-2">
          {game.title}
        </h1>
        <p className="text-lg text-dark-muted">
          {game.description}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Game Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-dark-surface rounded-2xl overflow-hidden shadow-2xl">
            {/* Game Thumbnail/Preview */}
            <div className="relative">
              <img
                src={game.imageUrl || `https://placehold.co/800x400/374151/9CA3AF?text=${encodeURIComponent(game.title)}`}
                alt={game.title}
                onError={handleImageError}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setGameLoaded(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-soft">
                  <ApperIcon name="Play" size={40} className="text-white ml-1" />
                </div>
              </motion.button>
            </div>

            {/* Game iframe */}
            {gameLoaded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <iframe
                  src={game.gameUrl || "about:blank"}
                  className="game-iframe w-full h-96"
                  title={game.title}
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms"
                >
                  <div className="flex items-center justify-center h-96 bg-dark-bg text-dark-muted">
                    <div className="text-center">
                      <ApperIcon name="AlertTriangle" size={48} className="mx-auto mb-4" />
                      <p>Your browser does not support iframes.</p>
                      <p className="text-sm mt-2">
                        <a 
                          href={game.gameUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-500 hover:underline"
                        >
                          Play in new window
                        </a>
                      </p>
                    </div>
                  </div>
                </iframe>
              </motion.div>
            )}
          </div>

          {/* AdSense Banner */}
          {adsenseSettings?.publisherId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <AdSense
                publisherId={adsenseSettings.publisherId}
                adSlot={adsenseSettings.adUnitIds?.[0]}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          {/* Rating Section */}
          <div className="bg-dark-surface rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-dark-text mb-4">
              Rate This Game
            </h3>
            <div className="text-center mb-4">
              <StarRating
                rating={userRating}
                onRatingChange={handleRatingChange}
                size={32}
              />
              <p className="text-sm text-dark-muted mt-2">
                {userRating > 0 ? `You rated this ${userRating} star${userRating !== 1 ? "s" : ""}` : "Click to rate"}
              </p>
            </div>
            {averageRating > 0 && (
              <div className="text-center pt-4 border-t border-dark-card">
                <div className="text-2xl font-bold text-primary-500">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-dark-muted">
                  Average Rating
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-dark-surface rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-dark-text mb-4">
              Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this game..."
                rows={3}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
              />
              <motion.button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 btn-glow"
              >
                {submittingComment ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Posting...</span>
                  </div>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} className="inline mr-2" />
                    Post Comment
                  </>
                )}
              </motion.button>
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <Empty type="comments" />
              ) : (
                comments.map((comment, index) => (
                  <motion.div
                    key={`${comment.userId}-${comment.timestamp}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="comment-bubble"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary-400">
                        {comment.username}
                      </span>
                      <span className="text-xs text-dark-muted">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-dark-text leading-relaxed">
                      {comment.commentText}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Side AdSense */}
          {adsenseSettings?.publisherId && adsenseSettings.adUnitIds?.[1] && (
            <AdSense
              publisherId={adsenseSettings.publisherId}
              adSlot={adsenseSettings.adUnitIds[1]}
              width="300px"
              height="250px"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GameDetailPage;