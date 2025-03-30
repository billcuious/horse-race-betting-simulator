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
  
  // For jockey effects (extreme trainer)
  traitRevealRace?: number;
};

export type RaceResult = {
  horseId: string;
  horseName: string;
  finalSpeed: number;
  position: number;
  raceEvents?: string[]; // Add this new property
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
  selectedJockeyId: string;
  hasUsedLoanThisRace: boolean; // Add this new field
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
  
  // Add rare trait chance (1% chance)
  if (Math.random() < 0.01 || isPlayerHorse) {
    const rareAttribute = RARE_HORSE_ATTRIBUTES[Math.floor(Math.random() * RARE_HORSE_ATTRIBUTES.length)];
    attributes.push(rareAttribute);
    numAttributes--; // Reduce normal attributes by 1 since we've added a rare one
  }
  
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
    
    // For jockey effects (extreme trainer)
    traitRevealRace: 0
  };
};

// Initialize a new game with jockey selection
export const initializeGame = (playerName: string, jockeyId: string = ""): GameState => {
  const totalRaces = 15; // Total races in the season
  const playerHorse = generateRandomHorse(true);
  playerHorse.name = `${playerName}'s ${generateHorseName()}`;
  
  // Apply jockey effects to the player's horse
  if (jockeyId) {
    applyJockeyEffects(playerHorse, jockeyId);
  }
  
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
    },
    selectedJockeyId: jockeyId,
    hasUsedLoanThisRace: false // Add this new field to track loan usage
  };
};

// Apply jockey effects to the player's horse
const applyJockeyEffects = (horse: Horse, jockeyId: string): void => {
  switch (jockeyId) {
    case "composed":
      // The Composed Jockey: -7 Speed, +10 Control, never gets injured
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 7);
      horse.control = Math.min(100, horse.control + 10);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      // Add the uninjurable trait
      const uninjurableTrait: HorseAttribute = {
        name: "Uninjurable",
        description: "This horse cannot be injured due to its composed jockey.",
        isPositive: true,
        effect: (h: Horse) => {
          // Effect is handled in injury calculation
        }
      };
      
      horse.attributes.push(uninjurableTrait);
      horse.revealedAttributes.push(uninjurableTrait);
      break;
      
    case "extreme":
      // The Extreme Trainer: Will gain a new positive trait after 4-8 races, faster endurance depletion
      const extremeTrainerTrait: HorseAttribute = {
        name: "Extreme Training",
        description: "This horse will gain a new positive trait after 4-8 races, but loses endurance faster.",
        isPositive: true,
        effect: (h: Horse) => {
          // Effect is handled in updateHorsesAfterRace
        }
      };
      
      horse.attributes.push(extremeTrainerTrait);
      horse.revealedAttributes.push(extremeTrainerTrait);
      
      // Set a random race number when the new trait will be added (between 4-8)
      horse.traitRevealRace = Math.floor(Math.random() * 5) + 4;
      break;
      
    case "veteran":
      // The Veteran Jockey: +15 Control, +10 Recovery, -5 Speed, -5 Endurance
      horse.control = Math.min(100, horse.control + 15);
      horse.recovery = Math.min(100, horse.recovery + 10);
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 5);
      horse.endurance = Math.max(10, horse.endurance - 5);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      const veteranTrait: HorseAttribute = {
        name: "Veteran Tactics",
        description: "This horse benefits from a veteran jockey's experience.",
        isPositive: true,
        effect: (h: Horse) => {
          // Effect already applied to base stats
        }
      };
      
      horse.attributes.push(veteranTrait);
      horse.revealedAttributes.push(veteranTrait);
      break;
      
    case "risk":
      // The Risk Taker: 15% chance for speed boost, 1.5x injury risk
      // No longer modifies starting stats, just adds a special trait
      const riskTakerTrait: HorseAttribute = {
        name: "Risk Taker",
        description: "This horse has a chance for a massive speed boost in each race but is more prone to injuries.",
        isPositive: true,
        effect: (h: Horse) => {
          // 15% chance for a speed boost during race
          if (Math.random() < 0.15) {
            h.displayedSpeed = Math.min(100, h.displayedSpeed * 1.2);
            h.actualSpeed = h.displayedSpeed * (0.8 + 0.2 * h.endurance / 100);
          }
        }
      };
      
      horse.attributes.push(riskTakerTrait);
      horse.revealedAttributes.push(riskTakerTrait);
      break;
  }
};

