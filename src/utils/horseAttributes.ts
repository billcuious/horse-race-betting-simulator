
import { Horse } from "./types";

// Types
export type HorseAttribute = {
  name: string;
  description: string;
  isPositive: boolean;
  effect: (horse: Horse) => void;
};

// Define standard horse attributes
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

// Add rare traits for horses
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
