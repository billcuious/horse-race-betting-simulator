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

[Rest of the original gameLogic.ts file, exactly as it was before, starting from the Constants section with `export const TRAINING_BASE_COSTS` and continuing until the end]
