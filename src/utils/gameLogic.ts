import { toast } from "sonner";

// Types
export type HorseAttribute = {
  name: string;
  description: string;
  isPositive: boolean;
  effect: (horse: Horse) => void;
};

export type Horse = {
  id: string;
  name: string;
  displayedSpeed: number;
  actualSpeed: number;
  control: number;
  recovery: number;
  endurance: number;
  attributes: HorseAttribute[];
  revealedAttributes: HorseAttribute[];
  hasInjury: boolean;
  injuryType: "none" | "mild" | "major";
  missNextRace: boolean;
  lastUpdated: number; // The race number when the horse was last scouted
  
  // Initial stats for horses (for comparison when scouting)
  initialDisplayedSpeed: number;
  initialControl: number;
  initialRecovery: number;
  initialEndurance: number;
  
  // Scouted stats (what the player sees after scouting)
  scoutedStats: {
    displayedSpeed: number;
    control: number;
    recovery: number;
    endurance: number;
  };
  
  // Racing history for odds calculation
  raceHistory: Array<{position: number, raceNumber: number}>;
};

export type RaceResult = {
  horseId: string;
  horseName: string;
  finalSpeed: number;
  position: number;
  raceEvents?: string[]; // Race events that occurred
};

export type GameState = {
  playerMoney: number;
  seasonGoal: number;
  currentRace: number;
  totalRaces: number;
  playerHorse: Horse;
  competitors: Horse[];
  raceResults: RaceResult[];
  lastBet: { horseId: string; amount: number } | null;
  loanAmount: number;
  trainingsUsed: Record<string, number>;
};

// Constants
export const TRAINING_BASE_COSTS = {
  general: 500,
  speed: 800,
  rest: 0,
  sync: 600,
};

export const SCOUTING_COSTS = {
  basic: 300,
  deep: 700,
  ownHorse: 900,
};

// Calculate how much a training costs based on how many times it's been used
export const getTrainingCost = (type: string, timesUsed: number): number => {
  const baseCost = TRAINING_BASE_COSTS[type as keyof typeof TRAINING_BASE_COSTS] || 500;
  return Math.floor(baseCost * (1 + timesUsed * 0.2));
};

// Calculate the loan amount available
export const calculateLoanAmount = (currentMoney: number): number => {
  return Math.floor(currentMoney * 0.5) + 200;
};

// Generate random horse names
export const generateHorseName = (): string => {
  const firstParts = [
    "Swift", "Mighty", "Royal", "Golden", "Silver", "Thunder", "Shadow", "Midnight",
    "Lucky", "Storm", "Fiery", "Blazing", "Rapid", "Wild", "Regal", "Bold"
  ];
  
  const secondParts = [
    "Runner", "Spirit", "Wind", "Hooves", "Star", "Dream", "Flash", "Arrow",
    "Legend", "Rocket", "Strider", "Dash", "Champion", "Warrior", "Gallop", "Lightning"
  ];
  
  const first = firstParts[Math.floor(Math.random() * firstParts.length)];
  const second = secondParts[Math.floor(Math.random() * secondParts.length)];
  
  return `${first} ${second}`;
};

