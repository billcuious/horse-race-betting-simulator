
import { GameState } from "./types";
import { SCOUTING_COSTS } from "./constants";

// Scout a competitor's horse
export const scoutHorse = (gameState: GameState, horseId: string, scoutType: "basic" | "deep"): GameState => {
  const newState = { ...gameState };
  const horseIndex = newState.competitors.findIndex(h => h.id === horseId);
  
  if (horseIndex === -1) return gameState;
  
  const horse = { ...newState.competitors[horseIndex] };
  
  // Calculate cost and update player money
  const cost = SCOUTING_COSTS[scoutType];
  newState.playerMoney -= cost;
  
  // Update lastUpdated to current race number
  horse.lastUpdated = newState.currentRace;
  
  // Update scouted stats to actual stats
  horse.scoutedStats = {
    displayedSpeed: horse.displayedSpeed,
    control: horse.control,
    recovery: horse.recovery,
    endurance: horse.endurance
  };
  
  // For deep scouting, reveal a trait if available
  if (scoutType === "deep" && horse.attributes.length > horse.revealedAttributes.length) {
    const unrevealedAttributes = horse.attributes.filter(
      attr => !horse.revealedAttributes.some(revealed => revealed.name === attr.name)
    );
    
    if (unrevealedAttributes.length > 0) {
      const attributeToReveal = unrevealedAttributes[0];
      horse.revealedAttributes.push(attributeToReveal);
    }
  }
  
  newState.competitors[horseIndex] = horse;
  return newState;
};

// Scout player's own horse
export const scoutOwnHorse = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const horse = { ...newState.playerHorse };
  
  // Calculate cost and update player money
  const cost = SCOUTING_COSTS.ownHorse;
  newState.playerMoney -= cost;
  
  // If there are any unrevealed attributes, reveal one
  if (horse.attributes.length > horse.revealedAttributes.length) {
    const unrevealedAttributes = horse.attributes.filter(
      attr => !horse.revealedAttributes.some(revealed => revealed.name === attr.name)
    );
    
    if (unrevealedAttributes.length > 0) {
      const attributeToReveal = unrevealedAttributes[0];
      horse.revealedAttributes.push(attributeToReveal);
    }
  }
  
  newState.playerHorse = horse;
  return newState;
};
