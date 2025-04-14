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
  lastUpdated: number;
  
  initialDisplayedSpeed: number;
  initialControl: number;
  initialRecovery: number;
  initialEndurance: number;
  
  scoutedStats: {
    displayedSpeed: number;
    control: number;
    recovery: number;
    endurance: number;
  };
  
  traitRevealRace?: number;
};

export type RaceResult = {
  horseId: string;
  horseName: string;
  finalSpeed: number;
  position: number;
  raceEvents?: string[];
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
  hasUsedLoanThisRace: boolean;
};

export type Jockey = {
  id: string;
  name: string;
  description: string;
  effect: string;
};

export const jockeys: Jockey[] = [
  {
    id: "composed",
    name: "The Composed Jockey",
    description: "A jockey who keeps a cool head in any situation. Lower speed but higher control, and your horse will never be injured.",
    effect: "-7 Speed, +10 Control, never gets injured"
  },
  {
    id: "extreme",
    name: "The Extreme Trainer",
    description: "Pushes horses to their limits. Your horse will gain a new positive trait after 4-8 races, but endurance depletes faster.",
    effect: "New trait after 4-8 races, 1.4x faster endurance depletion"
  },
  {
    id: "veteran",
    name: "The Veteran Jockey",
    description: "An experienced jockey who knows all the tricks of the trade. Better control and recovery, at the cost of some speed and endurance.",
    effect: "+15 Control, +10 Recovery, -5 Speed, -5 Endurance"
  },
  {
    id: "risk",
    name: "The Risk Taker",
    description: "Takes dangerous shortcuts with a chance for massive speed boosts, but at a higher injury risk.",
    effect: "15% chance for speed boost, 1.5x injury risk"
  },
  {
    id: "celebrity",
    name: "The Celebrity Jockey",
    description: "Famous jockey who brings in sponsorship money but takes a bigger cut of prize money.",
    effect: "$300 bonus per race, half prize money for top 3"
  },
  {
    id: "underhanded",
    name: "The Underhanded Jockey",
    description: "Uses questionable tactics to benefit from 'arrangements'. Gains money for last place but has higher loan costs.",
    effect: "Gains $1000 for last place, 40% loan interest, -3 all stats"
  },
  {
    id: "slippery",
    name: "The Slippery Jockey",
    description: "Uses tricks to sneak into better positions, but pushes horses harder causing faster stat decline.",
    effect: "20% chance to place one position higher (except 1st), speed decreases 15% faster"
  },
  {
    id: "oneshot",
    name: "The One Shot Specialist",
    description: "Focuses everything on a single race at the cost of long-term performance.",
    effect: "Race 10 bonus, double stat decline after, -4 all stats"
  }
];

// Random Events
export type RandomEvent = {
  title: string;
  description: string;
  type: "choice" | "passive";
  choicePrompt?: string;
  acceptLabel?: string;
  declineLabel?: string;
  acceptEffect?: (gameState: GameState) => { gameState: GameState; message: string };
  moneyEffect?: number;
  moneyRequirement?: number;
};

// Constants
export const TRAINING_BASE_COSTS = {
  general: 100,
  speed: 200,
  sync: 150
};

export const TRAINING_COST_MULTIPLIER = 1.6;

export const SCOUTING_COSTS = {
  basic: 50,
  deep: 200,
  ownHorse: 100
};

export const MIN_LOAN_AMOUNT = 500;
export const MAX_LOAN_AMOUNT = 3000;
export const LOAN_PERCENTAGE = 0.25;

