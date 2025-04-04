
import { HorseAttribute } from "./horseAttributes";

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
