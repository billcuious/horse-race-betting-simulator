
import { GameState } from "./types";

// Calculate the loan amount available
export const calculateLoanAmount = (currentMoney: number): number => {
  return Math.floor(currentMoney * 0.5) + 200;
};

// Take a loan - updated to track loan usage per race
export const takeLoan = (gameState: GameState): GameState => {
  // Check if a loan has already been taken this race
  if (gameState.hasUsedLoanThisRace) {
    return gameState; // Don't allow another loan this race
  }
  
  const newState = { ...gameState };
  let loanAmount = calculateLoanAmount(newState.playerMoney);
  
  // Check for Underhanded Tactics - 40% higher loan interest
  const hasUnderhandedTactics = newState.playerHorse.attributes.some(attr => attr.name === "Underhanded Tactics");
  if (hasUnderhandedTactics) {
    // Apply 40% instead of the normal 25% interest by adjusting the amount taken
    loanAmount = Math.floor(loanAmount * 0.893); // ~10.7% reduction in loan amount to account for higher interest
  }
  
  newState.playerMoney += loanAmount;
  newState.loanAmount += loanAmount;
  newState.hasUsedLoanThisRace = true; // Mark that a loan has been used this race
  
  return newState;
};