// Add new rare traits
export const RARE_HORSE_ATTRIBUTES: HorseAttribute[] = [
  {
    name: "Legendary Bloodline",
    description: "Descended from the greatest champions in racing history. A rare gift indeed.",
    isPositive: true,
    effect: (horse: Horse) => {
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 8);
      horse.control = Math.min(100, horse.control + 5);
      horse.endurance = Math.min(100, horse.endurance + 5);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
    }
  },
  {
    name: "Sixth Sense",
    description: "This horse seems to anticipate obstacles before they appear. Truly extraordinary.",
    isPositive: true,
    effect: (horse: Horse) => {
      horse.control = Math.min(100, horse.control + 15);
    }
  },
  {
    name: "Phoenix Spirit",
    description: "Can rise from the depths of exhaustion in miraculous fashion.",
    isPositive: true,
    effect: (horse: Horse) => {
      // Will activate when recovery is low during racing
      if (horse.recovery < 30) {
        horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 15);
        horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      }
    }
  },
  {
    name: "Heart of Gold",
    description: "Shows incredible determination in the face of challenges.",
    isPositive: true,
    effect: (horse: Horse) => {
      // Will provide a final burst when the horse is falling behind
      // Applied during race calculation
    }
  },
  {
    name: "Soul Bond",
    description: "Forms a deep connection with its jockey, enhancing performance.",
    isPositive: true,
    effect: (horse: Horse) => {
      horse.control = Math.min(100, horse.control + 8);
      horse.recovery = Math.min(100, horse.recovery + 8);
    }
  },
  {
    name: "Time Dilation",
    description: "Appears to enter a state where time itself slows down during critical moments.",
    isPositive: true,
    effect: (horse: Horse) => {
      // Has a small chance to trigger a massive speed boost during races
      if (Math.random() < 0.05) {
        horse.displayedSpeed = Math.min(100, horse.displayedSpeed * 1.3);
        horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      }
    }
  },
  {
    name: "Miracle Worker",
    description: "Known to achieve the impossible when all hope seems lost.",
    isPositive: true,
    effect: (horse: Horse) => {
      // Has a small chance to recover from injuries instantly
      if (horse.hasInjury && Math.random() < 0.1) {
        horse.hasInjury = false;
        horse.injuryType = "none";
        horse.missNextRace = false;
      }
    }
  }
];

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
      horse.recovery = Math.min(100, horse.recovery + 3 * effectMultiplier);
      break;
    case "speed":
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 6 * effectMultiplier);
      break;
    case "rest":
      horse.recovery = Math.min(100, horse.recovery + 15 * effectMultiplier);
      horse.endurance = Math.min(100, horse.endurance + 3 * effectMultiplier);
      break;
    case "sync":
      horse.control = Math.min(100, horse.control + 7 * effectMultiplier);
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 1 * effectMultiplier);
      break;
  }
  
  // Update actual speed based on displayed speed and endurance
  horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
  
  newState.playerHorse = horse;
  return newState;
};

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

// Take a loan - updated to track loan usage per race
export const takeLoan = (gameState: GameState): GameState => {
  // Check if a loan has already been taken this race
  if (gameState.hasUsedLoanThisRace) {
    return gameState; // Don't allow another loan this race
  }
  
  const newState = { ...gameState };
  const loanAmount = calculateLoanAmount(newState.playerMoney);
  
  newState.playerMoney += loanAmount;
  newState.loanAmount += loanAmount;
  newState.hasUsedLoanThisRace = true; // Mark that a loan has been used this race
  
  return newState;
};

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
const updateHorseStatsAfterRace = (horse: Horse, currentRace: number, totalRaces: number): Horse => {
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
  
  if (statDegradation > 0) {
    updatedHorse.displayedSpeed = Math.max(40, updatedHorse.displayedSpeed - statDegradation * 0.5);
    updatedHorse.control = Math.max(10, updatedHorse.control - statDegradation * 0.7);
    updatedHorse.endurance = Math.max(10, updatedHorse.endurance - statDegradation * 0.3);
    
    updatedHorse.actualSpeed = updatedHorse.displayedSpeed * (0.8 + 0.2 * updatedHorse.endurance / 100);
  }
  
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
    newState.totalRaces
  );
  
  // Update all competitors with both natural stat changes and simulated training
  newState.competitors = newState.competitors.map(horse => {
    // First apply natural race effects
    const updatedHorse = updateHorseStatsAfterRace(
      horse,
      newState.currentRace,
      newState.totalRaces
    );
    
    // Then apply simulated training effects to AI horses
    return applySimulatedTraining(updatedHorse, newState.currentRace, newState.totalRaces);
  });
  
  // Reset the loan usage tracker for the next race
  newState.hasUsedLoanThisRace = false;
  
  return newState;
};

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
  totalRaces: number
): { performance: number, events: string[] } => {
  const activeHorse = { ...horse };
  const events: string[] = [];
  
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
      newState.totalRaces
    );
    
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