// Generate horse attributes
export const HORSE_ATTRIBUTES: HorseAttribute[] = [
  {
    name: "Dark Horse",
    description: "Gains a speed boost when expected to poll poorly",
    isPositive: true,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  },
  {
    name: "Strong Finisher",
    description: "Gains +5 speed in the second half of the season",
    isPositive: true,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  },
  {
    name: "Crowd Favorite",
    description: "Improves betting odds and gains +5 Control",
    isPositive: true,
    effect: (horse: Horse) => {
      horse.control += 5;
    }
  },
  {
    name: "Iron Horse",
    description: "Much lower chance of injury and +15 Recovery",
    isPositive: true,
    effect: (horse: Horse) => {
      horse.recovery = Math.min(100, horse.recovery + 15);
    }
  },
  {
    name: "Nervous Runner",
    description: "Randomly loses 5-15 Control each race",
    isPositive: false,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  },
  {
    name: "Fragile",
    description: "Higher injury chance and -20 Recovery",
    isPositive: false,
    effect: (horse: Horse) => {
      horse.recovery = Math.max(10, horse.recovery - 20);
    }
  },
  {
    name: "Poor Starter",
    description: "Speed decreased by 5 in first half of season",
    isPositive: false,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  },
  {
    name: "Unpredictable",
    description: "Recovery and Control randomly fluctuate each race",
    isPositive: false,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  },
  {
    name: "Mud Runner",
    description: "Performs better in poor conditions",
    isPositive: true,
    effect: (horse: Horse) => {
      // Add a 15% chance to gain 5 speed in each race
      if (Math.random() < 0.15) {
        horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 5);
        horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      }
    }
  },
  {
    name: "Sprinter",
    description: "Performs better in shorter races",
    isPositive: true,
    effect: (horse: Horse) => {
      // Add a random boost at the beginning of races
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + Math.random() * 3);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
    }
  },
  {
    name: "Late Bloomer",
    description: "Gains +10 to all stats after race 8",
    isPositive: true,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  },
  {
    name: "Adaptable",
    description: "Recovery rate increases by +10% after each race",
    isPositive: true,
    effect: (horse: Horse) => {
      horse.recovery = Math.min(100, horse.recovery + horse.recovery * 0.1);
    }
  },
  {
    name: "Consistent",
    description: "Maintains stable performance with low variance",
    isPositive: true,
    effect: (horse: Horse) => {
      horse.control = Math.min(100, horse.control + 5);
    }
  },
  {
    name: "Overachiever",
    description: "Has a 20% chance to perform significantly above stats",
    isPositive: true,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  },
  {
    name: "Training Resistant",
    description: "Gains less from training sessions",
    isPositive: false,
    effect: (horse: Horse) => {
      // Logic will be applied during training
    }
  },
  {
    name: "Inconsistent",
    description: "Performance varies widely from race to race",
    isPositive: false,
    effect: (horse: Horse) => {
      // Will be applied during race calculation
    }
  },
  {
    name: "Temperamental",
    description: "Occasionally refuses to perform at full capacity",
    isPositive: false,
    effect: (horse: Horse) => {
      if (Math.random() < 0.2) {
        horse.displayedSpeed = Math.max(40, horse.displayedSpeed * 0.9);
        horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      }
    }
  },
  {
    name: "Spotlight Shy",
    description: "Performs worse when odds are favorable",
    isPositive: false,
    effect: (horse: Horse) => {
      // Logic will be applied during race calculation
    }
  }
];

