import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ 
  currentPage, 
  setCurrentPage, 
  searchTerm, 
  setSearchTerm, 
  userId 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: "Home" },
    { id: "admin", label: "Admin", icon: "Settings" }
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-dark-surface/90 backdrop-blur-lg border-b border-dark-card"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage("home")}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <ApperIcon name="Gamepad2" size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold gradient-text">
                Zontal Arcade
              </h1>
              <p className="text-xs text-dark-muted -mt-1">
                HTML5 Game Portal
              </p>
            </div>
          </motion.button>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <div className={cn(
              "relative transition-all duration-200",
              isSearchFocused && "scale-105"
            )}>
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted"
              />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-card rounded-xl",
                  "text-dark-text placeholder-dark-muted",
                  "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                  "transition-all duration-200",
                  isSearchFocused && "bg-dark-surface shadow-lg"
                )}
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  currentPage === item.id
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                    : "text-dark-muted hover:text-dark-text hover:bg-dark-card"
                )}
              >
                <ApperIcon name={item.icon} size={18} />
                <span className="hidden md:block">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* User ID Display (for debugging) */}
        {userId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="py-2 border-t border-dark-card"
          >
            <div className="flex items-center justify-center space-x-2 text-xs text-dark-muted">
              <ApperIcon name="User" size={14} />
              <span>User ID: {userId}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;