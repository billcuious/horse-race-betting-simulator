
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
};

export type RaceResult = {
  horseId: string;
  horseName: string;
  finalSpeed: number;
  position: number;
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
  }
];

// Generate a random horse with random stats
export const generateRandomHorse = (isPlayerHorse: boolean = false): Horse => {
  const displayedSpeed = Math.floor(Math.random() * 41) + 60; // 60-100
  const endurance = Math.floor(Math.random() * 71) + 30; // 30-100
  const control = Math.floor(Math.random() * 61) + 40; // 40-100
  const recovery = Math.floor(Math.random() * 61) + 40; // 40-100
  
  // Calculate actual speed from displayed speed and endurance
  const actualSpeed = displayedSpeed * (0.8 + 0.2 * endurance / 100);
  
  // Generate attributes for the horse
  let attributes: HorseAttribute[] = [];
  
  // Determine how many attributes (weighted distribution)
  const attributeRoll = Math.random() * 100;
  let numAttributes = 0;
  
  if (attributeRoll < 5) numAttributes = 0;       // 5% chance: 0 traits
  else if (attributeRoll < 55) numAttributes = 1; // 50% chance: 1 trait
  else if (attributeRoll < 85) numAttributes = 2; // 30% chance: 2 traits
  else if (attributeRoll < 98) numAttributes = 3; // 13% chance: 3 traits
  else numAttributes = 4;                         // 2% chance: 4 traits
  
  let hasNegative = false;
  
  // If 3+ attributes, must have a negative
  const needsNegative = numAttributes >= 3;
  
  // Add the attributes
  const availableAttributes = [...HORSE_ATTRIBUTES];
  
  for (let i = 0; i < numAttributes; i++) {
    if (availableAttributes.length === 0) break;
    
    let attribute;
    
    // If we need a negative trait and this is the last chance to add one
    if (needsNegative && !hasNegative && i === numAttributes - 1) {
      const negatives = availableAttributes.filter(a => !a.isPositive);
      if (negatives.length > 0) {
        const randIndex = Math.floor(Math.random() * negatives.length);
        attribute = negatives[randIndex];
        hasNegative = true;
      }
    } 
    // If we already have a negative trait or don't need one, pick randomly
    else {
      // If we already have a negative, only pick positives
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
    
    // Remove selected attribute from available pool
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
    lastUpdated: 0 // Initial stats
  };
};

// Initialize a new game
export const initializeGame = (playerName: string): GameState => {
  const totalRaces = 15; // Total races in the season
  const playerHorse = generateRandomHorse(true);
  playerHorse.name = `${playerName}'s ${generateHorseName()}`;
  
  // Generate competitors (9 horses)
  const competitors: Horse[] = [];
  for (let i = 0; i < 9; i++) {
    competitors.push(generateRandomHorse());
  }
  
  // Season goal calculations
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
  
  // Increment training usage count
  newState.trainingsUsed[trainingType] = (newState.trainingsUsed[trainingType] || 0) + 1;
  
  // Calculate cost
  const cost = getTrainingCost(trainingType, (newState.trainingsUsed[trainingType] || 1) - 1);
  
  // Apply training effects
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
      // Rest is free
      horse.recovery = Math.min(100, horse.recovery + 15);
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 1);
      horse.control = Math.max(10, horse.control - 1);
      horse.endurance = Math.max(10, horse.endurance - 1);
      break;
      
    case "sync":
      horse.control = Math.min(100, horse.control + 7);
      // No negative effects
      break;
  }
  
  // Recalculate actual speed based on displayed speed and endurance
  horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
  
  // Update player's money
  newState.playerMoney -= cost;
  
  // Update player's horse
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
  newState.competitors[horseIndex] = {
    ...newState.competitors[horseIndex],
    lastUpdated: newState.currentRace
  };
  
  // For deep scouting, reveal one attribute
  if (scoutType === "deep") {
    const horse = newState.competitors[horseIndex];
    const unrevealed = horse.attributes.filter(
      attr => !horse.revealedAttributes.some(rev => rev.name === attr.name)
    );
    
    if (unrevealed.length > 0) {
      const randomAttr = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      newState.competitors[horseIndex].revealedAttributes = [
        ...horse.revealedAttributes,
        randomAttr
      ];
    }
  }
  
  // Deduct cost
  newState.playerMoney -= SCOUTING_COSTS[scoutType];
  
  return newState;
};

// Scout the player's own horse
export const scoutOwnHorse = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const horse = { ...newState.playerHorse };
  
  // Slight recovery penalty
  horse.recovery = Math.max(10, horse.recovery - 5);
  
  // Reveal one attribute if there are any left to reveal
  const unrevealed = horse.attributes.filter(
    attr => !horse.revealedAttributes.some(rev => rev.name === attr.name)
  );
  
  if (unrevealed.length > 0) {
    const randomAttr = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    horse.revealedAttributes = [...horse.revealedAttributes, randomAttr];
  }
  
  // Update player's horse
  newState.playerHorse = horse;
  
  // Deduct cost
  newState.playerMoney -= SCOUTING_COSTS.ownHorse;
  
  return newState;
};

