
import { Horse, RaceResult, GameState } from "./types";
import { toast } from "sonner";

// Calculate betting odds for a horse
export const calculateOdds = (horse: Horse, allHorses: Horse[]): number => {
  // Calculate average top speed of all horses
  const avgTopSpeed = allHorses.reduce((sum, h) => sum + h.actualSpeed, 0) / allHorses.length;
  
  // Horse's performance chance is based on its speed relative to the average
  const performanceRatio = horse.actualSpeed / avgTopSpeed;
  
  // Base odds calculation: lower means more likely to win
  let baseOdds = (1 / performanceRatio) * 2;
  
  // Adjust for control - better control reduces variance
  baseOdds -= (horse.control / 100) * 0.5;
  
  // Adjust for recovery - better recovery improves consistency
  baseOdds -= (horse.recovery / 100) * 0.3;
  
  // Check for crowd favorite trait
  const isCrowdFavorite = horse.attributes.some(attr => attr.name === "Crowd Favorite");
  if (isCrowdFavorite) {
    baseOdds *= 0.8; // 20% better odds for crowd favorites
  }
  
  // Ensure minimum odds of 1.2
  return Math.max(1.2, Math.min(15, baseOdds));
};

// Calculate a horse's performance in a race
export const calculateHorseRacePerformance = (
  horse: Horse,
  allHorses: Horse[],
  raceNumber: number,
  totalRaces: number,
  gameState: GameState
): { performance: number, events: string[] } => {
  const activeHorse = { ...horse };
  const events: string[] = [];
  
  // Check for One Shot Jockey effect - bonus for race 10
  const hasOneShotSpecialist = activeHorse.attributes.some(attr => attr.name === "One Shot Specialist");
  if (hasOneShotSpecialist && raceNumber === 10) {
    activeHorse.displayedSpeed = Math.min(100, activeHorse.displayedSpeed + 5);
    activeHorse.control = Math.min(100, activeHorse.control + 5);
    activeHorse.recovery = Math.min(100, activeHorse.recovery + 5);
    activeHorse.endurance = Math.min(100, activeHorse.endurance + 5);
    activeHorse.actualSpeed = activeHorse.displayedSpeed * (0.8 + 0.2 * activeHorse.endurance / 100);
    events.push("burst");
  }
  
  // Calculate average top speed of all horses for Dark Horse trait
  const avgTopSpeed = allHorses.reduce((sum, h) => sum + h.actualSpeed, 0) / allHorses.length;
  
  // Apply attribute effects
  activeHorse.attributes.forEach(attr => {
    if (attr.name === "Strong Finisher" && raceNumber > totalRaces / 2) {
      activeHorse.actualSpeed += 5;
    }
    
    if (attr.name === "Dark Horse") {
      const speedDiff = avgTopSpeed - activeHorse.actualSpeed;
      if (speedDiff > 0) {
        activeHorse.actualSpeed += speedDiff / 10;
      }
    }
    
    if (attr.name === "Poor Starter" && raceNumber <= totalRaces / 2) {
      activeHorse.actualSpeed -= 5;
    }
    
    if (attr.name === "Nervous Runner") {
      activeHorse.control = Math.max(10, activeHorse.control - (5 + Math.floor(Math.random() * 11)));
    }
    
    if (attr.name === "Unpredictable") {
      const fluctuation = Math.floor(Math.random() * 21) - 10;
      activeHorse.control = Math.max(10, Math.min(100, activeHorse.control + fluctuation));
      activeHorse.recovery = Math.max(10, Math.min(100, activeHorse.recovery + fluctuation));
    }
    
    if (attr.name === "Mud Runner" && Math.random() < 0.15) {
      activeHorse.displayedSpeed = Math.min(100, activeHorse.displayedSpeed + 5);
      activeHorse.actualSpeed = activeHorse.displayedSpeed * (0.8 + 0.2 * activeHorse.endurance / 100);
    }
    
    if (attr.name === "Sprinter") {
      activeHorse.displayedSpeed = Math.min(100, activeHorse.displayedSpeed + Math.random() * 3);
      activeHorse.actualSpeed = activeHorse.displayedSpeed * (0.8 + 0.2 * activeHorse.endurance / 100);
    }
    
    if (attr.name === "Late Bloomer" && raceNumber > 8) {
      activeHorse.actualSpeed += 10;
      activeHorse.control += 10;
      activeHorse.recovery += 10;
      activeHorse.endurance += 10;
    }
    
    if (attr.name === "Overachiever" && Math.random() < 0.2) {
      activeHorse.actualSpeed += 15;
    }
    
    if (attr.name === "Inconsistent") {
      const variance = Math.random() * 30 - 15; // -15 to +15
      activeHorse.actualSpeed += variance;
    }
    
    if (attr.name === "Spotlight Shy") {
      // If horse is in top 3 by displayed speed, reduce performance
      const position = [...allHorses].sort((a, b) => b.displayedSpeed - a.displayedSpeed)
        .findIndex(h => h.id === activeHorse.id);
      if (position < 3) {
        activeHorse.actualSpeed -= 10;
      }
    }
    
    // Handle rare trait effects
    if (attr.name === "Legendary Bloodline") {
      activeHorse.actualSpeed += 3;
      activeHorse.control += 2;
      if (Math.random() > 0.7) events.push("miracle");
    }
    
    if (attr.name === "Sixth Sense" && Math.random() > 0.8) {
      activeHorse.control += 10;
      events.push("perfect");
    }
    
    if (attr.name === "Phoenix Spirit" && activeHorse.recovery < 30) {
      activeHorse.actualSpeed += 15;
      events.push("comeback");
    }
    
    if (attr.name === "Heart of Gold" && Math.random() > 0.85) {
      activeHorse.actualSpeed += 8;
      activeHorse.control += 5;
      events.push("burst");
    }
    
    if (attr.name === "Soul Bond" && Math.random() > 0.7) {
      activeHorse.control += 5;
      events.push("perfect");
    }
    
    if (attr.name === "Time Dilation" && Math.random() > 0.95) {
      activeHorse.actualSpeed *= 1.3;
      events.push("miracle");
    }
    
    if (attr.name === "Miracle Worker" && activeHorse.hasInjury && Math.random() > 0.9) {
      activeHorse.hasInjury = false;
      activeHorse.injuryType = "none";
      events.push("miracle");
    }
    
    // Handle risk taker jockey effect
    if (attr.name === "Risk Taker" && Math.random() < 0.15) {
      activeHorse.actualSpeed += 15;
      events.push("burst");
    }
  });
  
  // Apply existing injury penalties
  if (activeHorse.hasInjury) {
    if (activeHorse.injuryType === "mild") {
      // 30% decrease in speed for mild injury
      activeHorse.actualSpeed = activeHorse.actualSpeed * 0.7;
    } else if (activeHorse.injuryType === "major") {
      // 50% decrease in speed for major injury
      activeHorse.actualSpeed = activeHorse.actualSpeed * 0.5;
    }
  }
  
  // Calculate min and max speed based on control and recovery
  let minSpeed = activeHorse.actualSpeed - (60 - activeHorse.control / 2);
  let maxSpeed = activeHorse.actualSpeed + (activeHorse.control / 10);
  
  minSpeed += activeHorse.recovery / 10;
  
  minSpeed = Math.max(10, minSpeed);
  maxSpeed = Math.max(minSpeed + 1, maxSpeed);
  
  let performanceMultiplier = 1;
  
  // Check for uninjurable trait
  const isUninjurable = activeHorse.attributes.some(attr => attr.name === "Uninjurable");
  
  // Injury check - skip for uninjurable horses
  if (!isUninjurable) {
    const injuryChance = Math.random() * 100;
    
    const isIronHorse = activeHorse.attributes.some(attr => attr.name === "Iron Horse");
    const isFragile = activeHorse.attributes.some(attr => attr.name === "Fragile");
    const isRiskTaker = activeHorse.attributes.some(attr => attr.name === "Risk Taker");
    
    let injuryThreshold = 90;
    
    if (isIronHorse) injuryThreshold = 95;
    if (isFragile) injuryThreshold = 85;
    if (isRiskTaker) injuryThreshold = 85; // Risk Taker has higher injury risk (90 -> 85)
    
    if (injuryChance > injuryThreshold) {
      activeHorse.hasInjury = true;
      events.push("injury");
      
      // Determine if it's a major injury - Risk Taker has higher risk of major injury
      const majorInjuryThreshold = isRiskTaker ? 95 : 97;
      
      if (injuryChance > majorInjuryThreshold) {
        activeHorse.injuryType = "major";
        activeHorse.missNextRace = true;
        performanceMultiplier = 0.5;
      } else {
        activeHorse.injuryType = "mild";
        performanceMultiplier = 0.7;
      }
    }
  }
  
  // Add random race events with low probability
  if (events.length === 0 && Math.random() > 0.85) {
    // Standard race events
    const possibleEvents = ["stumble", "burst", "tired", "distracted", "perfect", "jockey", "weather", "comeback", "nervous"];
    // Add new rare events
    const rareEvents = ["collision", "crowd"];
    
    // 5% chance of rare event
    if (Math.random() > 0.95) {
      events.push(rareEvents[Math.floor(Math.random() * rareEvents.length)]);
    } else {
      events.push(possibleEvents[Math.floor(Math.random() * possibleEvents.length)]);
    }
  }
  
  const finalPerformance = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * performanceMultiplier;
  
  return { performance: finalPerformance, events };
};

