
import { Horse } from './gameLogic';

// Function to get a competitor's known stats based on when they were last scouted
export const getVisibleHorseStats = (
  horse: Horse,
  currentRace: number,
  isPlayerHorse: boolean = false
): {
  name: string;
  displayedSpeed: number;
  control: number;
  recovery: number;
  endurance: number;
  lastUpdated: number;
  revealedAttributes: string[];
  hasMoreAttributes: boolean;
} => {
  // For player's horse, show real stats
  if (isPlayerHorse) {
    return {
      name: horse.name,
      displayedSpeed: horse.displayedSpeed,
      control: horse.control,
      recovery: horse.recovery,
      endurance: horse.endurance,
      lastUpdated: currentRace,
      revealedAttributes: horse.revealedAttributes.map(attr => attr.name),
      hasMoreAttributes: horse.attributes.length > horse.revealedAttributes.length
    };
  }
  
  // For competitors, show only stats as of the last time they were scouted
  if (horse.lastUpdated === 0) {
    // If never scouted, show initial stats
    return {
      name: horse.name,
      displayedSpeed: horse.displayedSpeed,
      control: horse.control,
      recovery: horse.recovery,
      endurance: horse.endurance,
      lastUpdated: 0,
      revealedAttributes: horse.revealedAttributes.map(attr => attr.name),
      hasMoreAttributes: horse.attributes.length > horse.revealedAttributes.length
    };
  }
  
  // If scouted before, return the current stats (as of the last scouting)
  return {
    name: horse.name,
    displayedSpeed: horse.displayedSpeed,
    control: horse.control,
    recovery: horse.recovery,
    endurance: horse.endurance,
    lastUpdated: horse.lastUpdated,
    revealedAttributes: horse.revealedAttributes.map(attr => attr.name),
    hasMoreAttributes: horse.attributes.length > horse.revealedAttributes.length
  };
};

// Format horse details for display
export const formatHorseDetails = (
  horse: Horse, 
  isPlayerHorse: boolean = false,
  currentRace: number
): string => {
  const visibleStats = getVisibleHorseStats(horse, currentRace, isPlayerHorse);
  
  let details = `${visibleStats.name}\n`;
  details += `Speed: ${visibleStats.displayedSpeed}\n`;
  details += `Control: ${visibleStats.control}\n`;
  details += `Recovery: ${visibleStats.recovery}\n`;
  details += `Endurance: ${visibleStats.endurance}\n`;
  
  if (isPlayerHorse) {
    // For player's horse, show all revealed attributes
    if (visibleStats.revealedAttributes.length > 0) {
      details += "\nTraits:\n";
      visibleStats.revealedAttributes.forEach(attr => {
        details += `- ${attr}\n`;
      });
    }
    
    if (visibleStats.hasMoreAttributes) {
      details += "\n(More traits to discover)\n";
    }
  } else {
    // For competitors, show when last scouted
    if (visibleStats.lastUpdated === 0) {
      details += "\n(Initial stats only)\n";
    } else {
      details += `\n(Last scouted: Race ${visibleStats.lastUpdated})\n`;
    }
    
    // Show any revealed attributes
    if (visibleStats.revealedAttributes.length > 0) {
      details += "Known Traits:\n";
      visibleStats.revealedAttributes.forEach(attr => {
        details += `- ${attr}\n`;
      });
    }
    
    if (visibleStats.hasMoreAttributes) {
      details += "(More traits to discover)\n";
    } else if (visibleStats.revealedAttributes.length > 0) {
      details += "(All traits discovered)\n";
    }
  }
  
  return details;
};

// Get horse display color based on its stats
export const getHorseDisplayColor = (displayedSpeed: number): string => {
  if (displayedSpeed >= 90) return "bg-racing-red";
  if (displayedSpeed >= 80) return "bg-red-400";
  if (displayedSpeed >= 70) return "bg-orange-400";
  if (displayedSpeed >= 60) return "bg-yellow-400";
  return "bg-green-400";
};
