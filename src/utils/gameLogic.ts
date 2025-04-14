
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

// Constants - Restoring original costs
export const TRAINING_BASE_COSTS = {
  general: 100,
  speed: 200,
  sync: 150
};

export const TRAINING_COST_MULTIPLIER = 1.6;

// Restored original scouting costs
export const SCOUTING_COSTS = {
  basic: 200,
  deep: 500,
  ownHorse: 150
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
  
  // Restore original competitor count (8-10 competitors)
  const competitorCount = Math.floor(Math.random() * 3) + 8; // 8-10 competitors
  const competitors: Horse[] = [];
  
  for (let i = 0; i < competitorCount; i++) {
    competitors.push(generateHorse());
  }
  
  // Set the season goal (money needed to win)
  const seasonGoal = 8000 + Math.floor(Math.random() * 4000); // 8000-12000
  
  return {
    playerMoney: 2000, // Restored original starting money of 2000
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
      updatedHorse.endurance += 3; // Restored the +3 endurance that was previously removed
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
    
    // Add race events/flavor text based on position and performance
    if (!result.raceEvents) {
      result.raceEvents = [];
    }
    
    // Generate realistic race commentary based on position
    if (result.position === 1) {
      result.raceEvents.push(getRandomRaceEvent('first'));
    } else if (result.position === 2) {
      result.raceEvents.push(getRandomRaceEvent('second'));
    } else if (result.position === 3) {
      result.raceEvents.push(getRandomRaceEvent('third'));
    } else if (result.position === raceResults.length) {
      result.raceEvents.push(getRandomRaceEvent('last'));
    } else if (result.position <= Math.floor(raceResults.length / 2)) {
      result.raceEvents.push(getRandomRaceEvent('top_half'));
    } else {
      result.raceEvents.push(getRandomRaceEvent('bottom_half'));
    }
    
    // Add speed-related commentary
    if (result.finalSpeed > 65) {
      result.raceEvents.push("Displayed incredible speed throughout the race");
    } else if (result.finalSpeed < 30) {
      result.raceEvents.push("Struggled to maintain pace");
    }
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
  
  return raceResults;
};

// Helper function to generate realistic race events/commentary
function getRandomRaceEvent(position: 'first' | 'second' | 'third' | 'last' | 'top_half' | 'bottom_half'): string {
  const events = {
    first: [
      "Took an early lead and maintained control throughout",
      "Made a stunning move in the final stretch to secure the win",
      "Dominated from start to finish with superior speed",
      "Perfectly timed push in the final turn to take the lead",
      "Showed exceptional stamina to hold off challengers"
    ],
    second: [
      "Battled hard but couldn't quite catch the leader",
      "Strong finish but ran out of track",
      "Made up significant ground in the final stretch",
      "Challenged the leader repeatedly but couldn't find a way past",
      "Consistent pace throughout but lacked the final push"
    ],
    third: [
      "Solid performance to secure a respectable finish",
      "Recovered well after a slow start",
      "Made a late charge to secure third place",
      "Ran a tactical race to finish in the money",
      "Found an opening along the rail in the final stretch"
    ],
    last: [
      "Never found rhythm and struggled throughout",
      "Appeared uncomfortable on the track today",
      "Fell behind early and couldn't recover",
      "May need more training before the next race",
      "Conserving energy for future races"
    ],
    top_half: [
      "Showed promise with moments of acceleration",
      "Maintained position in the middle of the pack",
      "Consistent but unspectacular performance",
      "Made some good moves but couldn't sustain the effort",
      "Has potential with more experience"
    ],
    bottom_half: [
      "Struggled to keep pace with the leaders",
      "Started well but faded as the race progressed",
      "Could benefit from more specialized training",
      "Had difficulty navigating traffic during the race",
      "Showed brief moments of promise but lacked consistency"
    ]
  };
  
  const positionEvents = events[position];
  return positionEvents[Math.floor(Math.random() * positionEvents.length)];
}

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

export const updateHorsesAfterRace = (gameState: GameState, raceResults: RaceResult[]): GameState => {
  // This function properly updates horse stats after each race
  // and correctly handles race results, earnings, and progression
  const updatedGameState = { ...gameState };
  updatedGameState.raceResults = raceResults;
  updatedGameState.currentRace += 1;
  updatedGameState.hasUsedLoanThisRace = false;
  
  // Apply race earnings based on position
  const playerResult = raceResults.find(r => r.horseId === gameState.playerHorse.id);
  if (playerResult) {
    let prize = 0;
    
    switch (playerResult.position) {
      case 1:
        prize = 1000;
        break;
      case 2:
        prize = 500;
        break;
      case 3:
        prize = 250;
        break;
      default:
        prize = 0;
    }
    
    // Apply celebrity jockey effect (half prize money for top 3)
    if (gameState.selectedJockeyId === "celebrity" && playerResult.position <= 3) {
      prize = Math.floor(prize / 2) + 300; // Half prize + $300 bonus
    }
    
    // Apply underhanded jockey effect ($1000 for last place)
    if (gameState.selectedJockeyId === "underhanded" && 
        playerResult.position === raceResults.length) {
      prize = 1000;
    }
    
    updatedGameState.playerMoney += prize;
  }
  
  // Update player horse stats
  const updatedPlayerHorse = { ...gameState.playerHorse };
  
  // Recovery affects how much stats decrease
  const recoveryFactor = Math.max(0.5, 1 - (updatedPlayerHorse.recovery / 100));
  
  // Base stat decreases
  let speedDecrease = 2 * recoveryFactor;
  let controlDecrease = 1 * recoveryFactor;
  let enduranceDecrease = 2 * recoveryFactor;
  
  // Apply jockey effects
  if (gameState.selectedJockeyId === "extreme") {
    enduranceDecrease *= 1.4; // Extreme trainer depletes endurance faster
  }
  
  if (gameState.selectedJockeyId === "slippery") {
    speedDecrease *= 1.15; // Slippery jockey pushes horses harder
  }
  
  if (gameState.selectedJockeyId === "oneshot" && gameState.currentRace > 9) {
    // One shot specialist suffers double stat decline after race 10
    speedDecrease *= 2;
    controlDecrease *= 2;
    enduranceDecrease *= 2;
  }
  
  // Update stats
  updatedPlayerHorse.displayedSpeed = Math.max(1, updatedPlayerHorse.displayedSpeed - speedDecrease);
  updatedPlayerHorse.actualSpeed = Math.max(1, updatedPlayerHorse.actualSpeed - speedDecrease);
  updatedPlayerHorse.control = Math.max(1, updatedPlayerHorse.control - controlDecrease);
  updatedPlayerHorse.endurance = Math.max(1, updatedPlayerHorse.endurance - enduranceDecrease);
  
  // Recover a bit 
  updatedPlayerHorse.recovery = Math.min(100, updatedPlayerHorse.recovery + 5);
  
  // Handle injuries based on race position and attributes
  const injuryChance = 0.05 + (playerResult && playerResult.position > raceResults.length / 2 ? 0.05 : 0);
  const adjustedInjuryChance = gameState.selectedJockeyId === "risk" 
    ? injuryChance * 1.5  // Risk taker has higher injury chance
    : gameState.selectedJockeyId === "composed" 
      ? 0  // Composed jockey prevents injuries
      : injuryChance;
  
  if (Math.random() < adjustedInjuryChance) {
    // Determine injury severity
    const severityRoll = Math.random();
    if (severityRoll < 0.7) {
      // Mild injury
      updatedPlayerHorse.hasInjury = true;
      updatedPlayerHorse.injuryType = "mild";
      updatedPlayerHorse.displayedSpeed -= 5;
      updatedPlayerHorse.actualSpeed -= 5;
      toast.error("Your horse has suffered a mild injury! Speed -5");
    } else {
      // Major injury
      updatedPlayerHorse.hasInjury = true;
      updatedPlayerHorse.injuryType = "major";
      updatedPlayerHorse.missNextRace = true;
      toast.error("Your horse has suffered a major injury! Will miss the next race");
    }
  }
  
  // Apply extreme jockey trait reveal
  if (gameState.selectedJockeyId === "extreme" && !updatedPlayerHorse.traitRevealRace) {
    // Determine when the new trait will be revealed (between race 4-8)
    updatedPlayerHorse.traitRevealRace = Math.floor(Math.random() * 5) + 4;
  }
  
  // Check if it's time to reveal a new trait for extreme jockey
  if (gameState.selectedJockeyId === "extreme" && 
      updatedPlayerHorse.traitRevealRace === gameState.currentRace) {
    
    // Add a positive trait
    const positiveTraits = ["Natural Talent", "Endurance Beast", "Fast Starter", "Light Frame", 
                           "Consistent", "Sprint Specialist", "Stamina Monster", 
                           "Fast Recovery", "Precision Movement"];
    
    // Filter out traits the horse already has
    const availableTraits = positiveTraits.filter(
      trait => !updatedPlayerHorse.attributes.some(attr => attr.name === trait)
    );
    
    if (availableTraits.length > 0) {
      const randomTrait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
      const newTrait: HorseAttribute = {
        name: randomTrait,
        description: `This horse ${randomTrait.toLowerCase()} trait affects its performance.`,
        isPositive: true,
        effect: TRAIT_EFFECTS[randomTrait]
      };
      
      // Add the trait and reveal it
      updatedPlayerHorse.attributes.push(newTrait);
      updatedPlayerHorse.revealedAttributes.push(newTrait);
      
      // Apply the trait effect
      newTrait.effect(updatedPlayerHorse);
      
      toast.success(`Your horse developed a new trait: ${randomTrait}!`);
    }
    
    // Reset the trait reveal counter
    updatedPlayerHorse.traitRevealRace = undefined;
  }
  
  // Update the competitors similarly
  const updatedCompetitors = gameState.competitors.map(competitor => {
    const updatedCompetitor = { ...competitor };
    
    // Similar stat decreases for competitors, but slightly less to keep them competitive
    updatedCompetitor.displayedSpeed = Math.max(1, updatedCompetitor.displayedSpeed - speedDecrease * 0.8);
    updatedCompetitor.actualSpeed = Math.max(1, updatedCompetitor.actualSpeed - speedDecrease * 0.8);
    updatedCompetitor.control = Math.max(1, updatedCompetitor.control - controlDecrease * 0.8);
    updatedCompetitor.endurance = Math.max(1, updatedCompetitor.endurance - enduranceDecrease * 0.8);
    updatedCompetitor.recovery = Math.min(100, updatedCompetitor.recovery + 5);
    
    // Handle competitor injuries (less likely than player horse)
    if (Math.random() < 0.03) {
      if (Math.random() < 0.7) {
        // Mild injury
        updatedCompetitor.hasInjury = true;
        updatedCompetitor.injuryType = "mild";
        updatedCompetitor.displayedSpeed -= 5;
        updatedCompetitor.actualSpeed -= 5;
      } else {
        // Major injury
        updatedCompetitor.hasInjury = true;
        updatedCompetitor.injuryType = "major";
        updatedCompetitor.missNextRace = true;
      }
    }
    
    return updatedCompetitor;
  });
  
  // Update loan amount with interest
  if (updatedGameState.loanAmount > 0) {
    const interestRate = gameState.selectedJockeyId === "underhanded" ? 0.4 : LOAN_PERCENTAGE;
    const interestAmount = Math.ceil(updatedGameState.loanAmount * interestRate);
    updatedGameState.loanAmount += interestAmount;
  }
  
  return {
    ...updatedGameState,
    playerHorse: updatedPlayerHorse,
    competitors: updatedCompetitors
  };
};

export const getRandomEvent = (): RandomEvent => {
  const events: RandomEvent[] = [
    {
      title: "Fan Promotion",
      description: "A local sponsor offers you $300 for wearing their logo during the next race.",
      type: "choice",
      choicePrompt: "Do you accept the sponsorship?",
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
      choicePrompt: "Will you pay for the tip?",
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
      choicePrompt: "Purchase the new equipment?",
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
      choicePrompt: "Participate in the charity event?",
      acceptLabel: "Participate",
      declineLabel: "Decline",
      moneyRequirement: 150,
      acceptEffect: (gameState) => {
        // 25% chance to recover all stats
        const getLucky = Math.random() < 0.25;
        
        if (getLucky) {
          const updatedHorse = { ...gameState.playerHorse };
          
          // Restore 50% of lost stats
          updatedHorse.displayedSpeed = Math.floor(updatedHorse.displayedSpeed + (updatedHorse.initialDisplayedSpeed - updatedHorse.displayedSpeed) * 0.5);
          updatedHorse.actualSpeed = Math.floor(updatedHorse.actualSpeed + (updatedHorse.initialDisplayedSpeed - updatedHorse.actualSpeed) * 0.5);
          updatedHorse.control = Math.floor(updatedHorse.control + (updatedHorse.initialControl - updatedHorse.control) * 0.5);
          updatedHorse.endurance = Math.floor(updatedHorse.endurance + (updatedHorse.initialEndurance - updatedHorse.endurance) * 0.5);
          updatedHorse.recovery = Math.floor(updatedHorse.recovery + (100 - updatedHorse.recovery) * 0.5);
          
          return {
            gameState: {
              ...gameState,
              playerMoney: gameState.playerMoney - 150,
              playerHorse: updatedHorse
            },
            message: "The charity brought you good luck! Your horse's stats have been partially restored!"
          };
        } else {
          return {
            gameState: {
              ...gameState,
              playerMoney: gameState.playerMoney - 150
            },
            message: "You feel good about helping the charity, but didn't receive any special luck."
          };
        }
      }
    },
    {
      title: "Horse Whisperer",
      description: "A renowned horse whisperer offers to work with your horse for $300. They claim they can improve your horse's control.",
      type: "choice",
      choicePrompt: "Hire the horse whisperer?",
      acceptLabel: "Hire",
      declineLabel: "Decline",
      moneyRequirement: 300,
      acceptEffect: (gameState) => {
        const updatedHorse = { ...gameState.playerHorse };
        updatedHorse.control += 8;
        updatedHorse.recovery += 5;
        
        return {
          gameState: {
            ...gameState,
            playerMoney: gameState.playerMoney - 300,
            playerHorse: updatedHorse
          },
          message: "The horse whisperer worked wonders! Control +8, Recovery +5"
        };
      }
    },
    {
      title: "Special Feed",
      description: "A nutrition expert offers special feed that could boost your horse's performance for $250.",
      type: "choice",
      choicePrompt: "Purchase the special feed?",
      acceptLabel: "Buy Feed",
      declineLabel: "Decline",
      moneyRequirement: 250,
      acceptEffect: (gameState) => {
        const updatedHorse = { ...gameState.playerHorse };
        updatedHorse.displayedSpeed += 5;
        updatedHorse.actualSpeed += 5;
        updatedHorse.endurance += 3;
        
        return {
          gameState: {
            ...gameState,
            playerMoney: gameState.playerMoney - 250,
            playerHorse: updatedHorse
          },
          message: "The special feed worked well! Speed +5, Endurance +3"
        };
      }
    },
    {
      title: "Racing Scandal",
      description: "You've been implicated in a minor racing scandal. Pay $400 to settle the matter quietly.",
      type: "choice",
      choicePrompt: "Pay to settle the matter?",
      acceptLabel: "Pay $400",
      declineLabel: "Refuse",
      moneyRequirement: 400,
      acceptEffect: (gameState) => {
        return {
          gameState: {
            ...gameState,
            playerMoney: gameState.playerMoney - 400
          },
          message: "You paid to settle the scandal. Your reputation remains intact."
        };
      }
    },
    {
      title: "Sponsor Opportunity",
      description: "A major brand wants to sponsor your horse in the next race for $450.",
      type: "choice",
      choicePrompt: "Accept the sponsorship?",
      acceptLabel: "Accept",
      declineLabel: "Decline",
      acceptEffect: (gameState) => {
        return {
          gameState: {
            ...gameState,
            playerMoney: gameState.playerMoney + 450
          },
          message: "You received $450 from the sponsorship deal!"
        };
      }
    }
  ];
  
  // Choose a random event
  return events[Math.floor(Math.random() * events.length)];
};

// Add the applyRandomEvent function that was missing
export const applyRandomEvent = (gameState: GameState, event: RandomEvent): GameState => {
  // Apply passive event effects
  if (event.type === "passive" && event.moneyEffect) {
    return {
      ...gameState,
      playerMoney: gameState.playerMoney + event.moneyEffect
    };
  }
  
  // For choice events, this just returns the original state
  // since the actual effects are applied by the acceptEffect function
  return gameState;
};

export const applyPassiveEvent = (gameState: GameState): { 
  gameState: GameState;
  message: string;
} | null => {
  // 15% chance of passive event
  if (Math.random() < 0.15) {
    const possibleEvents = [
      // Weather event
      {
        check: () => true,
        apply: (gameState: GameState) => {
          const isRainy = Math.random() < 0.5;
          let message = "";
          
          if (isRainy) {
            message = "Heavy rain is forecasted for the next race. Horses with good control will perform better.";
            
            // Boost horses with "Muddy Track Specialist" trait
            const updatedCompetitors = gameState.competitors.map(horse => {
              const updatedHorse = { ...horse };
              
              if (horse.attributes.some(attr => attr.name === "Muddy Track Specialist")) {
                updatedHorse.actualSpeed += 5;
              }
              
              return updatedHorse;
            });
            
            // Handle player horse
            const updatedPlayerHorse = { ...gameState.playerHorse };
            if (updatedPlayerHorse.attributes.some(attr => attr.name === "Muddy Track Specialist")) {
              updatedPlayerHorse.actualSpeed += 5;
              message += " Your horse's Muddy Track Specialist trait will be advantageous!";
            }
            
            return {
              gameState: {
                ...gameState,
                playerHorse: updatedPlayerHorse,
                competitors: updatedCompetitors
              },
              message
            };
          } else {
            message = "Perfect weather conditions forecasted for the next race. Horses with raw speed will shine.";
            
            // Boost horses with "Fair Weather" trait
            const updatedCompetitors = gameState.competitors.map(horse => {
              const updatedHorse = { ...horse };
              
              if (horse.attributes.some(attr => attr.name === "Fair Weather")) {
                updatedHorse.actualSpeed += 5;
              }
              
              return updatedHorse;
            });
            
            // Handle player horse
            const updatedPlayerHorse = { ...gameState.playerHorse };
            if (updatedPlayerHorse.attributes.some(attr => attr.name === "Fair Weather")) {
              updatedPlayerHorse.actualSpeed += 5;
              message += " Your horse's Fair Weather trait will be advantageous!";
            }
            
            return {
              gameState: {
                ...gameState,
                playerHorse: updatedPlayerHorse,
                competitors: updatedCompetitors
              },
              message
            };
          }
        }
      },
      
      // Track condition event
      {
        check: () => true,
        apply: (gameState: GameState) => {
          const condition = Math.random();
          let message = "";
          
          if (condition < 0.4) {
            message = "The track has been recently renovated and is in excellent condition. All horses will perform slightly better.";
            
            // Boost all horses slightly
            const updatedCompetitors = gameState.competitors.map(horse => {
              const updatedHorse = { ...horse };
              updatedHorse.actualSpeed += 2;
              return updatedHorse;
            });
            
            const updatedPlayerHorse = { ...gameState.playerHorse };
            updatedPlayerHorse.actualSpeed += 2;
            
            return {
              gameState: {
                ...gameState,
                playerHorse: updatedPlayerHorse,
                competitors: updatedCompetitors
              },
              message
            };
          } else if (condition < 0.7) {
            message = "The track is in poor condition. Horses with better control will have an advantage.";
            
            // Adjust based on control
            const updatedCompetitors = gameState.competitors.map(horse => {
              const updatedHorse = { ...horse };
              const adjustment = Math.floor((horse.control - 50) / 10);
              updatedHorse.actualSpeed += adjustment;
              return updatedHorse;
            });
            
            const updatedPlayerHorse = { ...gameState.playerHorse };
            const playerAdjustment = Math.floor((gameState.playerHorse.control - 50) / 10);
            updatedPlayerHorse.actualSpeed += playerAdjustment;
            
            if (playerAdjustment > 0) {
              message += " Your horse's good control will be an advantage.";
            } else if (playerAdjustment < 0) {
              message += " Your horse may struggle with the poor track conditions.";
            }
            
            return {
              gameState: {
                ...gameState,
                playerHorse: updatedPlayerHorse,
                competitors: updatedCompetitors
              },
              message
            };
          } else {
            message = "Standard track conditions for the upcoming race.";
            return {
              gameState: gameState,
              message
            };
          }
        }
      },
      
      // Crowd size event
      {
        check: () => gameState.currentRace >= 5, // More likely in later races
        apply: (gameState: GameState) => {
          const isBigCrowd = Math.random() < 0.7;
          let message = "";
          
          if (isBigCrowd) {
            message = "A massive crowd is expected for the upcoming race. Horses with 'Crowd Pleaser' traits will perform better.";
            
            // Boost horses with "Crowd Pleaser" trait
            const updatedCompetitors = gameState.competitors.map(horse => {
              const updatedHorse = { ...horse };
              
              if (horse.attributes.some(attr => attr.name === "Crowd Pleaser")) {
                updatedHorse.actualSpeed += 7;
              }
              
              return updatedHorse;
            });
            
            // Handle player horse
            const updatedPlayerHorse = { ...gameState.playerHorse };
            if (updatedPlayerHorse.attributes.some(attr => attr.name === "Crowd Pleaser")) {
              updatedPlayerHorse.actualSpeed += 7;
              message += " Your horse's Crowd Pleaser trait will be very advantageous!";
            }
            
            return {
              gameState: {
                ...gameState,
                playerHorse: updatedPlayerHorse,
                competitors: updatedCompetitors
              },
              message
            };
          } else {
            message = "A small crowd is expected for the upcoming race.";
            return {
              gameState: gameState,
              message
            };
          }
        }
      }
    ];
    
    // Filter to only events that pass their check
    const validEvents = possibleEvents.filter(event => event.check());
    
    if (validEvents.length > 0) {
      // Choose a random event
      const selectedEvent = validEvents[Math.floor(Math.random() * validEvents.length)];
      return selectedEvent.apply(gameState);
    }
  }
  
  return null;
};

// Add the missing isGameOver and isGameWon functions
export const isGameOver = (gameState: GameState): boolean => {
  // The game is over if the player has no money and can't take a loan
  if (gameState.playerMoney <= 0 && gameState.hasUsedLoanThisRace) {
    return true;
  }
  
  // The game is over if the player has a large debt they can't repay
  if (gameState.loanAmount > 0 && 
      gameState.loanAmount > (gameState.playerMoney * 3) && 
      gameState.currentRace >= gameState.totalRaces) {
    return true;
  }
  
  // The game is over if all races are completed
  if (gameState.currentRace > gameState.totalRaces) {
    return true;
  }
  
  return false;
};

export const isGameWon = (gameState: GameState): boolean => {
  // Game is won if all races are completed and player has enough money
  return gameState.currentRace > gameState.totalRaces && 
         gameState.playerMoney >= gameState.seasonGoal;
};