// Generate a random horse with balanced stats
export const generateRandomHorse = (isPlayerHorse: boolean = false): Horse => {
  const MAX_TOTAL_POINTS = 400;
  
  let totalPoints;
  if (isPlayerHorse) {
    totalPoints = Math.floor(Math.random() * 21) + 295; // 295-315
  } else {
    totalPoints = Math.floor(Math.random() * 51) + 280; // 280-330
  }
  
  const speedWeight = Math.random() * 0.7 + 0.3; // 0.3-1.0 - lower than before
  const enduranceWeight = Math.random() * 0.8 + 0.2; // 0.2-1.0
  const controlWeight = Math.random() * 0.8 + 0.2; // 0.2-1.0
  const recoveryWeight = Math.random() * 0.8 + 0.2; // 0.2-1.0
  
  const totalWeight = speedWeight + enduranceWeight + controlWeight + recoveryWeight;
  
  let displayedSpeed = Math.floor((speedWeight / totalWeight) * totalPoints * 0.6) + 25;
  let endurance = Math.floor((enduranceWeight / totalWeight) * totalPoints * 0.8) + 20;
  let control = Math.floor((controlWeight / totalWeight) * totalPoints * 0.8) + 20;
  let recovery = Math.floor((recoveryWeight / totalWeight) * totalPoints * 0.8) + 20;
  
  displayedSpeed = Math.max(40, Math.min(85, displayedSpeed));
  endurance = Math.max(30, Math.min(90, endurance));
  control = Math.max(30, Math.min(90, control));
  recovery = Math.max(30, Math.min(90, recovery));
  
  const actualSpeed = displayedSpeed * (0.8 + 0.2 * endurance / 100);
  
  let attributes: HorseAttribute[] = [];
  
  const attributeRoll = Math.random() * 100;
  let numAttributes = 0;
  
  if (attributeRoll < 5) numAttributes = 0;       // 5% chance: 0 traits
  else if (attributeRoll < 55) numAttributes = 1; // 50% chance: 1 trait
  else if (attributeRoll < 85) numAttributes = 2; // 30% chance: 2 traits
  else if (attributeRoll < 98) numAttributes = 3; // 13% chance: 3 traits
  else numAttributes = 4;                         // 2% chance: 4 traits
  
  let hasNegative = false;
  
  const needsNegative = numAttributes >= 3;
  
  const availableAttributes = [...HORSE_ATTRIBUTES];
  
  for (let i = 0; i < numAttributes; i++) {
    if (availableAttributes.length === 0) break;
    
    let attribute;
    
    if (needsNegative && !hasNegative && i === numAttributes - 1) {
      const negatives = availableAttributes.filter(a => !a.isPositive);
      if (negatives.length > 0) {
        const randIndex = Math.floor(Math.random() * negatives.length);
        attribute = negatives[randIndex];
        hasNegative = true;
      }
    } 
    else {
      const validAttributes = hasNegative 
        ? availableAttributes.filter(a => a.isPositive)
        : availableAttributes;
      
      if (validAttributes.length === 0) break;
      
      const randIndex = Math.floor(Math.random() * validAttributes.length);
      attribute = validAttributes[randIndex];
      
      if (!attribute.isPositive) {
        hasNegative = true;
      }
    }
    
    const attributeIndex = availableAttributes.findIndex(a => a.name === attribute.name);
    if (attributeIndex !== -1) {
      availableAttributes.splice(attributeIndex, 1);
      attributes.push(attribute);
    }
  }
  
  return {
    id: Math.random().toString(36).substring(2, 10),
    name: isPlayerHorse ? "Your Horse" : generateHorseName(),
    displayedSpeed,
    actualSpeed,
    control,
    recovery,
    endurance,
    attributes,
    revealedAttributes: isPlayerHorse ? [] : [],
    hasInjury: false,
    injuryType: "none",
    missNextRace: false,
    lastUpdated: 0, // Initial stats
    
    // Initialize initial stats with starting values
    initialDisplayedSpeed: displayedSpeed,
    initialControl: control,
    initialRecovery: recovery,
    initialEndurance: endurance,
    
    // Initialize scouted stats with starting values
    scoutedStats: {
      displayedSpeed: displayedSpeed,
      control: control,
      recovery: recovery,
      endurance: endurance
    },
    
    // Initialize race history
    raceHistory: []
  };
};

// Initialize a new game
export const initializeGame = (playerName: string): GameState => {
  const totalRaces = 15; // Total races in the season
  const playerHorse = generateRandomHorse(true);
  playerHorse.name = `${playerName}'s ${generateHorseName()}`;
  
  const competitors: Horse[] = [];
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
    }
  };
};

// Apply training to player's horse
export const applyTraining = (
  gameState: GameState,
  trainingType: "general" | "speed" | "rest" | "sync"
): GameState => {
  const newState = { ...gameState };
  const horse = { ...newState.playerHorse };
  
  newState.trainingsUsed[trainingType] = (newState.trainingsUsed[trainingType] || 0) + 1;
  
  const cost = getTrainingCost(trainingType, (newState.trainingsUsed[trainingType] || 1) - 1);
  
  switch (trainingType) {
    case "general":
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 3);
      horse.control = Math.min(100, horse.control + 2);
      horse.endurance = Math.min(100, horse.endurance + 2);
      horse.recovery = Math.max(10, horse.recovery - 5);
      break;
      
    case "speed":
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 8);
      horse.recovery = Math.max(10, horse.recovery - 15);
      horse.endurance = Math.max(10, horse.endurance - 3);
      horse.control = Math.max(10, horse.control - 3);
      break;
      
    case "rest":
      horse.recovery = Math.min(100, horse.recovery + 15);
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 1);
      horse.control = Math.max(10, horse.control - 1);
      horse.endurance = Math.max(10, horse.endurance - 1);
      break;
      
    case "sync":
      horse.control = Math.min(100, horse.control + 7);
      break;
  }
  
  horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
  
  newState.playerMoney -= cost;
  
  newState.playerHorse = horse;
  
  return newState;
};