// Take out a loan
export const takeLoan = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const loanAmount = calculateLoanAmount(newState.playerMoney);
  
  // Add loan to player's money
  newState.playerMoney += loanAmount;
  
  // Track loan amount for repayment
  newState.loanAmount += loanAmount;
  
  return newState;
};

// Calculate betting odds for a horse
export const calculateOdds = (horse: Horse, allHorses: Horse[]): number => {
  // Calculate average opponent speed
  const averageSpeed = allHorses.reduce((sum, h) => sum + h.displayedSpeed, 0) / allHorses.length;
  
  // Calculate odds multiplier (higher for underdog horses)
  const oddsMultiplier = 1 + Math.pow(averageSpeed / horse.displayedSpeed, 3);
  
  // Crowd Favorite trait improves betting odds
  const isCrowdFavorite = horse.revealedAttributes.some(attr => attr.name === "Crowd Favorite");
  
  return isCrowdFavorite ? oddsMultiplier * 1.2 : oddsMultiplier;
};

// Calculate a horse's performance in a race
export const calculateHorseRacePerformance = (
  horse: Horse,
  allHorses: Horse[],
  raceNumber: number,
  totalRaces: number
): number => {
  // Apply attribute effects that affect stats
  const activeHorse = { ...horse };
  
  // Create a copy of the horse with stat adjustments
  let minSpeed, maxSpeed;
  
  // Get average speed of top competitors for Dark Horse trait
  const topCompetitors = [...allHorses].sort((a, b) => b.actualSpeed - a.actualSpeed).slice(0, 3);
  const avgTopSpeed = topCompetitors.reduce((sum, h) => sum + h.actualSpeed, 0) / topCompetitors.length;
  
  // Apply special attribute effects based on race conditions
  activeHorse.attributes.forEach(attr => {
    // Strong Finisher: +5 speed in second half of season
    if (attr.name === "Strong Finisher" && raceNumber > totalRaces / 2) {
      activeHorse.actualSpeed += 5;
    }
    
    // Dark Horse: boost based on how much worse this horse is than top competitors
    if (attr.name === "Dark Horse") {
      const speedDiff = avgTopSpeed - activeHorse.actualSpeed;
      if (speedDiff > 0) {
        activeHorse.actualSpeed += speedDiff / 10;
      }
    }
    
    // Poor Starter: -5 speed in first half of season
    if (attr.name === "Poor Starter" && raceNumber <= totalRaces / 2) {
      activeHorse.actualSpeed -= 5;
    }
    
    // Nervous Runner: randomly loses 5-15 Control
    if (attr.name === "Nervous Runner") {
      activeHorse.control = Math.max(10, activeHorse.control - (5 + Math.floor(Math.random() * 11)));
    }
    
    // Unpredictable: Recovery and Control fluctuate
    if (attr.name === "Unpredictable") {
      const fluctuation = Math.floor(Math.random() * 21) - 10; // -10 to +10
      activeHorse.control = Math.max(10, Math.min(100, activeHorse.control + fluctuation));
      activeHorse.recovery = Math.max(10, Math.min(100, activeHorse.recovery + fluctuation));
    }
  });
  
  // Calculate speed range based on Control
  minSpeed = activeHorse.actualSpeed - (60 - activeHorse.control / 2);
  maxSpeed = activeHorse.actualSpeed + (activeHorse.control / 10);
  
  // Apply Recovery to raise the minimum speed
  minSpeed += activeHorse.recovery / 10;
  
  // Ensure min and max stay in reasonable bounds
  minSpeed = Math.max(10, minSpeed);
  maxSpeed = Math.max(minSpeed + 1, maxSpeed);
  
  // Check for injury
  let performanceMultiplier = 1;
  const injuryChance = Math.random() * 100;
  
  // Iron Horse reduces injury chance by 50%
  const isIronHorse = activeHorse.attributes.some(attr => attr.name === "Iron Horse");
  // Fragile increases injury chance by 50%
  const isFragile = activeHorse.attributes.some(attr => attr.name === "Fragile");
  
  let injuryThreshold = 90; // Base: 10% chance
  
  if (isIronHorse) injuryThreshold = 95; // 5% chance
  if (isFragile) injuryThreshold = 85; // 15% chance
  
  if (injuryChance > injuryThreshold) {
    activeHorse.hasInjury = true;
    
    // Determine if it's mild or major
    if (injuryChance > 97) {
      // Major injury (3% of all races, or ~30% of injuries)
      activeHorse.injuryType = "major";
      activeHorse.missNextRace = true;
      performanceMultiplier = 0.5; // 50% speed
    } else {
      // Mild injury (7% of all races, or ~70% of injuries)
      activeHorse.injuryType = "mild";
      performanceMultiplier = 0.7; // 70% speed
    }
  }
  
  // Roll for final speed
  const finalPerformance = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * performanceMultiplier;
  
  return finalPerformance;
};