// Random trait effects
export const TRAIT_EFFECTS: Record<string, (horse: Horse) => void> = {
  "Natural Talent": (horse) => {
    horse.actualSpeed += 5;
    horse.displayedSpeed += 5;
  },
  "Endurance Beast": (horse) => {
    horse.endurance += 10;
  },
  "Nervous Temperament": (horse) => {
    horse.control -= 8;
  },
  "Fast Starter": (horse) => {
    // Special effect handled during race simulation
    horse.actualSpeed += 3;
  },
  "Slow Starter": (horse) => {
    // Special effect handled during race simulation
    horse.actualSpeed -= 2;
  },
  "Injury Prone": (horse) => {
    // Increases chance of injury during races
  },
  "Heavy Frame": (horse) => {
    horse.endurance -= 8;
    horse.actualSpeed -= 3;
    horse.displayedSpeed -= 3;
  },
  "Light Frame": (horse) => {
    horse.endurance -= 5;
    horse.actualSpeed += 4;
    horse.displayedSpeed += 4;
  },
  "Erratic": (horse) => {
    horse.control -= 12;
    horse.actualSpeed += 5;
    horse.displayedSpeed += 3; // Displayed is less than actual to show unpredictability
  },
  "Consistent": (horse) => {
    horse.control += 8;
    horse.recovery += 5;
  },
  "Sprint Specialist": (horse) => {
    horse.actualSpeed += 8;
    horse.displayedSpeed += 8;
    horse.endurance -= 5;
  },
  "Stamina Monster": (horse) => {
    horse.endurance += 15;
    horse.actualSpeed -= 2;
    horse.displayedSpeed -= 2;
  },
  "Late Bloomer": (horse) => {
    // Stat increases every 3 races
  },
  "Early Peaker": (horse) => {
    // Stats decrease after 5 races
  },
  "Muddy Track Specialist": (horse) => {
    // Performs better in wet conditions
  },
  "Fair Weather": (horse) => {
    // Performs better in dry conditions
  },
  "Crowd Pleaser": (horse) => {
    // Performs better in big races
  },
  "Training Lover": (horse) => {
    // Benefits more from training sessions
  },
  "Training Resistant": (horse) => {
    // Benefits less from training sessions
  },
  "Fast Recovery": (horse) => {
    horse.recovery += 15;
  },
  "Slow Recovery": (horse) => {
    horse.recovery -= 10;
  },
  "Precision Movement": (horse) => {
    horse.control += 12;
    horse.actualSpeed -= 2;
    horse.displayedSpeed -= 2;
  },
  "Natural Competitor": (horse) => {
    // Performs better when closely matched
  },
  "Underhanded Tactics": (horse) => {
    // Special effect for loans and event outcomes
  },
  "Lucky": (horse) => {
    // Better outcomes in events
  },
  "Unlucky": (horse) => {
    // Worse outcomes in events
  }
};

