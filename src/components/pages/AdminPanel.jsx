import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Disclaimer from "@/components/pages/Disclaimer";
import AdSense from "@/components/molecules/AdSense";
import Modal from "@/components/molecules/Modal";
import { useFirebase } from "@/hooks/useFirebase";
import * as contentService from "@/services/api/contentService";
import * as ratingService from "@/services/api/ratingService";
import * as gameService from "@/services/api/gameService";
import * as commentService from "@/services/api/commentService";
const AdminPanel = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
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
    adUnitIds: [""],
    metaTag: "",
    adsTxtContent: ""
  });
  const [activeTab, setActiveTab] = useState("games");
  const [contents, setContents] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [deleteContentId, setDeleteContentId] = useState(null);
  const [contentFormData, setContentFormData] = useState({
    type: "about",
    title: "",
    content: ""
  });
  const [websiteName, setWebsiteName] = useState(() => {
    return localStorage.getItem('websiteName') || 'Arcade Flow';
  });
  const [submitting, setSubmitting] = useState(false);
  const { db, adsenseSettings: currentAdsenseSettings, setAdsenseSettings: updateAdsenseSettings } = useFirebase();
// Check for existing auth session
  useEffect(() => {
    const authSession = sessionStorage.getItem('adminAuth');
    if (authSession === 'authenticated') {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Hardcoded credentials validation
    if (loginData.username === "Admin" && loginData.password === "Admin123") {
      setIsAuthenticated(true);
      setShowLogin(false);
      sessionStorage.setItem('adminAuth', 'authenticated');
      toast.success("Successfully logged in to admin panel");
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    sessionStorage.removeItem('adminAuth');
    setLoginData({ username: "", password: "" });
    toast.info("Logged out from admin panel");
  };

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
    if (db && isAuthenticated) {
loadGames();
      loadContents();
    }
  }, [db, isAuthenticated]);

  useEffect(() => {
if (currentAdsenseSettings) {
      setAdsenseSettings({
        publisherId: currentAdsenseSettings.publisherId || "",
        adUnitIds: currentAdsenseSettings.adUnitIds || [""],
        metaTag: currentAdsenseSettings.metaTag || "",
        adsTxtContent: currentAdsenseSettings.adsTxtContent || ""
      });
    }
  }, [currentAdsenseSettings]);

  const loadContents = async () => {
    try {
      const contentsData = await contentService.getAll();
      setContents(contentsData);
    } catch (err) {
      console.error("Error loading contents:", err);
      toast.error("Failed to load contents");
    }
  };

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
        adUnitIds: adsenseSettings.adUnitIds.filter(id => id.trim()).map(id => id.trim()),
        metaTag: adsenseSettings.metaTag.trim(),
        adsTxtContent: adsenseSettings.adsTxtContent.trim()
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

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    if (!contentFormData.title.trim() || !contentFormData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setSubmitting(true);
      
      const contentData = {
        ...contentFormData,
        title: contentFormData.title.trim(),
        content: contentFormData.content.trim()
      };

      if (editingContent) {
        await contentService.update(editingContent.Id, contentData);
        setContents(prev => prev.map(c => c.Id === editingContent.Id ? { ...c, ...contentData } : c));
        toast.success("Content updated successfully!");
      } else {
        const newContent = await contentService.create(contentData);
        setContents(prev => [newContent, ...prev]);
        toast.success("Content added successfully!");
      }

      resetContentForm();
    } catch (err) {
      console.error("Error saving content:", err);
      toast.error("Failed to save content");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditContent = (content) => {
    setEditingContent(content);
    setContentFormData({
      type: content.type,
      title: content.title,
      content: content.content
    });
  };

  const handleDeleteContent = async () => {
    if (!deleteContentId) return;

    try {
      setSubmitting(true);
      await contentService.delete(deleteContentId);
      setContents(prev => prev.filter(c => c.Id !== deleteContentId));
      setDeleteContentId(null);
      toast.success("Content deleted successfully!");
    } catch (err) {
      console.error("Error deleting content:", err);
      toast.error("Failed to delete content");
    } finally {
      setSubmitting(false);
    }
  };

  const resetContentForm = () => {
    setContentFormData({
      type: "about",
      title: "",
      content: ""
    });
    setEditingContent(null);
};

  const handleWebsiteNameSubmit = async (e) => {
    e.preventDefault();
    if (!websiteName.trim()) {
      toast.error("Website name is required");
      return;
    }

    try {
      setSubmitting(true);
      const trimmedName = websiteName.trim();
      setWebsiteName(trimmedName);
      localStorage.setItem('websiteName', trimmedName);
      
      // Update parent component if updateWebsiteName prop is available
      if (window.updateWebsiteName) {
        window.updateWebsiteName(trimmedName);
      }
      
      toast.success("Website name updated successfully!");
    } catch (err) {
      console.error("Error saving website name:", err);
      toast.error("Failed to save website name");
    } finally {
      setSubmitting(false);
    }
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
              <p className="text-dark-muted">Authentication required</p>
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
          
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-surface rounded-xl p-8 shadow-2xl max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Lock" size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text mb-2">Admin Login</h2>
                <p className="text-dark-muted">Enter your credentials to access the admin panel</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 btn-glow"
                >
                  <ApperIcon name="LogIn" size={16} className="inline mr-2" />
                  Login to Admin Panel
                </motion.button>
              </form>

              <div className="mt-6 p-4 bg-dark-bg rounded-lg border border-dark-card">
                <p className="text-xs text-dark-muted text-center">
                  <ApperIcon name="Info" size={12} className="inline mr-1" />
                  Demo credentials: Admin / Admin123
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

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
          <p className="text-dark-muted">Manage games, content pages and AdSense settings</p>
        </div>
<div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center space-x-2 text-dark-muted hover:text-dark-text transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Back to Home</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <ApperIcon name="LogOut" size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
</motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8">
{[
          { id: "games", label: "Games", icon: "Gamepad2" },
          { id: "content", label: "Content Pages", icon: "FileText" },
          { id: "adsense", label: "AdSense", icon: "DollarSign" },
          { id: "website", label: "Website Settings", icon: "Globe" }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                : "bg-dark-surface text-dark-muted hover:text-dark-text hover:bg-dark-card"
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>
{activeTab === "games" && (
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
      )}

      {activeTab === "content" && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Content Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-surface rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-dark-text mb-6">
              {editingContent ? "Edit Content" : "Add New Content"}
            </h2>

            <form onSubmit={handleContentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Content Type *
                </label>
                <select
                  value={contentFormData.type}
                  onChange={(e) => setContentFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  required
                >
                  <option value="about">About Us</option>
                  <option value="contact">Contact Us</option>
                  <option value="privacy">Privacy Policy</option>
                  <option value="disclaimer">Disclaimer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={contentFormData.title}
                  onChange={(e) => setContentFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="Enter content title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Content *
                </label>
                <textarea
                  value={contentFormData.content}
                  onChange={(e) => setContentFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
                  placeholder="Enter content (supports line breaks)"
                  required
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
                      <span>{editingContent ? "Updating..." : "Adding..."}</span>
                    </div>
                  ) : (
                    <>
                      <ApperIcon name={editingContent ? "Save" : "Plus"} size={16} className="inline mr-2" />
                      {editingContent ? "Update Content" : "Add Content"}
                    </>
                  )}
                </motion.button>

                {editingContent && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetContentForm}
                    className="px-6 py-3 border border-dark-card text-dark-muted hover:text-dark-text hover:bg-dark-card rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Content List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-surface rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-dark-text mb-6">
              Content Pages ({contents.length})
            </h2>

            {contents.length === 0 ? (
              <Empty 
                type="admin"
                action={() => document.querySelector('select[value]').focus()}
                actionLabel="Add First Content"
              />
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {contents.map((content, index) => (
                    <motion.div
                      key={content.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-card hover:border-primary-500/50 transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark-text truncate">
                          {content.title}
                        </h3>
                        <p className="text-sm text-dark-muted capitalize">
                          {content.type.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditContent(content)}
                          className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"
                          title="Edit content"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteContentId(content.Id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete content"
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
)}

      {activeTab === "adsense" && (
        <div className="grid lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
          {/* AdSense Settings Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-surface rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-dark-text mb-6">
              AdSense Configuration
            </h2>

            <form onSubmit={handleAdsenseSubmit} className="space-y-6">
              {/* Publisher ID Section */}
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
                <p className="text-xs text-dark-muted mt-2">
                  Your Google AdSense Publisher ID (found in your AdSense account)
                </p>
              </div>

              {/* Ad Unit IDs Section */}
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

              {/* Meta Tag Section */}
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  AdSense Meta Tag Content
                </label>
                <input
                  type="text"
                  value={adsenseSettings.metaTag}
                  onChange={(e) => setAdsenseSettings(prev => ({ ...prev, metaTag: e.target.value }))}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="ca-pub-7659325373714686"
                />
                <div className="mt-2 p-3 bg-dark-bg rounded-lg border border-dark-card">
                  <p className="text-xs text-dark-muted mb-2">Preview:</p>
                  <code className="text-xs text-primary-400 break-all">
                    &lt;meta name="google-adsense-account" content="{adsenseSettings.metaTag || 'ca-pub-7659325373714686'}"&gt;
                  </code>
                </div>
              </div>

              {/* Ads.txt Content Section */}
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Ads.txt Content
                </label>
                <textarea
                  value={adsenseSettings.adsTxtContent}
                  onChange={(e) => setAdsenseSettings(prev => ({ ...prev, adsTxtContent: e.target.value }))}
                  rows={4}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none font-mono text-sm"
                  placeholder="google.com, pub-7659325373714686, DIRECT, f08c47fec0942fa0"
                />
                <div className="mt-2 p-3 bg-dark-bg rounded-lg border border-dark-card">
                  <p className="text-xs text-dark-muted mb-2">Example format:</p>
                  <code className="text-xs text-primary-400 break-all">
                    google.com, pub-7659325373714686, DIRECT, f08c47fec0942fa0
                  </code>
                </div>
              </div>

              {/* Submit Button */}
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

{/* Site Verification Guide */}
            <div className="mt-8 p-6 bg-dark-bg rounded-lg border border-dark-card">
              <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center">
                <ApperIcon name="Shield" size={20} className="mr-2 text-primary-500" />
                Site Verification Guide
              </h3>
              
              <div className="space-y-6">
                {/* Meta Tag Section */}
                <div className="border-l-4 border-primary-500 pl-4">
                  <h4 className="font-medium text-dark-text mb-2">📋 Meta Tag Implementation</h4>
                  <div className="space-y-2 text-sm text-dark-muted">
                    <p><strong>Location:</strong> Add to your website's HTML head section (index.html)</p>
                    <p><strong>Current file:</strong> <code className="text-primary-400 bg-dark-surface px-2 py-1 rounded">index.html</code> (lines 14-15)</p>
                    <div className="bg-dark-surface p-3 rounded-lg mt-2">
                      <code className="text-xs text-primary-400 block">
                        &lt;meta name="google-adsense-account" content="ca-pub-{adsenseSettings.publisherId || 'XXXXXXXXXXXXXXXX'}"&gt;
                      </code>
                      <code className="text-xs text-primary-400 block">
                        &lt;meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE"&gt;
                      </code>
                    </div>
                  </div>
                </div>

                {/* Ads.txt Section */}
                <div className="border-l-4 border-secondary-500 pl-4">
                  <h4 className="font-medium text-dark-text mb-2">📄 Ads.txt File Setup</h4>
                  <div className="space-y-2 text-sm text-dark-muted">
                    <p><strong>Location:</strong> Website root directory as <code className="text-secondary-400 bg-dark-surface px-2 py-1 rounded">ads.txt</code></p>
                    <p><strong>Current file:</strong> <code className="text-secondary-400 bg-dark-surface px-2 py-1 rounded">public/ads.txt</code></p>
                    <p><strong>URL access:</strong> <code className="text-secondary-400 bg-dark-surface px-2 py-1 rounded">https://yoursite.com/ads.txt</code></p>
                    <div className="bg-dark-surface p-3 rounded-lg mt-2">
                      <code className="text-xs text-secondary-400 block">
                        google.com, pub-{adsenseSettings.publisherId || 'XXXXXXXXXXXXXXXX'}, DIRECT, f08c47fec0942fa0
                      </code>
                    </div>
                  </div>
                </div>

                {/* Step-by-step Instructions */}
                <div className="border-l-4 border-accent-500 pl-4">
                  <h4 className="font-medium text-dark-text mb-2">🔧 Implementation Steps</h4>
                  <div className="space-y-3 text-sm text-dark-muted">
                    <div className="flex items-start space-x-3">
                      <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-bold">1</span>
                      <div>
                        <p><strong>Get your Publisher ID:</strong> Visit AdSense → Account → Account Information</p>
                        <p className="text-xs">Format: ca-pub-1234567890123456</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-bold">2</span>
                      <div>
                        <p><strong>Update Meta Tag:</strong> Replace "ca-pub-XXXXXXXXXXXXXXXX" in index.html</p>
                        <p className="text-xs">Or use the Meta Tag field above to generate the correct format</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-bold">3</span>
                      <div>
                        <p><strong>Update Ads.txt:</strong> Replace content in public/ads.txt with your Publisher ID</p>
                        <p className="text-xs">Or use the Ads.txt Content field above to generate the correct format</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-bold">4</span>
                      <div>
                        <p><strong>Verify Access:</strong> Check that https://yoursite.com/ads.txt shows your content</p>
                        <p className="text-xs">This file must be accessible from your website's root directory</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-dark-surface p-4 rounded-lg">
                  <h4 className="font-medium text-dark-text mb-2 flex items-center">
                    <ApperIcon name="Info" size={16} className="mr-2" />
                    Additional Notes
                  </h4>
                  <div className="space-y-2 text-xs text-dark-muted">
                    <div>
                      <strong>Publisher ID:</strong> Your unique AdSense account identifier (never changes)
                    </div>
                    <div>
                      <strong>Ad Unit IDs:</strong> Specific ad placement identifiers from your AdSense dashboard
                    </div>
                    <div>
                      <strong>Verification:</strong> Google may take 24-48 hours to verify your site after implementation
                    </div>
                    <div>
                      <strong>Testing:</strong> Use Google AdSense's site verification tool to check implementation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {activeTab === "website" && (
        <div className="grid lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
          {/* Website Settings Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-surface rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-dark-text mb-6">
              Website Configuration
            </h2>

            <form onSubmit={handleWebsiteNameSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Website Name *
                </label>
                <input
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-card rounded-lg text-dark-text placeholder-dark-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="Enter website name"
                  required
                />
                <p className="text-xs text-dark-muted mt-2">
                  This name will appear in the logo, loading screen, and footer throughout the website.
                </p>
              </div>

              <div className="p-4 bg-dark-bg rounded-lg border border-dark-card">
                <h3 className="text-sm font-medium text-dark-text mb-2">Preview</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Gamepad2" size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold gradient-text text-lg">
                      {websiteName || 'Website Name'}
                    </h4>
                    <p className="text-xs text-dark-muted -mt-1">
                      HTML5 Game Portal
                    </p>
                  </div>
                </div>
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
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="inline mr-2" />
                    Save Website Name
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}

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

      {/* Delete Content Confirmation Modal */}
      <Modal
        isOpen={!!deleteContentId}
        onClose={() => setDeleteContentId(null)}
        title="Delete Content"
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteContent}
        onCancel={() => setDeleteContentId(null)}
      >
        <p className="text-dark-muted">
          Are you sure you want to delete this content? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminPanel;