export const getAllComments = async (db) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    // Mock comments data
    const mockComments = [
      {
        gameId: 1,
        userId: "user-1",
        username: "User-ABCD1234",
        commentText: "Amazing space adventure! The graphics are stunning and the gameplay is smooth.",
        timestamp: Date.now() - 86400000
      },
      {
        gameId: 1,
        userId: "user-2",
        username: "User-EFGH5678",
        commentText: "Really enjoyed exploring different planets. Great game!",
        timestamp: Date.now() - 172800000
      },
      {
        gameId: 2,
        userId: "user-3",
        username: "User-IJKL9012",
        commentText: "The puzzles are challenging but fair. Perfect for brain training.",
        timestamp: Date.now() - 259200000
      },
      {
        gameId: 3,
        userId: "user-1",
        username: "User-ABCD1234",
        commentText: "Fast-paced racing action! Love the different tracks.",
        timestamp: Date.now() - 345600000
      },
      {
        gameId: 4,
        userId: "user-4",
        username: "User-MNOP3456",
        commentText: "Classic fighting game mechanics done right. Nostalgic!",
        timestamp: Date.now() - 432000000
      }
    ];

    return [...mockComments];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};

export const getGameComments = async (db, gameId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allComments = await getAllComments(db);
  const gameComments = allComments.filter(comment => 
    comment.gameId === parseInt(gameId)
  );
  
  // Sort by timestamp (newest first)
  return gameComments.sort((a, b) => b.timestamp - a.timestamp);
};

export const saveComment = async (db, commentData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would save to Firestore
  console.log("Saved comment:", commentData);
  
  return { ...commentData };
};

export const deleteGameComments = async (db, gameId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app, this would delete all comments for the game
  console.log("Deleted all comments for game:", gameId);
  
  return true;
};