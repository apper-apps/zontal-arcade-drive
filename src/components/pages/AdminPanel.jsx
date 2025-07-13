import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/molecules/Modal";
import ApperIcon from "@/components/ApperIcon";
import * as gameService from "@/services/api/gameService";
import * as commentService from "@/services/api/commentService";
import * as ratingService from "@/services/api/ratingService";
import { useFirebase } from "@/hooks/useFirebase";

const AdminPanel = ({ onBack }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingGame, setEditingGame] = useState(null);
  const [deleteGameId, setDeleteGameId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    gameUrl: ""
  });
  const [adsenseSettings, setAdsenseSettings] = useState({
    publisherId: "",
    adUnitIds: [""]
  });
  const [submitting, setSubmitting] = useState(false);
  const { db, adsenseSettings: currentAdsenseSettings, setAdsenseSettings: updateAdsenseSettings } = useFirebase();

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

  useEffect(() => {
    if (db) {
      loadGames();
    }
  }, [db]);

  useEffect(() => {
    if (currentAdsenseSettings) {
      setAdsenseSettings({
        publisherId: currentAdsenseSettings.publisherId || "",
        adUnitIds: currentAdsenseSettings.adUnitIds || [""]
      });
    }
  }, [currentAdsenseSettings]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    try {
      setSubmitting(true);
      
      const gameData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        imageUrl: formData.imageUrl.trim(),
        gameUrl: formData.gameUrl.trim()
      };

      if (editingGame) {
        await gameService.updateGame(db, editingGame.Id, gameData);
        setGames(prev => prev.map(g => g.Id === editingGame.Id ? { ...g, ...gameData } : g));
        toast.success("Game updated successfully!");
      } else {
        const newGame = await gameService.createGame(db, gameData);
        setGames(prev => [newGame, ...prev]);
        toast.success("Game added successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("Error saving game:", err);
      toast.error("Failed to save game");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      category: game.category,
      imageUrl: game.imageUrl || "",
      gameUrl: game.gameUrl || ""
    });
  };

  const handleDeleteGame = async () => {
    if (!deleteGameId) return;

    try {
      setSubmitting(true);

      // Delete game and related data
      await gameService.deleteGame(db, deleteGameId);
      await commentService.deleteGameComments(db, deleteGameId);
      await ratingService.deleteGameRatings(db, deleteGameId);

      setGames(prev => prev.filter(g => g.Id !== deleteGameId));
      setDeleteGameId(null);
      toast.success("Game deleted successfully!");
    } catch (err) {
      console.error("Error deleting game:", err);
      toast.error("Failed to delete game");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      gameUrl: ""
    });
    setEditingGame(null);
  };

  const handleAdsenseSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const settings = {
        publisherId: adsenseSettings.publisherId.trim(),
        adUnitIds: adsenseSettings.adUnitIds.filter(id => id.trim()).map(id => id.trim())
      };

      await updateAdsenseSettings(settings);
      toast.success("AdSense settings saved successfully!");
    } catch (err) {
      console.error("Error saving AdSense settings:", err);
      toast.error("Failed to save AdSense settings");
    } finally {
      setSubmitting(false);
    }
  };

  const addAdUnitField = () => {
    setAdsenseSettings(prev => ({
      ...prev,
      adUnitIds: [...prev.adUnitIds, ""]
    }));
  };

  const removeAdUnitField = (index) => {
    setAdsenseSettings(prev => ({
      ...prev,
      adUnitIds: prev.adUnitIds.filter((_, i) => i !== index)
    }));
  };

  const updateAdUnitId = (index, value) => {
    setAdsenseSettings(prev => ({
      ...prev,
      adUnitIds: prev.adUnitIds.map((id, i) => i === index ? value : id)
    }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="shimmer h-8 w-48 rounded mb-8" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shimmer h-12 w-full rounded" />
            ))}
          </div>
          <div className="shimmer h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadGames} type="network" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-dark-muted">Manage games and AdSense settings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-dark-muted hover:text-dark-text transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span>Back to Home</span>
        </motion.button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Game Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-surface rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-6">
            {editingGame ? "Edit Game" : "Add New Game"}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                placeholder="Enter game title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
                placeholder="Enter game description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                placeholder="e.g., Action, Puzzle, Adventure"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                placeholder="https://example.com/game-image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Game URL
              </label>
              <input
                type="url"
                value={formData.gameUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, gameUrl: e.target.value }))}
                className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                placeholder="https://example.com/game.html"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 btn-glow"
              >
                {submitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{editingGame ? "Updating..." : "Adding..."}</span>
                  </div>
                ) : (
                  <>
                    <ApperIcon name={editingGame ? "Save" : "Plus"} size={16} className="inline mr-2" />
                    {editingGame ? "Update Game" : "Add Game"}
                  </>
                )}
              </motion.button>

              {editingGame && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="px-6 py-3 border border-dark-card text-dark-muted hover:text-dark-text hover:bg-dark-card rounded-lg transition-all duration-200"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </form>

          {/* AdSense Settings */}
          <div className="mt-8 pt-8 border-t border-dark-card">
            <h3 className="text-lg font-semibold text-dark-text mb-4">
              AdSense Configuration
            </h3>

            <form onSubmit={handleAdsenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Publisher ID
                </label>
                <input
                  type="text"
                  value={adsenseSettings.publisherId}
                  onChange={(e) => setAdsenseSettings(prev => ({ ...prev, publisherId: e.target.value }))}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Ad Unit IDs
                </label>
                <div className="space-y-2">
                  {adsenseSettings.adUnitIds.map((adUnitId, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={adUnitId}
                        onChange={(e) => updateAdUnitId(index, e.target.value)}
                        className="flex-1 p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        placeholder="XXXXXXXXXX"
                      />
                      {adsenseSettings.adUnitIds.length > 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeAdUnitField(index)}
                          className="px-3 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </motion.button>
                      )}
                    </div>
                  ))}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addAdUnitField}
                    className="w-full p-2 border border-dashed border-dark-card text-dark-muted hover:text-dark-text hover:border-primary-500 rounded-lg transition-all duration-200"
                  >
                    <ApperIcon name="Plus" size={16} className="inline mr-2" />
                    Add Ad Unit
                  </motion.button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {submitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="inline mr-2" />
                    Save AdSense Settings
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Games List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-surface rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-dark-text mb-6">
            Games ({games.length})
          </h2>

          {games.length === 0 ? (
            <Empty 
              type="admin"
              action={() => document.querySelector('input[placeholder="Enter game title"]').focus()}
              actionLabel="Add First Game"
            />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {games.map((game, index) => (
                  <motion.div
                    key={game.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-card hover:border-primary-500/50 transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-dark-text truncate">
                        {game.title}
                      </h3>
                      <p className="text-sm text-dark-muted">
                        {game.category}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditGame(game)}
                        className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"
                        title="Edit game"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteGameId(game.Id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete game"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteGameId}
        onClose={() => setDeleteGameId(null)}
        title="Delete Game"
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteGame}
        onCancel={() => setDeleteGameId(null)}
      >
        <p className="text-dark-muted">
          Are you sure you want to delete this game? This action will also remove all associated comments and ratings and cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminPanel;