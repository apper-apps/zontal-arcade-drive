export const getAllGames = async (db) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // In a real app, this would be a Firestore query
    // For demo purposes, we'll return mock data
    const mockGames = [
      {
        Id: 1,
        title: "Space Explorer",
        description: "Explore the vastness of space in this exciting adventure game. Navigate through asteroid fields and discover new planets.",
        category: "Adventure",
        imageUrl: "https://placehold.co/400x300/1F2937/3B82F6?text=Space+Explorer",
        gameUrl: "https://example.com/space-explorer",
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000
      },
      {
        Id: 2,
        title: "Puzzle Master",
        description: "Challenge your mind with increasingly difficult puzzles. Test your logic and problem-solving skills.",
        category: "Puzzle",
        imageUrl: "https://placehold.co/400x300/1F2937/10B981?text=Puzzle+Master",
        gameUrl: "https://example.com/puzzle-master",
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 172800000
      },
      {
        Id: 3,
        title: "Racing Thunder",
        description: "Feel the adrenaline rush in this high-speed racing game. Compete against AI opponents on various tracks.",
        category: "Racing",
        imageUrl: "https://placehold.co/400x300/1F2937/FBBF24?text=Racing+Thunder",
        gameUrl: "https://example.com/racing-thunder",
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 259200000
      },
      {
        Id: 4,
        title: "Arcade Fighter",
        description: "Classic arcade fighting action with modern graphics. Master combo moves and defeat opponents.",
        category: "Action",
        imageUrl: "https://placehold.co/400x300/1F2937/EF4444?text=Arcade+Fighter",
        gameUrl: "https://example.com/arcade-fighter",
        createdAt: Date.now() - 345600000,
        updatedAt: Date.now() - 345600000
      }
    ];

    return [...mockGames];
  } catch (error) {
    console.error("Error fetching games:", error);
    throw new Error("Failed to fetch games");
  }
};

export const getGameById = async (db, gameId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const games = await getAllGames(db);
  const game = games.find(g => g.Id === parseInt(gameId));
  
  if (!game) {
    throw new Error("Game not found");
  }
  
  return { ...game };
};

export const createGame = async (db, gameData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const games = await getAllGames(db);
  const maxId = games.length > 0 ? Math.max(...games.map(g => g.Id)) : 0;
  
  const newGame = {
    Id: maxId + 1,
    ...gameData,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  // In a real app, this would save to Firestore
  console.log("Created game:", newGame);
  
  return { ...newGame };
};

export const updateGame = async (db, gameId, gameData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const game = await getGameById(db, gameId);
  
  const updatedGame = {
    ...game,
    ...gameData,
    updatedAt: Date.now()
  };
  
  // In a real app, this would update in Firestore
  console.log("Updated game:", updatedGame);
  
  return { ...updatedGame };
};

export const deleteGame = async (db, gameId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would delete from Firestore
  console.log("Deleted game with ID:", gameId);
  
  return true;
};