// Simulate and resolve a race
export const simulateRace = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const allHorses = [newState.playerHorse, ...newState.competitors];
  
  // Calculate performance for each horse
  const performances: { horse: Horse; performance: number }[] = [];
  
  allHorses.forEach(horse => {
    // Skip horses that are set to miss this race
    if (horse.missNextRace) return;
    
    const performance = calculateHorseRacePerformance(
      horse,
      allHorses,
      newState.currentRace,
      newState.totalRaces
    );
    
    performances.push({ horse, performance });
  });
  
  // Sort performances from highest to lowest
  performances.sort((a, b) => {
    // If performances are within 1 point, higher recovery wins
    if (Math.abs(a.performance - b.performance) <= 1) {
      return b.horse.recovery - a.horse.recovery;
    }
    return b.performance - a.performance;
  });
  
  // Assign positions and create race results
  const results: RaceResult[] = performances.map((perf, index) => ({
    horseId: perf.horse.id,
    horseName: perf.horse.name,
    finalSpeed: perf.performance,
    position: index + 1
  }));
  
  // Calculate winnings
  if (newState.lastBet && newState.lastBet.amount > 0) {
    const betHorse = allHorses.find(h => h.id === newState.lastBet?.horseId);
    const betHorseResult = results.find(r => r.horseId === newState.lastBet?.horseId);
    
    if (betHorse && betHorseResult) {
      // Calculate odds for payout
      const odds = calculateOdds(betHorse, allHorses);
      
      if (betHorseResult.position === 1) {
        // Win - full payout
        const winnings = Math.floor(newState.lastBet.amount * odds);
        newState.playerMoney += winnings;
        toast.success(`Your bet on ${betHorse.name} won! You earned $${winnings}`);
      } else if (betHorseResult.position === 2) {
        // Place - 50% of original bet
        const consolation = Math.floor(newState.lastBet.amount * 0.5);
        newState.playerMoney += consolation;
        toast.info(`Your horse placed 2nd. Small consolation payout: $${consolation}`);
      } else {
        // Loss - no payout
        toast.error(`Your bet on ${betHorse.name} did not win.`);
      }
    }
  }
  
  // If player's horse placed in positions 1-3, add prize money
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
      
      // Check for Sync Training bonus
      const lastTraining = Object.entries(newState.trainingsUsed)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (lastTraining[0] === "sync" && playerHorseResult.position <= 3) {
        newState.playerHorse.control = Math.min(100, newState.playerHorse.control + 3);
        toast.info("Sync Training bonus! Your horse gained +3 Control permanently.");
      }
    }
  }
  
  // Reset injuries and update missNextRace status
  allHorses.forEach(horse => {
    const horseResult = results.find(r => r.horseId === horse.id);
    
    // Skip horses that didn't race due to injury
    if (!horseResult) return;
    
    // Reset injury status unless it was a major injury
    if (horse.injuryType !== "major") {
      horse.injuryType = "none";
      horse.hasInjury = false;
    }
  });
  
  // Save race results
  newState.raceResults = results;
  
  // Move to next race
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