// Scout a competitor horse to update its known stats
export const scoutHorse = (
  gameState: GameState,
  horseId: string,
  scoutType: "basic" | "deep"
): GameState => {
  const newState = { ...gameState };
  const horseIndex = newState.competitors.findIndex(h => h.id === horseId);
  
  if (horseIndex === -1) return newState;
  
  // Update the horse's lastUpdated to current race
  const horseToUpdate = { 
    ...newState.competitors[horseIndex],
    lastUpdated: newState.currentRace
  };
  
  // Update scouted stats to current real stats
  horseToUpdate.scoutedStats = {
    displayedSpeed: horseToUpdate.displayedSpeed,
    control: horseToUpdate.control,
    recovery: horseToUpdate.recovery,
    endurance: horseToUpdate.endurance
  };
  
  if (scoutType === "deep") {
    const unrevealed = horseToUpdate.attributes.filter(
      attr => !horseToUpdate.revealedAttributes.some(rev => rev.name === attr.name)
    );
    
    if (unrevealed.length > 0) {
      const randomAttr = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      horseToUpdate.revealedAttributes = [
        ...horseToUpdate.revealedAttributes,
        randomAttr
      ];
    }
  }
  
  newState.competitors[horseIndex] = horseToUpdate;
  newState.playerMoney -= SCOUTING_COSTS[scoutType];
  
  return newState;
};

// Scout the player's own horse
export const scoutOwnHorse = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const horse = { ...newState.playerHorse };
  
  horse.recovery = Math.max(10, horse.recovery - 5);
  
  const unrevealed = horse.attributes.filter(
    attr => !horse.revealedAttributes.some(rev => rev.name === attr.name)
  );
  
  if (unrevealed.length > 0) {
    const randomAttr = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    horse.revealedAttributes = [...horse.revealedAttributes, randomAttr];
  }
  
  newState.playerHorse = horse;
  
  newState.playerMoney -= SCOUTING_COSTS.ownHorse;
  
  return newState;
};

// Take out a loan
export const takeLoan = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const loanAmount = calculateLoanAmount(newState.playerMoney);
  
  newState.playerMoney += loanAmount;
  newState.loanAmount += loanAmount;
  
  return newState;
};

// Calculate betting odds for a horse based on past performance
export const calculateOdds = (horse: Horse, allHorses: Horse[], currentRace: number): number => {
  let odds = 2.0; // Changed from const to let so we can modify it
  
  if (horse.raceHistory.length > 0) {
    const recentHistory = horse.raceHistory
      .filter(r => r.raceNumber < currentRace)
      .sort((a, b) => b.raceNumber - a.raceNumber)
      .slice(0, 3);
    
    if (recentHistory.length > 0) {
      const avgPosition = recentHistory.reduce((sum, r) => sum + r.position, 0) / recentHistory.length;
      
      odds = 1.5 + (avgPosition / 2.5);
      
      if (recentHistory[0].position <= 3) {
        odds *= 0.85;
      } else if (recentHistory[0].position >= 7) {
        odds *= 1.2;
      }
    }
  } else {
    odds = 3.0;
  }
  
  const randomFactor = 0.9 + (Math.random() * 0.2);
  odds *= randomFactor;
  
  const isCrowdFavorite = horse.revealedAttributes.some(attr => attr.name === "Crowd Favorite");
  
  return isCrowdFavorite ? odds * 0.8 : odds;
};

// Apply simulated training to AI horses
const applySimulatedTraining = (horse: Horse, raceNumber: number, totalRaces: number): Horse => {
  const updatedHorse = { ...horse };
  
  const trainingChance = Math.min(0.7, 0.3 + (raceNumber / totalRaces) * 0.4);
  
  if (Math.random() < trainingChance) {
    const trainingType = Math.random();
    
    if (trainingType < 0.4) {
      updatedHorse.displayedSpeed = Math.min(100, updatedHorse.displayedSpeed + 2);
      updatedHorse.control = Math.min(100, updatedHorse.control + 1.5);
      updatedHorse.endurance = Math.min(100, updatedHorse.endurance + 1.5);
      updatedHorse.recovery = Math.max(10, updatedHorse.recovery - 3);
    } else if (trainingType < 0.7) {
      updatedHorse.displayedSpeed = Math.min(100, updatedHorse.displayedSpeed + 4);
      updatedHorse.recovery = Math.max(10, updatedHorse.recovery - 8);
      updatedHorse.control = Math.max(10, updatedHorse.control - 1);
    } else if (trainingType < 0.9) {
      updatedHorse.recovery = Math.min(100, updatedHorse.recovery + 10);
    } else {
      updatedHorse.control = Math.min(100, updatedHorse.control + 5);
      updatedHorse.displayedSpeed = Math.min(100, updatedHorse.displayedSpeed + 1);
    }
    
    updatedHorse.actualSpeed = updatedHorse.displayedSpeed * (0.8 + 0.2 * updatedHorse.endurance / 100);
  }
  
  return updatedHorse;
};