// Game Utility Functions
export const getRandomName = (): string => {
  const prefixes = [
    "Swift", "Thunder", "Racing", "Galloping", "Fast", "Mighty", "Royal", 
    "Victorious", "Noble", "Bold", "Brave", "Iron", "Steel", "Golden", "Silver"
  ];
  
  const names = [
    "Streak", "Storm", "Legend", "Spirit", "Star", "Heart", "Runner", "Champion",
    "Glory", "Flash", "Dash", "Wind", "Arrow", "Rocket", "Comet", "Blaze", "Bolt"
  ];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]}`;
};

export const generateHorse = (isPlayerHorse: boolean = false): Horse => {
  // Base stats are somewhat randomized
  const baseSpeed = Math.floor(Math.random() * 20) + 50; // 50-69
  const baseControl = Math.floor(Math.random() * 20) + 40; // 40-59
  const baseRecovery = Math.floor(Math.random() * 20) + 40; // 40-59
  const baseEndurance = Math.floor(Math.random() * 20) + 40; // 40-59
  
  // Generate between 1-3 random attributes
  const attributeCount = isPlayerHorse ? 2 : Math.floor(Math.random() * 3) + 1;
  const allTraits = Object.keys(TRAIT_EFFECTS);
  const selectedAttributes: HorseAttribute[] = [];
  
  for (let i = 0; i < attributeCount; i++) {
    const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
    
    // Make sure we don't select the same trait twice
    if (!selectedAttributes.some(attr => attr.name === randomTrait)) {
      selectedAttributes.push({
        name: randomTrait,
        description: `This horse ${randomTrait.toLowerCase()} trait affects its performance.`,
        isPositive: ["Natural Talent", "Endurance Beast", "Fast Starter", "Light Frame", 
                     "Consistent", "Sprint Specialist", "Stamina Monster", "Late Bloomer", 
                     "Muddy Track Specialist", "Fair Weather", "Crowd Pleaser", "Training Lover", 
                     "Fast Recovery", "Precision Movement", "Natural Competitor", "Lucky"].includes(randomTrait),
        effect: TRAIT_EFFECTS[randomTrait]
      });
      
      // Remove this trait from the available pool
      allTraits.splice(allTraits.indexOf(randomTrait), 1);
    }
  }
  
  const horse: Horse = {
    id: Math.random().toString(36).substring(2, 10),
    name: getRandomName(),
    displayedSpeed: baseSpeed,
    actualSpeed: baseSpeed,
    control: baseControl,
    recovery: baseRecovery,
    endurance: baseEndurance,
    attributes: selectedAttributes,
    revealedAttributes: [],
    hasInjury: false,
    injuryType: "none",
    missNextRace: false,
    lastUpdated: 0,
    
    initialDisplayedSpeed: baseSpeed,
    initialControl: baseControl,
    initialRecovery: baseRecovery,
    initialEndurance: baseEndurance,
    
    scoutedStats: {
      displayedSpeed: 0,
      control: 0,
      recovery: 0,
      endurance: 0
    }
  };
  
  // Apply the effects of all attributes
  selectedAttributes.forEach(attr => attr.effect(horse));
  
  return horse;
};

export const initializeGame = (playerName: string, jockeyId: string): GameState => {
  // Generate player's horse
  const playerHorse = generateHorse(true);
  playerHorse.name = `${playerName}'s ${playerHorse.name}`;
  
  // Apply jockey effects to the player's horse
  applyJockeyEffect(playerHorse, jockeyId);
  
  // Generate 5-7 competitor horses
  const competitorCount = Math.floor(Math.random() * 3) + 5; // 5-7 competitors
  const competitors: Horse[] = [];
  
  for (let i = 0; i < competitorCount; i++) {
    competitors.push(generateHorse());
  }
  
  // Set the season goal (money needed to win)
  const seasonGoal = 8000 + Math.floor(Math.random() * 4000); // 8000-12000
  
  return {
    playerMoney: 1000,
    seasonGoal,
    currentRace: 1,
    totalRaces: 10,
    playerHorse,
    competitors,
    raceResults: [],
    lastBet: null,
    loanAmount: 0,
    trainingsUsed: {},
    selectedJockeyId: jockeyId,
    hasUsedLoanThisRace: false
  };
};

export const applyJockeyEffect = (horse: Horse, jockeyId: string): void => {
  switch (jockeyId) {
    case "composed":
      horse.displayedSpeed -= 7;
      horse.actualSpeed -= 7;
      horse.control += 10;
      // Never gets injured handled during race
      break;
      
    case "extreme":
      // New trait after races handled elsewhere
      // Faster endurance depletion handled during race and after race updates
      break;
      
    case "veteran":
      horse.displayedSpeed -= 5;
      horse.actualSpeed -= 5;
      horse.control += 15;
      horse.recovery += 10;
      horse.endurance -= 5;
      break;
      
    case "risk":
      // Speed boost chance handled during race
      // Injury risk handled during race
      break;
      
    case "celebrity":
      // Money effects handled during event processing and race payouts
      break;
      
    case "underhanded":
      // Last place money handled in race results
      // Loan interest handled in takeLoan
      horse.displayedSpeed -= 3;
      horse.actualSpeed -= 3;
      horse.control -= 3;
      horse.recovery -= 3;
      horse.endurance -= 3;
      // Add Underhanded Tactics trait if not present
      if (!horse.attributes.some(attr => attr.name === "Underhanded Tactics")) {
        horse.attributes.push({
          name: "Underhanded Tactics",
          description: "This horse uses questionable tactics for an edge.",
          isPositive: true, // Subjective!
          effect: TRAIT_EFFECTS["Underhanded Tactics"]
        });
      }
      break;
      
    case "slippery":
      // Position improvement handled during race
      // Faster speed decline handled during update
      break;
      
    case "oneshot":
      // Race 10 bonus handled during race
      // Double stat decline handled during update
      horse.displayedSpeed -= 4;
      horse.actualSpeed -= 4;
      horse.control -= 4;
      horse.recovery -= 4;
      horse.endurance -= 4;
      break;
  }
};

