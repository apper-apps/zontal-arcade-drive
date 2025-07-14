export const getAllGames = async (db) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // In a real app, this would be a Firestore query
    // Ready for HTML5 games from html5.com to be uploaded
    const games = [];

    return [...games];
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