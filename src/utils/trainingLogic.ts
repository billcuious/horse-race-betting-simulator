
import { GameState, Horse } from "./types";
import { TRAINING_BASE_COSTS } from "./constants";

// Calculate how much a training costs based on how many times it's been used
export const getTrainingCost = (type: string, timesUsed: number): number => {
  const baseCost = TRAINING_BASE_COSTS[type as keyof typeof TRAINING_BASE_COSTS] || 500;
  return Math.floor(baseCost * (1 + timesUsed * 0.2));
};

// Helper function to apply training to a horse
export const applyTraining = (gameState: GameState, trainingType: "general" | "speed" | "rest" | "sync"): GameState => {
  const newState = { ...gameState };
  const horse = { ...newState.playerHorse };
  
  // Calculate cost and update player money
  const timesUsed = newState.trainingsUsed[trainingType] || 0;
  const cost = getTrainingCost(trainingType, timesUsed);
  newState.playerMoney -= cost;
  
  // Update trainings used counter
  newState.trainingsUsed = {
    ...newState.trainingsUsed,
    [trainingType]: timesUsed + 1
  };
  
  // Check for training resistant trait
  const isTrainingResistant = horse.attributes.some(attr => attr.name === "Training Resistant");
  const effectMultiplier = isTrainingResistant ? 0.5 : 1.0;
  
  // Apply training effects
  switch (trainingType) {
    case "general":
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 3 * effectMultiplier);
      horse.control = Math.min(100, horse.control + 2 * effectMultiplier);
      horse.endurance = Math.min(100, horse.endurance + 2 * effectMultiplier);
      horse.recovery = Math.max(10, horse.recovery - 5 * effectMultiplier); // Change to DECREASE recovery by 5
      break;
    case "speed":
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 8 * effectMultiplier);
      horse.control = Math.max(10, horse.control - 3 * effectMultiplier);
      horse.endurance = Math.max(10, horse.endurance - 3 * effectMultiplier);
      horse.recovery = Math.max(10, horse.recovery - 15 * effectMultiplier);
      break;
    case "rest":
      horse.recovery = Math.min(100, horse.recovery + 25 * effectMultiplier);
      horse.endurance = Math.min(100, horse.endurance + 3 * effectMultiplier);
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 1 * effectMultiplier);
      horse.control = Math.max(10, horse.control - 1 * effectMultiplier);
      break;
    case "sync":
      horse.control = Math.min(100, horse.control + 7 * effectMultiplier);
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 1 * effectMultiplier);
      horse.endurance = Math.min(100, horse.endurance + 3 * effectMultiplier);
      horse.recovery = Math.max(10, horse.recovery - 10 * effectMultiplier);
      break;
  }
  
  // Update actual speed based on displayed speed and endurance
  horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
  
  newState.playerHorse = horse;
  return newState;
};