export const getTrainingCost = (type: string, usageCount: number): number => {
  const baseCost = TRAINING_BASE_COSTS[type as keyof typeof TRAINING_BASE_COSTS] || 0;
  return Math.floor(baseCost * Math.pow(TRAINING_COST_MULTIPLIER, usageCount));
};

export const applyTraining = (gameState: GameState, type: "general" | "speed" | "rest" | "sync"): GameState => {
  const cost = getTrainingCost(type, gameState.trainingsUsed[type] || 0);
  
  if (gameState.playerMoney < cost) {
    toast.error("Not enough money for training");
    return gameState;
  }
  
  const updatedHorse = { ...gameState.playerHorse };
  
  switch (type) {
    case "general":
      updatedHorse.displayedSpeed += 3;
      updatedHorse.actualSpeed += 3;
      updatedHorse.control += 2;
      updatedHorse.endurance += 2;
      updatedHorse.recovery -= 5;
      break;
      
    case "speed":
      updatedHorse.displayedSpeed += 8;
      updatedHorse.actualSpeed += 8;
      updatedHorse.control -= 3;
      updatedHorse.endurance -= 3;
      updatedHorse.recovery -= 15;
      break;
      
    case "rest":
      updatedHorse.displayedSpeed -= 1;
      updatedHorse.actualSpeed -= 1;
      updatedHorse.control -= 1;
      updatedHorse.endurance -= 1;
      updatedHorse.recovery += 15;
      break;
      
    case "sync":
      updatedHorse.control += 7;
      // Removed +3 endurance from sync training
      updatedHorse.recovery -= 10;
      break;
  }
  
  // Make sure no stats go below 1
  updatedHorse.displayedSpeed = Math.max(1, updatedHorse.displayedSpeed);
  updatedHorse.actualSpeed = Math.max(1, updatedHorse.actualSpeed);
  updatedHorse.control = Math.max(1, updatedHorse.control);
  updatedHorse.endurance = Math.max(1, updatedHorse.endurance);
  updatedHorse.recovery = Math.max(1, updatedHorse.recovery);
  
  return {
    ...gameState,
    playerHorse: updatedHorse,
    playerMoney: gameState.playerMoney - cost,
    trainingsUsed: {
      ...gameState.trainingsUsed,
      [type]: (gameState.trainingsUsed[type] || 0) + 1
    }
  };
};

export const scoutHorse = (gameState: GameState, horseId: string, type: "basic" | "deep"): GameState => {
  const cost = SCOUTING_COSTS[type];
  
  if (gameState.playerMoney < cost) {
    toast.error("Not enough money for scouting");
    return gameState;
  }
  
  const horseIndex = gameState.competitors.findIndex(h => h.id === horseId);
  
  if (horseIndex === -1) {
    toast.error("Horse not found");
    return gameState;
  }
  
  const horse = { ...gameState.competitors[horseIndex] };
  
  // Basic scouting reveals basic stats
  horse.scoutedStats = {
    displayedSpeed: horse.displayedSpeed,
    control: horse.control,
    recovery: horse.recovery,
    endurance: horse.endurance
  };
  
  horse.lastUpdated = gameState.currentRace;
  
  // Deep scouting also reveals a random attribute
  if (type === "deep" && horse.attributes.length > horse.revealedAttributes.length) {
    const unrevealed = horse.attributes.filter(
      attr => !horse.revealedAttributes.some(revealed => revealed.name === attr.name)
    );
    
    if (unrevealed.length > 0) {
      const randomIndex = Math.floor(Math.random() * unrevealed.length);
      horse.revealedAttributes = [...horse.revealedAttributes, unrevealed[randomIndex]];
    }
  }
  
  const updatedCompetitors = [...gameState.competitors];
  updatedCompetitors[horseIndex] = horse;
  
  return {
    ...gameState,
    competitors: updatedCompetitors,
    playerMoney: gameState.playerMoney - cost
  };
};