// Update horse stats after a race based on recovery and endurance
export const updateHorsesAfterRace = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  
  newState.playerHorse = updateHorseStatsAfterRace(newState.playerHorse);
  
  newState.competitors = newState.competitors.map(horse => {
    const updatedHorse = updateHorseStatsAfterRace(horse);
    
    return applySimulatedTraining(updatedHorse, newState.currentRace, newState.totalRaces);
  });
  
  return newState;
};

// Helper function to update a single horse's stats after a race
const updateHorseStatsAfterRace = (horse: Horse): Horse => {
  const updatedHorse = { ...horse };
  
  const recoveryLoss = Math.max(1, 10 - Math.floor(horse.endurance / 15));
  updatedHorse.recovery = Math.max(10, updatedHorse.recovery - recoveryLoss);
  
  const statDegradation = Math.max(0, 8 - Math.floor(updatedHorse.recovery / 15));
  
  if (statDegradation > 0) {
    updatedHorse.displayedSpeed = Math.max(40, updatedHorse.displayedSpeed - statDegradation * 0.5);
    updatedHorse.control = Math.max(10, updatedHorse.control - statDegradation * 0.7);
    updatedHorse.endurance = Math.max(10, updatedHorse.endurance - statDegradation * 0.3);
    
    updatedHorse.actualSpeed = updatedHorse.displayedSpeed * (0.8 + 0.2 * updatedHorse.endurance / 100);
  }
  
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

// Calculate a horse's performance in a race
export const calculateHorseRacePerformance = (
  horse: Horse,
  allHorses: Horse[],
  raceNumber: number,
  totalRaces: number
): { performance: number, injured: boolean, injuryType: "none" | "mild" | "major" } => {
  const activeHorse = { ...horse };
  
  let minSpeed, maxSpeed;
  
  const topCompetitors = [...allHorses].sort((a, b) => b.actualSpeed - a.actualSpeed).slice(0, 3);
  const avgTopSpeed = topCompetitors.reduce((sum, h) => sum + h.actualSpeed, 0) / topCompetitors.length;
  
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
      const position = [...allHorses].sort((a, b) => b.displayedSpeed - a.displayedSpeed)
        .findIndex(h => h.id === activeHorse.id);
      if (position < 3) {
        activeHorse.actualSpeed -= 10;
      }
    }
  });
  
  minSpeed = activeHorse.actualSpeed - (60 - activeHorse.control / 2);
  maxSpeed = activeHorse.actualSpeed + (activeHorse.control / 10);
  
  minSpeed += activeHorse.recovery / 10;
  
  minSpeed = Math.max(10, minSpeed);
  maxSpeed = Math.max(minSpeed + 1, maxSpeed);
  
  let performanceMultiplier = 1;
  let injured = false;
  let injuryType: "none" | "mild" | "major" = "none";
  
  const injuryChance = Math.random() * 100;
  
  const isIronHorse = activeHorse.attributes.some(attr => attr.name === "Iron Horse");
  const isFragile = activeHorse.attributes.some(attr => attr.name === "Fragile");
  
  let injuryThreshold = 90;
  
  if (isIronHorse) injuryThreshold = 95;
  if (isFragile) injuryThreshold = 85;
  
  if (injuryChance > injuryThreshold) {
    injured = true;
    
    if (injuryChance > 97) {
      injuryType = "major";
      performanceMultiplier = 0.5;
    } else {
      injuryType = "mild";
      performanceMultiplier = 0.7;
    }
  }
  
  const finalPerformance = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * performanceMultiplier;
  
  return { performance: finalPerformance, injured, injuryType };
};

