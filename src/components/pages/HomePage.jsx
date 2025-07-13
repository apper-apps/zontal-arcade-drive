import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import GameCard from "@/components/molecules/GameCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AdSense from "@/components/molecules/AdSense";
import ApperIcon from "@/components/ApperIcon";
import * as gameService from "@/services/api/gameService";
import * as ratingService from "@/services/api/ratingService";
import { useFirebase } from "@/hooks/useFirebase";

const HomePage = ({ searchTerm, onGameSelect }) => {
  const [games, setGames] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { db, adsenseSettings } = useFirebase();

  const loadGames = async () => {
    try {
      setLoading(true);
      setError("");
      const gamesData = await gameService.getAllGames(db);
      setGames(gamesData);
    } catch (err) {
      console.error("Error loading games:", err);
      setError("Failed to load games. Please try again.");
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    try {
      const ratingsData = await ratingService.getAllRatings(db);
      
      // Calculate average ratings per game
      const gameRatings = {};
      ratingsData.forEach(rating => {
        if (!gameRatings[rating.gameId]) {
          gameRatings[rating.gameId] = [];
        }
        gameRatings[rating.gameId].push(rating.rating);
      });

      // Calculate averages
      const averageRatings = {};
      Object.keys(gameRatings).forEach(gameId => {
        const ratings = gameRatings[gameId];
        averageRatings[gameId] = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      });

      setRatings(averageRatings);
    } catch (err) {
      console.error("Error loading ratings:", err);
    }
  };

  useEffect(() => {
    loadGames();
    loadRatings();
  }, [db]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(games.map(game => game.category))];
    return cats.filter(Boolean);
  }, [games]);

  // Filter games based on search term and category
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = !searchTerm || 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || game.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [games, searchTerm, selectedCategory]);

  if (loading) {
    return <Loading type="games" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGames} type="network" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
          Welcome to Zontal Arcade
        </h1>
        <p className="text-xl text-dark-muted mb-8 max-w-2xl mx-auto">
          Discover amazing HTML5 games, rate your favorites, and join our gaming community!
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-500">
              {games.length}
            </div>
            <div className="text-sm text-dark-muted">Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-500">
              {categories.length - 1}
            </div>
            <div className="text-sm text-dark-muted">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-500">
              {Object.keys(ratings).length}
            </div>
            <div className="text-sm text-dark-muted">Rated</div>
          </div>
        </div>
      </motion.div>

      {/* AdSense Banner */}
      {adsenseSettings?.publisherId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <AdSense
            publisherId={adsenseSettings.publisherId}
            adSlot={adsenseSettings.adUnitIds?.[0]}
            className="max-w-4xl mx-auto"
          />
        </motion.div>
      )}

      {/* Category Filter */}
      {categories.length > 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                    : "bg-dark-surface text-dark-muted hover:text-dark-text hover:bg-dark-card border border-dark-card"
                }`}
              >
                {category === "all" ? "All Games" : category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results Info */}
      {(searchTerm || selectedCategory !== "all") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center"
        >
          <p className="text-dark-muted">
            {filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""} found
            {searchTerm && (
              <span> for "<span className="text-primary-400">{searchTerm}</span>"</span>
            )}
            {selectedCategory !== "all" && (
              <span> in <span className="text-secondary-400">{selectedCategory}</span></span>
            )}
          </p>
        </motion.div>
      )}

      {/* Games Grid */}
<AnimatePresence mode="wait">
        {filteredGames.length === 0 ? (
          <Empty
            type={searchTerm ? "search" : "games"}
            action={() => {
              setSelectedCategory("all");
            }}
            actionLabel={searchTerm ? "Clear Search" : "Browse All Games"}
          />
        ) : (
          <motion.div
            key="games-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GameCard
                  game={game}
                  onClick={onGameSelect}
                  averageRating={ratings[game.Id] || 0}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom AdSense */}
      {adsenseSettings?.publisherId && adsenseSettings.adUnitIds?.[1] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <AdSense
            publisherId={adsenseSettings.publisherId}
            adSlot={adsenseSettings.adUnitIds[1]}
            className="max-w-4xl mx-auto"
          />
        </motion.div>
      )}

      {/* Featured Categories */}
      {categories.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 gradient-text">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => {
              const categoryGames = games.filter(g => g.category === category);
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-dark-surface rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-dark-card hover:border-primary-500/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Gamepad2" size={24} className="text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-dark-text mb-1">
                    {category}
                  </h3>
                  <p className="text-sm text-dark-muted">
                    {categoryGames.length} game{categoryGames.length !== 1 ? "s" : ""}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;