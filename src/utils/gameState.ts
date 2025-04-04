
import { GameState } from "./types";
import { generateRandomHorse } from "./horseGeneration";
import { applyJockeyEffects } from "./jockeyLogic";

// Check if game is over
export const isGameOver = (gameState: GameState): boolean => {
  return gameState.currentRace > gameState.totalRaces;
};

// Check if game is won
export const isGameWon = (gameState: GameState): boolean => {
  return gameState.playerMoney >= gameState.seasonGoal;
};

// Initialize a new game with jockey selection
export const initializeGame = (playerName: string, jockeyId: string = ""): GameState => {
  const totalRaces = 15; // Total races in the season
  const playerHorse = generateRandomHorse(true);
  playerHorse.name = `${playerName}'s ${generateRandomHorse().name}`;
  
  // Apply jockey effects to the player's horse
  if (jockeyId) {
    applyJockeyEffects(playerHorse, jockeyId);
  }
  
  const competitors = [];
  for (let i = 0; i < 9; i++) {
    competitors.push(generateRandomHorse());
  }
  
  const averageHorseValue = 4000;
  const seasonGoal = averageHorseValue * 3; // Challenging but achievable goal
  
  return {
    playerMoney: 2000, // Starting money
    seasonGoal,
    currentRace: 1,
    totalRaces,
    playerHorse,
    competitors,
    raceResults: [],
    lastBet: null,
    loanAmount: 0,
    trainingsUsed: {
      general: 0,
      speed: 0,
      rest: 0,
      sync: 0
    },
    selectedJockeyId: jockeyId,
    hasUsedLoanThisRace: false // Add this new field to track loan usage
  };
};