export const scoutOwnHorse = (gameState: GameState): GameState => {
  const cost = SCOUTING_COSTS.ownHorse;
  
  if (gameState.playerMoney < cost) {
    toast.error("Not enough money for scouting");
    return gameState;
  }
  
  const horse = { ...gameState.playerHorse };
  
  // Scouting own horse always reveals an attribute if possible
  if (horse.attributes.length > horse.revealedAttributes.length) {
    const unrevealed = horse.attributes.filter(
      attr => !horse.revealedAttributes.some(revealed => revealed.name === attr.name)
    );
    
    if (unrevealed.length > 0) {
      const randomIndex = Math.floor(Math.random() * unrevealed.length);
      horse.revealedAttributes = [...horse.revealedAttributes, unrevealed[randomIndex]];
    }
  }
  
  return {
    ...gameState,
    playerHorse: horse,
    playerMoney: gameState.playerMoney - cost
  };
};

export const calculateLoanAmount = (playerMoney: number): number => {
  // Base loan amount between MIN and MAX
  const baseLoan = MIN_LOAN_AMOUNT + Math.floor(
    (MAX_LOAN_AMOUNT - MIN_LOAN_AMOUNT) * (playerMoney / 2000)
  );
  
  // Clamp between min and max
  return Math.min(Math.max(baseLoan, MIN_LOAN_AMOUNT), MAX_LOAN_AMOUNT);
};

export const takeLoan = (gameState: GameState): GameState => {
  if (gameState.hasUsedLoanThisRace) {
    toast.error("Already took a loan this race");
    return gameState;
  }
  
  const loanAmount = calculateLoanAmount(gameState.playerMoney);
  
  return {
    ...gameState,
    playerMoney: gameState.playerMoney + loanAmount,
    loanAmount: gameState.loanAmount + loanAmount,
    hasUsedLoanThisRace: true
  };
};

export const simulateRace = (gameState: GameState): RaceResult[] => {
  // Get all horses that are racing (player horse + competitors)
  const racingHorses = [
    gameState.playerHorse,
    ...gameState.competitors.filter(h => !h.missNextRace)
  ];
  
  // Apply special jockey effects before race
  let raceResults: RaceResult[] = racingHorses.map(horse => {
    let finalSpeed = calculateHorseFinalSpeed(horse, gameState.currentRace, gameState.selectedJockeyId);
    
    return {
      horseId: horse.id,
      horseName: horse.name,
      finalSpeed,
      position: 0,
      raceEvents: []
    };
  });
  
  // Sort based on final speed
  raceResults.sort((a, b) => b.finalSpeed - a.finalSpeed);
  
  // Assign positions
  raceResults.forEach((result, index) => {
    result.position = index + 1;
  });
  
  // Apply slippery jockey effect for position improvement
  // Only allow moving up ONE position and NEVER to first place
  if (gameState.selectedJockeyId === "slippery" && gameState.playerHorse && gameState.playerHorse.id) {
    const playerResultIndex = raceResults.findIndex(r => r.horseId === gameState.playerHorse.id);
    
    if (playerResultIndex > 1 && Math.random() < 0.2) {
      // Swap this result with the one position higher
      const temp = { ...raceResults[playerResultIndex - 1] };
      raceResults[playerResultIndex - 1] = { ...raceResults[playerResultIndex], position: playerResultIndex };
      raceResults[playerResultIndex] = { ...temp, position: playerResultIndex + 1 };
      
      if (raceResults[playerResultIndex - 1].raceEvents) {
        raceResults[playerResultIndex - 1].raceEvents?.push("Used clever positioning to move up");
      } else {
        raceResults[playerResultIndex - 1].raceEvents = ["Used clever positioning to move up"];
      }
    }
  }
  
  // Calculate race earnings based on position
  const playerResult = raceResults.find(r => r.horseId === gameState.playerHorse.id);
  const playerPosition = playerResult?.position || 0;
  
  // Calculate race earnings
  let earnings = 0;
  if (playerPosition === 1) {
    earnings = 1000;
  } else if (playerPosition === 2) {
    earnings = 500;
  } else if (playerPosition === 3) {
    earnings = 250;
  } else if (playerPosition === raceResults.length && gameState.selectedJockeyId === "underhanded") {
    // Last place bonus for underhanded jockey
    earnings = 1000;
  }
  
  // Celebrity jockey effect: half prize money for top 3, but $300 bonus
  if (gameState.selectedJockeyId === "celebrity") {
    if (playerPosition <= 3) {
      earnings = Math.floor(earnings / 2);
    }
    earnings += 300;
  }
  
  // One shot specialist bonus for race 10
  if (gameState.selectedJockeyId === "oneshot" && gameState.currentRace === 10) {
    // Double earnings for race 10
    earnings *= 2;
  }
  
  // Process betting result
  if (gameState.lastBet) {
    const betHorseResult = raceResults.find(r => r.horseId === gameState.lastBet?.horseId);
    const betPosition = betHorseResult?.position || 0;
    
    if (betPosition === 1) {
      earnings += gameState.lastBet.amount * 4;
    } else if (betPosition === 2) {
      earnings += gameState.lastBet.amount * 2;
    } else if (betPosition === 3) {
      earnings += Math.floor(gameState.lastBet.amount * 1.5);
    }
  }
  
  // Update game state with race results and earnings
  const updatedState = {
    ...gameState,
    playerMoney: gameState.playerMoney + earnings,
    raceResults: raceResults,
    currentRace: gameState.currentRace + 1,
    hasUsedLoanThisRace: false
  };
  
  // Repay loan with interest if this is race 5 or 10
  if (gameState.currentRace === 5 || gameState.currentRace === 10) {
    const hasUnderhandedTactics = gameState.playerHorse.attributes.some(attr => attr.name === "Underhanded Tactics");
    const interestRate = hasUnderhandedTactics ? 0.4 : 0.25;
    const interestAmount = Math.floor(updatedState.loanAmount * interestRate);
    const totalDebt = updatedState.loanAmount + interestAmount;
    
    if (updatedState.playerMoney >= totalDebt) {
      updatedState.playerMoney -= totalDebt;
      updatedState.loanAmount = 0;
      
      toast.success(`Loan repaid with $${interestAmount} interest!`);
    } else {
      // Can't repay, game over handled elsewhere
      updatedState.playerMoney = 0;
      toast.error(`Couldn't repay loan of $${totalDebt}!`);
    }
  }
  
  return raceResults;
};

