import { useState, useEffect } from "react";
import FirebaseContext from "@/hooks/useFirebase";

const FirebaseProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [adsenseSettings, setAdsenseSettings] = useState(null);

  // Mock Firebase initialization
  const db = "mock-firestore-db";
  const auth = "mock-auth";
  const app = "mock-firebase-app";

  useEffect(() => {
    // Simulate Firebase Auth initialization
    const initAuth = async () => {
      try {
        setLoadingAuth(true);
        
        // Simulate auth state check
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a mock user ID
        const mockUserId = crypto.randomUUID();
        setUserId(mockUserId);
        
        console.log("Firebase Auth initialized with user:", mockUserId);
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Fallback to anonymous user
        setUserId(crypto.randomUUID());
      } finally {
        setLoadingAuth(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    // Load AdSense settings
    const loadAdsenseSettings = async () => {
      try {
        // Simulate loading AdSense settings from Firestore
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock settings (empty by default)
        const mockSettings = {
          publisherId: "",
          adUnitIds: []
        };
        
        setAdsenseSettings(mockSettings);
      } catch (error) {
        console.error("Error loading AdSense settings:", error);
      }
    };

    if (userId) {
      loadAdsenseSettings();
    }
  }, [userId]);

  const updateAdsenseSettings = async (settings) => {
    // Simulate saving to Firestore
    await new Promise(resolve => setTimeout(resolve, 400));
    setAdsenseSettings(settings);
    console.log("AdSense settings updated:", settings);
    return settings;
  };

  const value = {
    app,
    db,
    auth,
    userId,
    loadingAuth,
    adsenseSettings,
    setAdsenseSettings: updateAdsenseSettings
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;