import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import AboutUs from "@/components/pages/AboutUs";
import ContactUs from "@/components/pages/ContactUs";
import PrivacyPolicy from "@/components/pages/PrivacyPolicy";
import Disclaimer from "@/components/pages/Disclaimer";
import FirebaseProvider from "@/components/organisms/FirebaseProvider";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import AdminPanel from "@/components/pages/AdminPanel";
import GameDetailPage from "@/components/pages/GameDetailPage";
import HomePage from "@/components/pages/HomePage";
import { useFirebase } from "@/hooks/useFirebase";

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [websiteName, setWebsiteName] = useState(() => {
    return localStorage.getItem('websiteName') || 'Arcade Flow';
  });
  const { loadingAuth, userId } = useFirebase();

  // Update website name and persist to localStorage
  const updateWebsiteName = (newName) => {
    setWebsiteName(newName);
    localStorage.setItem('websiteName', newName);
  };
  // Handle game selection
  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setCurrentPage("gameDetail");
  };

  // Handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
    if (page === "home") {
      setSelectedGame(null);
    }
  };

  // Show loading screen during auth initialization
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
            </motion.div>
          </div>
<h2 className="text-2xl font-bold gradient-text mb-2">
            {websiteName}
          </h2>
          <p className="text-dark-muted">
            Initializing game portal...
          </p>
        </motion.div>
      </div>
    );
  }

  // Render current page
// Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "gameDetail":
        return (
          <GameDetailPage
            game={selectedGame}
            onBack={() => handleNavigation("home")}
          />
        );
      case "admin":
        return (
          <AdminPanel
            onBack={() => handleNavigation("home")}
          />
        );
      case "about":
        return (
          <AboutUs
            onBack={() => handleNavigation("home")}
          />
        );
      case "contact":
        return (
          <ContactUs
            onBack={() => handleNavigation("home")}
          />
        );
      case "privacy":
        return (
          <PrivacyPolicy
            onBack={() => handleNavigation("home")}
          />
        );
      case "disclaimer":
        return (
          <Disclaimer
            onBack={() => handleNavigation("home")}
          />
        );
      default:
        return (
          <HomePage
            searchTerm={searchTerm}
            onGameSelect={handleGameSelect}
/>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
<Header
        currentPage={currentPage}
        setCurrentPage={handleNavigation}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        userId={userId}
        websiteName={websiteName}
        updateWebsiteName={updateWebsiteName}
      />

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedGame?.Id || "")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-dark-surface border-t border-dark-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
<h3 className="text-lg font-semibold gradient-text mb-2">
              {websiteName}
            </h3>
            <p className="text-dark-muted mb-4">
              Your premier destination for HTML5 games
            </p>
            <div className="flex justify-center space-x-6 text-sm text-dark-muted">
              <span>© 2024 {websiteName}</span>
              <span>•</span>
              <span>{userId ? `User: ${userId.slice(-8).toUpperCase()}` : "Anonymous"}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#1F2937",
          border: "1px solid #374151",
          borderRadius: "12px",
          color: "#F9FAFB"
        }}
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

const App = () => {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
};

export default App;