export const calculateHorseFinalSpeed = (
  horse: Horse, 
  currentRace: number,
  playerJockeyId: string
): number => {
  let finalSpeed = horse.actualSpeed;
  
  // Calculate stamina penalty based on horse endurance
  const staminaFactor = 0.3 * (100 - Math.min(100, horse.endurance)) / 100;
  finalSpeed = finalSpeed * (1 - staminaFactor);
  
  // Calculate control bonus/penalty
  const controlFactor = (horse.control - 50) / 100;
  finalSpeed = finalSpeed * (1 + (controlFactor * 0.25));
  
  // Apply jockey effects for player horse
  if (horse.id === playerJockeyId) {
    if (playerJockeyId === "risk" && Math.random() < 0.15) {
      // Risk taker has 15% chance of speed boost
      finalSpeed *= 1.2;
    }
    
    if (playerJockeyId === "oneshot" && currentRace === 10) {
      // One shot specialist gets massive boost in race 10
      finalSpeed *= 1.35;
    }
  }
  
  // Apply random variance (controlled by horse's control stat)
  const maxVariance = Math.max(0, 15 - horse.control / 10);
  const variance = (Math.random() * 2 - 1) * maxVariance;
  finalSpeed = finalSpeed * (1 + variance / 100);
  
  // Apply special attribute effects
  if (horse.attributes.some(attr => attr.name === "Fast Starter")) {
    finalSpeed *= 1.07;
  }
  
  if (horse.attributes.some(attr => attr.name === "Slow Starter")) {
    finalSpeed *= 0.93;
  }
  
  // Ensure a minimum speed
  finalSpeed = Math.max(finalSpeed, 10);
  
  // Round to 1 decimal place
  return Math.round(finalSpeed * 10) / 10;
};

export const updateHorsesAfterRace = (raceResults: RaceResult[]): GameState => {
  // Placeholder - this will be implemented to update horse stats after each race
  // such as applying recovery, endurance loss, potential injuries, etc.
  return {
    playerMoney: 0,
    seasonGoal: 0,
    currentRace: 0,
    totalRaces: 0,
    playerHorse: {} as Horse,
    competitors: [],
    raceResults: [],
    lastBet: null,
    loanAmount: 0,
    trainingsUsed: {},
    selectedJockeyId: "",
    hasUsedLoanThisRace: false
  };
};