// Simulate and resolve a race
export const simulateRace = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const allHorses = [newState.playerHorse, ...newState.competitors];
  
  const performances: { horse: Horse; performance: number; events: string[] }[] = [];
  
  allHorses.forEach(horse => {
    if (horse.missNextRace) return;
    
    const events: string[] = [];
    
    const { performance, injured, injuryType } = calculateHorseRacePerformance(
      horse,
      allHorses,
      newState.currentRace,
      newState.totalRaces
    );
    
    if (injured) {
      events.push("injury");
      
      if (injuryType === "mild") {
        horse.hasInjury = true;
        horse.injuryType = "mild";
      } else if (injuryType === "major") {
        horse.hasInjury = true;
        horse.injuryType = "major";
        horse.missNextRace = true;
      }
    }
    
    if (Math.random() > 0.85) {
      const possibleEvents = ["stumble", "burst", "tired", "distracted", "perfect", "jockey", "weather", "comeback", "nervous"];
      const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      events.push(event);
    }
    
    horse.attributes.forEach(attr => {
      if (attr.name === "Nervous Runner" && Math.random() > 0.6) {
        events.push("nervous");
      }
      if (attr.name === "Overachiever" && Math.random() > 0.8) {
        events.push("burst");
      }
      if (attr.name === "Inconsistent") {
        events.push(Math.random() > 0.5 ? "burst" : "tired");
      }
      if (attr.name === "Spotlight Shy" && events.length === 0 && Math.random() > 0.7) {
        events.push("distracted");
      }
    });
    
    performances.push({ horse, performance, events });
  });
  
  performances.sort((a, b) => {
    if (Math.abs(a.performance - b.performance) <= 1) {
      return b.horse.recovery - a.horse.recovery;
    }
    return b.performance - a.performance;
  });
  
  const results: RaceResult[] = performances.map((perf, index) => ({
    horseId: perf.horse.id,
    horseName: perf.horse.name,
    finalSpeed: perf.performance,
    position: index + 1,
    raceEvents: perf.events.length > 0 ? perf.events : undefined
  }));
  
  performances.forEach((perf, index) => {
    const horse = allHorses.find(h => h.id === perf.horse.id);
    if (horse) {
      horse.raceHistory.push({
        position: index + 1,
        raceNumber: newState.currentRace
      });
    }
  });
  
  if (newState.lastBet && newState.lastBet.amount > 0) {
    const betHorse = allHorses.find(h => h.id === newState.lastBet?.horseId);
    const betHorseResult = results.find(r => r.horseId === newState.lastBet?.horseId);
    
    if (betHorse && betHorseResult) {
      const odds = calculateOdds(betHorse, allHorses, newState.currentRace);
      
      if (betHorseResult.position === 1) {
        const winnings = Math.floor(newState.lastBet.amount * odds);
        newState.playerMoney += winnings;
        toast.success(`Your bet on ${betHorse.name} won! You earned $${winnings} (${odds.toFixed(1)}x odds)`);
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
    
    if (playerHorseResult.position === 1) {
      prizeMoney = 2000;
    } else if (playerHorseResult.position === 2) {
      prizeMoney = 1000;
    } else if (playerHorseResult.position === 3) {
      prizeMoney = 500;
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
  
  newState.raceResults = results;
  
  newState.currentRace += 1;
  newState.lastBet = null;
  
  return newState;
};

// Process a random event
export type RandomEvent = {
  id: string;
  title: string;
  description: string;
  type: "passive" | "choice";
  moneyEffect?: number;
  choicePrompt?: string;
  acceptEffect?: (gameState: GameState) => { gameState: GameState; message: string };
};

// Random events with reduced money impacts (max 600)
export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: "sponsor_bonus",
    title: "Sponsor Bonus",
    description: "You received a sponsorship bonus!",
    type: "passive",
    moneyEffect: 500
  },
  {
    id: "small_fine",
    title: "Small Fine",
    description: "You received a minor fine for administrative issues.",
    type: "passive",
    moneyEffect: -400
  },
  {
    id: "extra_revenue",
    title: "Extra Revenue",
    description: "Ticket sales exceeded expectations!",
    type: "passive",
    moneyEffect: 600
  },
  {
    id: "maintenance_costs",
    title: "Maintenance Costs",
    description: "Stable repairs were needed.",
    type: "passive",
    moneyEffect: -500
  },
  {
    id: "famous_jockey",
    title: "Famous Jockey Offer",
    description: "A famous jockey offers to race for you!",
    type: "choice",
    choicePrompt: "Pay $1800 to hire a famous jockey? This will greatly increase Speed (+10) but decrease Control (-15).",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 10);
      horse.control = Math.max(10, horse.control - 15);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 1800;
      
      return { 
        gameState: newState, 
        message: "The famous jockey has joined your team! Speed +10, Control -15"
      };
    }
  },
  {
    id: "sabotage_opportunity",
    title: "Sabotage Opportunity",
    description: "Someone offers to sabotage a competitor's horse...",
    type: "choice",
    choicePrompt: "Pay $1500 to sabotage a random competitor? This will guarantee them an injury next race, but there's a 30% chance you'll get caught.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      
      const targetIndex = Math.floor(Math.random() * newState.competitors.length);
      const targetHorse = { ...newState.competitors[targetIndex] };
      
      targetHorse.hasInjury = true;
      targetHorse.injuryType = Math.random() < 0.7 ? "mild" : "major";
      targetHorse.missNextRace = targetHorse.injuryType === "major";
      
      newState.competitors[targetIndex] = targetHorse;
      newState.playerMoney -= 1500;
      
      if (Math.random() < 0.3) {
        const punishments = [
          { effect: () => { newState.playerMoney -= 2500; return "You got caught! $2500 fine imposed."; } },
          { effect: () => { 
            newState.playerHorse.missNextRace = true; 
            return "You got caught! Your horse is banned from the next race."; 
          }},
          { effect: () => { 
            newState.playerHorse.hasInjury = true;
            newState.playerHorse.injuryType = "major";
            newState.playerHorse.missNextRace = true;
            return "You got caught! Someone retaliated and sabotaged your horse!"; 
          }}
        ];
        
        const punishment = punishments[Math.floor(Math.random() * punishments.length)];
        return { gameState: newState, message: punishment.effect() };
      }
      
      return { 
        gameState: newState, 
        message: `${targetHorse.name} has been sabotaged and will be injured next race!`
      };
    }
  },
  {
    id: "revolutionary_trainer",
    title: "Revolutionary Trainer",
    description: "A revolutionary trainer offers their services.",
    type: "choice",
    choicePrompt: "Pay $2000 for a revolutionary trainer? This will permanently increase Endurance (+10) and Recovery (+10) but reduce Speed (-5).",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      horse.endurance = Math.min(100, horse.endurance + 10);
      horse.recovery = Math.min(100, horse.recovery + 10);
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 5);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 2000;
      
      return { 
        gameState: newState, 
        message: "The revolutionary trainer has improved your horse! Endurance +10, Recovery +10, Speed -5"
      };
    }
  },
  {
    id: "experimental_diet",
    title: "Experimental Diet",
    description: "A new experimental diet could boost your horse's performance.",
    type: "choice",
    choicePrompt: "Pay $1200 for an experimental diet? 70% chance of +8 Speed, 30% chance of -12 Recovery.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      newState.playerMoney -= 1200;
      
      if (Math.random() < 0.7) {
        horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 8);
        horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
        
        newState.playerHorse = horse;
        return { 
          gameState: newState, 
          message: "The diet was successful! Your horse gained +8 Speed."
        };
      } else {
        horse.recovery = Math.max(10, horse.recovery - 12);
        
        newState.playerHorse = horse;
        return { 
          gameState: newState, 
          message: "The diet had adverse effects! Your horse lost -12 Recovery."
        };
      }
    }
  },
  {
    id: "bribe_officials",
    title: "Bribe The Officials",
    description: "An opportunity to influence the upcoming race...",
    type: "choice",
    choicePrompt: "Pay $2500 to bribe officials? This guarantees at least 3rd place next race, but 25% chance of getting caught and severe penalties.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      
      newState.playerHorse = {
        ...newState.playerHorse,
        displayedSpeed: Math.max(newState.playerHorse.displayedSpeed, 95),
        control: Math.max(newState.playerHorse.control, 90),
        actualSpeed: Math.max(newState.playerHorse.actualSpeed, 90)
      };
      
      newState.playerMoney -= 2500;
      
      if (Math.random() < 0.25) {
        newState.playerMoney -= 3000;
        newState.playerHorse.missNextRace = true;
        
        const horse = { ...newState.playerHorse };
        horse.injuryType = "major";
        horse.hasInjury = true;
        newState.playerHorse = horse;
        
        return { 
          gameState: newState, 
          message: "You were caught bribing officials! $3000 fine imposed and your horse is banned for the next 2 races!"
        };
      }
      
      return { 
        gameState: newState, 
        message: "The officials have been bribed. Your horse is guaranteed to place at least 3rd next race."
      };
    }
  },
  {
    id: "press_campaign",
    title: "Press Campaign",
    description: "Boost your horse's popularity with the media.",
    type: "choice",
    choicePrompt: "Pay $1000 for a press campaign? This permanently improves betting odds (+20%) but slightly decreases all stats (-3) for the next race due to distractions.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      if (!horse.attributes.some(attr => attr.name === "Crowd Favorite")) {
        const crowdFavorite = HORSE_ATTRIBUTES.find(attr => attr.name === "Crowd Favorite");
        if (crowdFavorite) {
          horse.attributes.push(crowdFavorite);
          horse.revealedAttributes.push(crowdFavorite);
        }
      }
      
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 3);
      horse.control = Math.max(10, horse.control - 3);
      horse.recovery = Math.max(10, horse.recovery - 3);
      horse.endurance = Math.max(10, horse.endurance - 3);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 1000;
      
      return { 
        gameState: newState, 
        message: "The press campaign was successful! Your horse now has the 'Crowd Favorite' trait, but stats are temporarily reduced for the next race."
      };
    }
  },
  {
    id: "rival_scandal",
    title: "Rival Trainer's Scandal",
    description: "An opportunity to leak damaging information about a rival.",
    type: "choice",
    choicePrompt: "Pay $1200 to leak a scandal? This will reduce the leading opponent's Control and Recovery by -10 each next race.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      
      const sortedOpponents = [...newState.competitors].sort((a, b) => b.actualSpeed - a.actualSpeed);
      const topOpponent = sortedOpponents[0];
      
      if (topOpponent) {
        const targetIndex = newState.competitors.findIndex(h => h.id === topOpponent.id);
        if (targetIndex !== -1) {
          const targetHorse = { ...newState.competitors[targetIndex] };
          targetHorse.control = Math.max(10, targetHorse.control - 10);
          targetHorse.recovery = Math.max(10, targetHorse.recovery - 10);
          
          newState.competitors[targetIndex] = targetHorse;
        }
      }
      
      newState.playerMoney -= 1200;
      
      return { 
        gameState: newState, 
        message: `Scandal revealed! ${topOpponent.name}'s Control and Recovery reduced by -10 each.`
      };
    }
  },
  {
    id: "black_market",
    title: "Black Market Equipment",
    description: "Illegal performance-enhancing equipment available on the black market.",
    type: "choice",
    choicePrompt: "Pay $2000 for illegal equipment? This will boost Speed (+6) and Control (+4), but 40% chance of equipment breaking causing Major Injury and fine.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 6);
      horse.control = Math.min(100, horse.control + 4);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 2000;
      
      if (Math.random() < 0.4) {
        horse.hasInjury = true;
        horse.injuryType = "major";
        horse.missNextRace = true;
        newState.playerMoney -= 1500;
        
        return { 
          gameState: newState, 
          message: "The illegal equipment failed during use! Your horse suffered a major injury and you've been fined $1500!"
        };
      }
      
      return { 
        gameState: newState, 
        message: "The black market equipment works perfectly! Your horse gained +6 Speed and +4 Control."
      };
    }
  }
];

// Get a random event
export const getRandomEvent = (): RandomEvent => {
  const roll = Math.random();
  
  if (roll < 0.7) {
    const passiveEvents = RANDOM_EVENTS.filter(e => e.type === "passive");
    return passiveEvents[Math.floor(Math.random() * passiveEvents.length)];
  } else {
    const choiceEvents = RANDOM_EVENTS.filter(e => e.type === "choice");
    return choiceEvents[Math.floor(Math.random() * choiceEvents.length)];
  }
};

// Apply a passive random event
export const applyRandomEvent = (gameState: GameState, event: RandomEvent): GameState => {
  if (event.type !== "passive" || !event.moneyEffect) return gameState;
  
  const newState = { ...gameState };
  newState.playerMoney += event.moneyEffect;
  
  return newState;
};

// Check if game is over
export const isGameOver = (gameState: GameState): boolean => {
  return gameState.currentRace > gameState.totalRaces;
};

// Check if game is won
export const isGameWon = (gameState: GameState): boolean => {
  return gameState.playerMoney >= gameState.seasonGoal;
};