// Simulate and resolve a race
export const simulateRace = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const allHorses = [newState.playerHorse, ...newState.competitors];
  
  const performances: { horse: Horse; performance: number; events: string[] }[] = [];
  
  allHorses.forEach(horse => {
    if (horse.missNextRace) return;
    
    const { performance, events } = calculateHorseRacePerformance(
      horse,
      allHorses,
      newState.currentRace,
      newState.totalRaces,
      newState
    );
    
    performances.push({ horse, performance, events });
  });
  
  performances.sort((a, b) => {
    if (Math.abs(a.performance - b.performance) <= 1) {
      return b.horse.recovery - a.horse.recovery;
    }
    return b.performance - a.performance;
  });
  
  // Apply Slippery Jockey effect - 20% chance to move up one position (except to 1st)
  const hasSlipperyTactics = newState.playerHorse.attributes.some(attr => attr.name === "Slippery Tactics");
  
  if (hasSlipperyTactics) {
    // Find player horse index in performances
    const playerHorseIndex = performances.findIndex(p => p.horse.id === newState.playerHorse.id);
    
    // If player horse isn't already in 1st place and 20% chance hits
    if (playerHorseIndex > 1 && Math.random() < 0.2) {
      // Swap positions with the horse ahead
      const temp = performances[playerHorseIndex];
      performances[playerHorseIndex] = performances[playerHorseIndex - 1];
      performances[playerHorseIndex - 1] = temp;
      
      // Add jockey event for UI feedback
      performances[playerHorseIndex - 1].events.push("jockey");
    }
  }
  
  const results: RaceResult[] = performances.map((perf, index) => ({
    horseId: perf.horse.id,
    horseName: perf.horse.name,
    finalSpeed: perf.performance,
    position: index + 1,
    raceEvents: perf.events.length > 0 ? perf.events : undefined
  }));
  
  if (newState.lastBet && newState.lastBet.amount > 0) {
    const betHorse = allHorses.find(h => h.id === newState.lastBet?.horseId);
    const betHorseResult = results.find(r => r.horseId === newState.lastBet?.horseId);
    
    if (betHorse && betHorseResult) {
      const odds = calculateOdds(betHorse, allHorses);
      
      if (betHorseResult.position === 1) {
        const winnings = Math.floor(newState.lastBet.amount * odds);
        newState.playerMoney += winnings;
        toast.success(`Your bet on ${betHorse.name} won! You earned $${winnings}`);
      } else if (betHorseResult.position === 2) {
        const consolation = Math.floor(newState.lastBet.amount * 0.5);
        newState.playerMoney += consolation;
        toast.info(`Your horse placed 2nd. Small consolation payout: $${consolation}`);
      } else {
        toast.error(`Your bet on ${betHorse.name} did not win.`);
      }
    }
  }
  
  const playerHorseResult = results.find(r => r.horseId === newState.playerHorse.id);
  if (playerHorseResult) {
    let prizeMoney = 0;
    
    // Check for Celebrity Jockey effect - half prize money for top 3
    const hasCelebrityStatus = newState.playerHorse.attributes.some(attr => attr.name === "Celebrity Status");
    
    if (playerHorseResult.position === 1) {
      prizeMoney = hasCelebrityStatus ? 1000 : 2000; // Half prize money if Celebrity Jockey
    } else if (playerHorseResult.position === 2) {
      prizeMoney = hasCelebrityStatus ? 500 : 1000;
    } else if (playerHorseResult.position === 3) {
      prizeMoney = hasCelebrityStatus ? 250 : 500;
    }
    
    // Check for Celebrity Jockey - $300 bonus per race
    if (hasCelebrityStatus) {
      prizeMoney += 300;
      toast.success(`Celebrity Jockey earned $300 in sponsorships!`);
    }
    
    // Check for Underhanded Jockey - $1000 for last place
    const hasUnderhandedTactics = newState.playerHorse.attributes.some(attr => attr.name === "Underhanded Tactics");
    if (hasUnderhandedTactics && playerHorseResult.position === performances.length) {
      prizeMoney += 1000;
      toast.success(`Underhanded Jockey earned $1000 for last place!`);
    }
    
    // Check for One Shot Jockey - additional $1000 prize money on race 10
    const hasOneShotSpecialist = newState.playerHorse.attributes.some(attr => attr.name === "One Shot Specialist");
    if (hasOneShotSpecialist && newState.currentRace === 10 && playerHorseResult.position <= 3) {
      prizeMoney += 1000;
      toast.success(`One Shot Jockey earned an extra $1000 prize money!`);
    }
    
    if (prizeMoney > 0) {
      newState.playerMoney += prizeMoney;
      toast.success(`Your horse earned $${prizeMoney} in prize money!`);
      
      const lastTraining = Object.entries(newState.trainingsUsed)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (lastTraining[0] === "sync" && playerHorseResult.position <= 3) {
        newState.playerHorse.control = Math.min(100, newState.playerHorse.control + 3);
        toast.info("Sync Training bonus! Your horse gained +3 Control permanently.");
      }
    }
  }
  
  allHorses.forEach(horse => {
    const horseResult = results.find(r => r.horseId === horse.id);
    
    if (!horseResult) return;
    
    if (horse.injuryType !== "major") {
      horse.injuryType = "none";
      horse.hasInjury = false;
    }
  });
  
  newState.raceResults = results;
  
  newState.currentRace += 1;
  newState.lastBet = null;
  
  return newState;
};
