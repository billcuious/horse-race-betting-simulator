
import { GameState } from "./types";
import { toast } from "sonner";

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

// Import HORSE_ATTRIBUTES for the press campaign event
import { HORSE_ATTRIBUTES } from "./horseAttributes";

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
