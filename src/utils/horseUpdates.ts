import { GameState, Horse } from "./types";
import { HORSE_ATTRIBUTES } from "./horseAttributes";
import { toast } from "sonner";

// Apply simulated training to AI horses
const applySimulatedTraining = (horse: Horse, currentRace: number, totalRaces: number): Horse => {
  const updatedHorse = { ...horse };
  
  // AI horses get small stat improvements each race to remain competitive
  const improvementChance = 0.7;
  const midSeasonBoost = currentRace >= totalRaces / 2;
  
  if (Math.random() < improvementChance) {
    // Random stat boost
    const statToImprove = Math.floor(Math.random() * 4);
    
    switch (statToImprove) {
      case 0: // Speed
        updatedHorse.displayedSpeed = Math.min(100, updatedHorse.displayedSpeed + (midSeasonBoost ? 2 : 1));
        updatedHorse.actualSpeed = updatedHorse.displayedSpeed * (0.8 + 0.2 * updatedHorse.endurance / 100);
        break;
      case 1: // Control
        updatedHorse.control = Math.min(100, updatedHorse.control + (midSeasonBoost ? 3 : 1.5));
        break;
      case 2: // Recovery
        updatedHorse.recovery = Math.min(100, updatedHorse.recovery + (midSeasonBoost ? 2.5 : 1.2));
        break;
      case 3: // Endurance
        updatedHorse.endurance = Math.min(100, updatedHorse.endurance + (midSeasonBoost ? 2 : 1));
        updatedHorse.actualSpeed = updatedHorse.displayedSpeed * (0.8 + 0.2 * updatedHorse.endurance / 100);
        break;
    }
  }
  
  return updatedHorse;
};

// Helper function to update a single horse's stats after a race
const updateHorseStatsAfterRace = (horse: Horse, currentRace: number, totalRaces: number, gameState: GameState): Horse => {
  const updatedHorse = { ...horse };
  
  // How much recovery gets drained is based on endurance (higher endurance = less drain)
  const recoveryLoss = Math.max(1, 10 - Math.floor(horse.endurance / 15));
  updatedHorse.recovery = Math.max(10, updatedHorse.recovery - recoveryLoss);
  
  // How much other stats degrade is based on recovery (higher recovery = less degradation)
  const statDegradation = Math.max(0, 8 - Math.floor(updatedHorse.recovery / 15));
  
  // Check for Extreme Trainer jockey effect - increased endurance loss
  const hasExtremeTraining = updatedHorse.attributes.some(attr => attr.name === "Extreme Training");
  if (hasExtremeTraining) {
    // 1.4x more endurance loss
    const additionalEnduranceLoss = Math.floor(statDegradation * 0.4);
    updatedHorse.endurance = Math.max(10, updatedHorse.endurance - additionalEnduranceLoss);
    
    // Check if it's time to reveal a new trait
    if (updatedHorse.traitRevealRace && currentRace >= updatedHorse.traitRevealRace) {
      // Add a new positive trait
      const existingTraitNames = updatedHorse.attributes.map(attr => attr.name);
      const availablePositiveTraits = HORSE_ATTRIBUTES.filter(
        attr => attr.isPositive && !existingTraitNames.includes(attr.name)
      );
      
      if (availablePositiveTraits.length > 0) {
        const newTrait = availablePositiveTraits[Math.floor(Math.random() * availablePositiveTraits.length)];
        updatedHorse.attributes.push(newTrait);
        updatedHorse.revealedAttributes.push(newTrait);
        
        // Show toast notification for new trait (this will be shown in GameContainer)
        toast.success(`Extreme Training paid off! Your horse gained a new trait: ${newTrait.name}`);
      }
      
      // Reset the trait reveal race to 0 so it doesn't keep adding traits
      updatedHorse.traitRevealRace = 0;
    }
  }
  
  // Check for Slippery Jockey effect - 10% faster speed decrease
  const hasSlipperyTactics = updatedHorse.attributes.some(attr => attr.name === "Slippery Tactics");
  if (hasSlipperyTactics) {
    // Add 10% more to speed degradation
    const additionalSpeedLoss = statDegradation * 0.1;
    if (statDegradation > 0) {
      updatedHorse.displayedSpeed = Math.max(40, updatedHorse.displayedSpeed - (statDegradation * 0.5 + additionalSpeedLoss));
    }
  }
  
  // Check for One Shot Jockey effect - double stat decline after race 10
  const hasOneShotSpecialist = updatedHorse.attributes.some(attr => attr.name === "One Shot Specialist");
  if (hasOneShotSpecialist && currentRace > 10) {
    // Double stat degradation post race 10
    if (statDegradation > 0) {
      updatedHorse.displayedSpeed = Math.max(40, updatedHorse.displayedSpeed - statDegradation * 0.5 * 2 - 5);
      updatedHorse.control = Math.max(10, updatedHorse.control - statDegradation * 0.7 * 2);
      updatedHorse.endurance = Math.max(10, updatedHorse.endurance - statDegradation * 0.3 * 2);
    }
  } else if (statDegradation > 0) {
    // Regular stat degradation for all other jockeys/races
    updatedHorse.displayedSpeed = Math.max(40, updatedHorse.displayedSpeed - statDegradation * 0.5);
    updatedHorse.control = Math.max(10, updatedHorse.control - statDegradation * 0.7);
    updatedHorse.endurance = Math.max(10, updatedHorse.endurance - statDegradation * 0.3);
  }
  
  updatedHorse.actualSpeed = updatedHorse.displayedSpeed * (0.8 + 0.2 * updatedHorse.endurance / 100);
  
  // Handle injury recovery
  if (updatedHorse.hasInjury && updatedHorse.injuryType === "mild") {
    updatedHorse.hasInjury = false;
    updatedHorse.injuryType = "none";
  }
  
  if (updatedHorse.hasInjury && updatedHorse.injuryType === "major") {
    updatedHorse.injuryType = "mild";
    updatedHorse.missNextRace = false;
  }
  
  return updatedHorse;
};

// Update horse stats after a race based on recovery and endurance
export const updateHorsesAfterRace = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  
  // Update player horse
  newState.playerHorse = updateHorseStatsAfterRace(
    newState.playerHorse, 
    newState.currentRace,
    newState.totalRaces,
    newState
  );
  
  // Update all competitors with both natural stat changes and simulated training
  newState.competitors = newState.competitors.map(horse => {
    // First apply natural race effects
    const updatedHorse = updateHorseStatsAfterRace(
      horse,
      newState.currentRace,
      newState.totalRaces,
      newState
    );
    
    // Then apply simulated training effects to AI horses
    return applySimulatedTraining(updatedHorse, newState.currentRace, newState.totalRaces);
  });
  
  // Reset the loan usage tracker for the next race
  newState.hasUsedLoanThisRace = false;
  
  return newState;
};
