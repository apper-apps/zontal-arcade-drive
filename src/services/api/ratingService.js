export const getAllRatings = async (db) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    // Mock ratings data
    const mockRatings = [
      { gameId: 1, userId: "user-1", rating: 5, timestamp: Date.now() - 86400000 },
      { gameId: 1, userId: "user-2", rating: 4, timestamp: Date.now() - 172800000 },
      { gameId: 1, userId: "user-3", rating: 5, timestamp: Date.now() - 259200000 },
      { gameId: 2, userId: "user-1", rating: 4, timestamp: Date.now() - 172800000 },
      { gameId: 2, userId: "user-4", rating: 5, timestamp: Date.now() - 345600000 },
      { gameId: 3, userId: "user-2", rating: 3, timestamp: Date.now() - 259200000 },
      { gameId: 4, userId: "user-3", rating: 4, timestamp: Date.now() - 345600000 },
    ];

    return [...mockRatings];
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw new Error("Failed to fetch ratings");
  }
};

export const getGameRatings = async (db, gameId) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const allRatings = await getAllRatings(db);
  return allRatings.filter(rating => rating.gameId === parseInt(gameId));
};

export const getUserRating = async (db, gameId, userId) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const allRatings = await getAllRatings(db);
  return allRatings.find(rating => 
    rating.gameId === parseInt(gameId) && rating.userId === userId
  );
};

export const saveRating = async (db, ratingData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would use setDoc with merge: true to upsert
  const documentId = `${ratingData.gameId}-${ratingData.userId}`;
  
  console.log("Saved rating:", { documentId, ...ratingData });
  
  return { ...ratingData };
};

export const deleteGameRatings = async (db, gameId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app, this would delete all ratings for the game
  console.log("Deleted all ratings for game:", gameId);
  
  return true;
};