export const getRandomEvent = (): RandomEvent => {
  const events: RandomEvent[] = [
    {
      title: "Fan Promotion",
      description: "A local sponsor offers you $300 for wearing their logo during the next race.",
      type: "choice",
      acceptLabel: "Accept Offer",
      declineLabel: "Decline",
      acceptEffect: (gameState) => ({
        gameState: {
          ...gameState,
          playerMoney: gameState.playerMoney + 300
        },
        message: "You gained $300 from the sponsorship!"
      })
    },
    {
      title: "Betting Tip",
      description: "A suspicious character offers a 'guaranteed' betting tip for $200.",
      type: "choice",
      acceptLabel: "Pay $200",
      declineLabel: "Ignore",
      moneyRequirement: 200,
      acceptEffect: (gameState) => {
        // 50% chance the tip is good and returns $500
        const tipIsGood = Math.random() > 0.5;
        
        if (tipIsGood) {
          return {
            gameState: {
              ...gameState,
              playerMoney: gameState.playerMoney - 200 + 500
            },
            message: "The tip paid off! You won $500!"
          };
        } else {
          return {
            gameState: {
              ...gameState,
              playerMoney: gameState.playerMoney - 200
            },
            message: "The tip was worthless. You lost $200."
          };
        }
      }
    },
    {
      title: "Equipment Upgrade",
      description: "A new saddle is available that could improve your horse's control by 5 points for $350.",
      type: "choice",
      acceptLabel: "Buy Upgrade",
      declineLabel: "Skip",
      moneyRequirement: 350,
      acceptEffect: (gameState) => {
        const updatedHorse = { ...gameState.playerHorse };
        updatedHorse.control += 5;
        
        return {
          gameState: {
            ...gameState,
            playerMoney: gameState.playerMoney - 350,
            playerHorse: updatedHorse
          },
          message: "Your horse's control increased by 5!"
        };
      }
    },
    {
      title: "Charity Event",
      description: "A local charity asks you to participate in their event. It will cost $150 but might bring good luck.",
      type: "choice",
      acceptLabel: "Participate",
      declineLabel: "Decline",
      moneyRequirement: 150,
      acceptEffect: (gameState) => {
        // 25% chance to recover all stats
        const getLucky = Math.random() < 0.25;
        
        if (getLucky) {
          const updatedHorse = { ...gameState.playerHorse };
          updatedHorse.recovery += 25;
          
          return {
            gameState: {
              ...gameState,
              playerMoney: gameState.playerMoney - 150,
              playerHorse: updatedHorse
            },
            message: "The charity brought good karma! Your horse's recovery increased by 25!"
          };
        } else {
          return {
            gameState: {
              ...gameState,
              playerMoney: gameState.playerMoney - 150
            },
            message: "You feel good about helping the charity, but received no benefit."
          };
        }
      }
    },
    {
      title: "Track Maintenance Fee",
      description: "The race track requires a mandatory maintenance fee of $100 from all participants.",
      type: "passive",
      moneyEffect: -100
    },
    {
      title: "Media Interview",
      description: "A sports magazine featured your horse and paid you $200 for the exclusive.",
      type: "passive",
      moneyEffect: 200
    }
  ];
  
  return events[Math.floor(Math.random() * events.length)];
};

export const applyRandomEvent = (gameState: GameState, event: RandomEvent): GameState => {
  if (event.type === "passive" && event.moneyEffect) {
    return {
      ...gameState,
      playerMoney: Math.max(0, gameState.playerMoney + event.moneyEffect)
    };
  }
  
  return gameState;
};

export const isGameOver = (gameState: GameState): boolean => {
  // Game ends if current race > total races
  return gameState.currentRace > gameState.totalRaces;
};

export const isGameWon = (gameState: GameState): boolean => {
  // Game is won if player has reached the season goal
  return gameState.playerMoney >= gameState.seasonGoal;
};