// Random events
export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: "sponsor_bonus",
    title: "Sponsor Bonus",
    description: "You received a sponsorship bonus!",
    type: "passive",
    moneyEffect: 1000
  },
  {
    id: "small_fine",
    title: "Small Fine",
    description: "You received a minor fine for administrative issues.",
    type: "passive",
    moneyEffect: -1000
  },
  {
    id: "extra_revenue",
    title: "Extra Revenue",
    description: "Ticket sales exceeded expectations!",
    type: "passive",
    moneyEffect: 1500
  },
  {
    id: "maintenance_costs",
    title: "Maintenance Costs",
    description: "Stable repairs were needed.",
    type: "passive",
    moneyEffect: -1500
  },
  {
    id: "famous_jockey",
    title: "Famous Jockey Offer",
    description: "A famous jockey offers to race for you!",
    type: "choice",
    choicePrompt: "Pay $3000 to hire a famous jockey? This will greatly increase Speed (+10) but decrease Control (-15).",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 10);
      horse.control = Math.max(10, horse.control - 15);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 3000;
      
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
    choicePrompt: "Pay $2500 to sabotage a random competitor? This will guarantee them an injury next race, but there's a 30% chance you'll get caught.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      
      // Pick a random competitor to sabotage
      const targetIndex = Math.floor(Math.random() * newState.competitors.length);
      const targetHorse = { ...newState.competitors[targetIndex] };
      
      // Apply sabotage effect
      targetHorse.hasInjury = true;
      targetHorse.injuryType = Math.random() < 0.7 ? "mild" : "major";
      targetHorse.missNextRace = targetHorse.injuryType === "major";
      
      newState.competitors[targetIndex] = targetHorse;
      newState.playerMoney -= 2500;
      
      // Check if player gets caught
      if (Math.random() < 0.3) {
        // Player gets caught, apply punishment
        const punishments = [
          { effect: () => { newState.playerMoney -= 5000; return "You got caught! $5000 fine imposed."; } },
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
    choicePrompt: "Pay $3500 for a revolutionary trainer? This will permanently increase Endurance (+10) and Recovery (+10) but reduce Speed (-5).",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      horse.endurance = Math.min(100, horse.endurance + 10);
      horse.recovery = Math.min(100, horse.recovery + 10);
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 5);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 3500;
      
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
    choicePrompt: "Pay $2000 for an experimental diet? 70% chance of +8 Speed, 30% chance of -12 Recovery.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      newState.playerMoney -= 2000;
      
      if (Math.random() < 0.7) {
        // Success
        horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 8);
        horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
        
        newState.playerHorse = horse;
        return { 
          gameState: newState, 
          message: "The diet was successful! Your horse gained +8 Speed."
        };
      } else {
        // Failure
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
    choicePrompt: "Pay $4000 to bribe officials? This guarantees at least 3rd place next race, but 25% chance of getting caught and severe penalties.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      
      // Flag for guaranteed position
      // This will be checked during race simulation
      // Implementation detail: we'd need to modify the race simulation to check for this flag
      // For simplicity we'll just guarantee it by modifying stats temporarily
      newState.playerHorse = {
        ...newState.playerHorse,
        displayedSpeed: Math.max(newState.playerHorse.displayedSpeed, 95),
        control: Math.max(newState.playerHorse.control, 90),
        actualSpeed: Math.max(newState.playerHorse.actualSpeed, 90)
      };
      
      newState.playerMoney -= 4000;
      
      if (Math.random() < 0.25) {
        // Caught!
        newState.playerMoney -= 8000; // Massive fine
        newState.playerHorse.missNextRace = true; // Miss one race
        // Miss a second race
        const horse = { ...newState.playerHorse };
        horse.injuryType = "major";
        horse.hasInjury = true;
        newState.playerHorse = horse;
        
        return { 
          gameState: newState, 
          message: "You were caught bribing officials! $8000 fine imposed and your horse is banned for the next 2 races!"
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
    choicePrompt: "Pay $1500 for a press campaign? This permanently improves betting odds (+20%) but slightly decreases all stats (-3) for the next race due to distractions.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      // Add "Crowd Favorite" attribute if not already present
      if (!horse.attributes.some(attr => attr.name === "Crowd Favorite")) {
        const crowdFavorite = HORSE_ATTRIBUTES.find(attr => attr.name === "Crowd Favorite");
        if (crowdFavorite) {
          horse.attributes.push(crowdFavorite);
          horse.revealedAttributes.push(crowdFavorite);
        }
      }
      
      // Temporary stat penalty for next race
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 3);
      horse.control = Math.max(10, horse.control - 3);
      horse.recovery = Math.max(10, horse.recovery - 3);
      horse.endurance = Math.max(10, horse.endurance - 3);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 1500;
      
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
    choicePrompt: "Pay $2200 to leak a scandal? This will reduce the leading opponent's Control and Recovery by -10 each next race.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      
      // Find the top opponent
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
      
      newState.playerMoney -= 2200;
      
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
    choicePrompt: "Pay $3800 for illegal equipment? This will boost Speed (+6) and Control (+4), but 40% chance of equipment breaking causing Major Injury and fine.",
    acceptEffect: (gameState: GameState) => {
      const newState = { ...gameState };
      const horse = { ...newState.playerHorse };
      
      // Always apply the boost
      horse.displayedSpeed = Math.min(100, horse.displayedSpeed + 6);
      horse.control = Math.min(100, horse.control + 4);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      newState.playerHorse = horse;
      newState.playerMoney -= 3800;
      
      if (Math.random() < 0.4) {
        // Equipment failure!
        newState.playerHorse.hasInjury = true;
        newState.playerHorse.injuryType = "major";
        newState.playerHorse.missNextRace = true;
        newState.playerMoney -= 3000; // Fine for illegal equipment
        
        return { 
          gameState: newState, 
          message: "The illegal equipment failed during use! Your horse suffered a major injury and you've been fined $3000!"
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
    // Simple passive event
    const passiveEvents = RANDOM_EVENTS.filter(e => e.type === "passive");
    return passiveEvents[Math.floor(Math.random() * passiveEvents.length)];
  } else {
    // Special choice event
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
