
import { Horse } from "./types";
import { HORSE_ATTRIBUTES, RARE_HORSE_ATTRIBUTES, HorseAttribute } from "./horseAttributes";

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
