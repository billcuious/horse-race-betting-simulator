
import { Horse } from "./types";
import { HorseAttribute } from "./horseAttributes";

// Apply jockey effects to the player's horse
export const applyJockeyEffects = (horse: Horse, jockeyId: string): void => {
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
      
    case "celebrity":
      // Celebrity Jockey: $300 bonus per race, half prize money for top 3
      const celebrityTrait: HorseAttribute = {
        name: "Celebrity Status",
        description: "This jockey's fame brings in sponsorship money but they take a bigger cut of prize money.",
        isPositive: true,
        effect: (h: Horse) => {
          // Effects handled during race calculations
        }
      };
      
      horse.attributes.push(celebrityTrait);
      horse.revealedAttributes.push(celebrityTrait);
      break;
      
    case "underhanded":
      // Underhanded Jockey: Gains $1000 for last place, 40% loan interest, -3 all stats
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 3);
      horse.control = Math.max(10, horse.control - 3);
      horse.recovery = Math.max(10, horse.recovery - 3);
      horse.endurance = Math.max(10, horse.endurance - 3);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      const underhandedTrait: HorseAttribute = {
        name: "Underhanded Tactics",
        description: "This jockey uses questionable methods, receiving payouts for last place but with higher loan costs.",
        isPositive: false,
        effect: (h: Horse) => {
          // Effects handled during race calculations
        }
      };
      
      horse.attributes.push(underhandedTrait);
      horse.revealedAttributes.push(underhandedTrait);
      break;
      
    case "slippery":
      // Slippery Jockey: 20% chance to place one position higher, speed decreases 10% faster
      const slipperyTrait: HorseAttribute = {
        name: "Slippery Tactics",
        description: "This jockey can sneak into better positions but pushes the horse harder, accelerating stat decline.",
        isPositive: true,
        effect: (h: Horse) => {
          // Effects handled during race calculations
        }
      };
      
      horse.attributes.push(slipperyTrait);
      horse.revealedAttributes.push(slipperyTrait);
      break;
      
    case "oneshot":
      // One Shot Jockey: Race 10 bonus, double stat decline after, -4 all stats
      horse.displayedSpeed = Math.max(40, horse.displayedSpeed - 4);
      horse.control = Math.max(10, horse.control - 4);
      horse.recovery = Math.max(10, horse.recovery - 4);
      horse.endurance = Math.max(10, horse.endurance - 4);
      horse.actualSpeed = horse.displayedSpeed * (0.8 + 0.2 * horse.endurance / 100);
      
      const oneShotTrait: HorseAttribute = {
        name: "One Shot Specialist",
        description: "This jockey focuses on a single race at the cost of long-term performance.",
        isPositive: true,
        effect: (h: Horse) => {
          // Effects handled during race calculations
        }
      };
      
      horse.attributes.push(oneShotTrait);
      horse.revealedAttributes.push(oneShotTrait);
      break;
  }
};
