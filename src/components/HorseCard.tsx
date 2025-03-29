
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Horse, HorseAttribute } from "@/utils/gameLogic";
import { Plus, Minus, Eye, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HorseCardProps {
  horse: Horse;
  isPlayerHorse?: boolean;
  showAttributes?: boolean;
  currentRace: number;
  onScout?: (horseId: string, type: "basic" | "deep") => void;
  onSelectHorse?: (horseId: string) => void;
  scoutCosts: {
    basic: number;
    deep: number;
    ownHorse: number;
  };
  playerMoney: number;
  showControls?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  showScoutButton?: boolean;
}

const formatTrait = (trait: string): string => {
  switch (trait) {
    case "injury":
      return "Injured";
    case "stumble":
      return "Stumbled";
    case "burst":
      return "Sudden Burst";
    case "tired":
      return "Tired";
    case "distracted":
      return "Distracted";
    case "perfect":
      return "Perfect Run";
    case "jockey":
      return "Jockey Error";
    case "weather":
      return "Weather Advantage";
    case "comeback":
      return "Comeback";
    case "nervous":
      return "Nervous";
    default:
      return trait;
  }
};

const getEventFlavorText = (event: string, position: number): string => {
  switch (event) {
    case "injury":
      return "Suffered an injury during the race";
    case "stumble":
      return "Stumbled at a crucial moment";
    case "burst":
      return position <= 3 
        ? "Made an impressive burst of speed" 
        : "Had a brief burst of speed but couldn't maintain it";
    case "tired":
      return "Showed signs of fatigue during the race";
    case "distracted":
      return "Got distracted by the crowd or other horses";
    case "perfect":
      return position <= 3
        ? "Had a perfect, flawless run"
        : "Started with perfect form but couldn't maintain it";
    case "jockey":
      return "The jockey made a questionable decision";
    case "weather":
      return position <= 4
        ? "Handled the weather conditions exceptionally well"
        : "Struggled with the weather conditions";
    case "comeback":
      return position <= 4
        ? "Made an impressive comeback"
        : "Attempted a comeback but fell short";
    case "nervous":
      return "Showed signs of nervousness at the starting gate";
    default:
      return "Experienced an unusual event during the race";
  }
};

const getTraitFlavorText = (traitName: string): string => {
  switch (traitName) {
    case "Dark Horse":
      return "This horse performs better when underestimated and thrives as an underdog.";
    case "Strong Finisher":
      return "Known for getting stronger as the season progresses, this horse peaks later than others.";
    case "Crowd Favorite":
      return "The crowd goes wild for this charismatic horse, boosting its confidence.";
    case "Iron Horse":
      return "Built like a tank, this horse rarely gets injured and recovers quickly.";
    case "Nervous Runner":
      return "This horse gets anxious before races, sometimes affecting its performance.";
    case "Fragile":
      return "This horse has a delicate constitution and requires careful handling.";
    case "Poor Starter":
      return "Takes time to reach peak form, often underperforming early in the season.";
    case "Unpredictable":
      return "You never know what you're going to get with this horse - brilliant one day, disappointing the next.";
    case "Mud Runner":
      return "Performs exceptionally well in poor track conditions where others struggle.";
    case "Sprinter":
      return "Excels in shorter races with quick bursts of speed rather than endurance races.";
    case "Late Bloomer":
      return "This horse develops its potential later than most, surprising everyone mid-season.";
    case "Adaptable":
      return "Quickly adapts to changing conditions and learns from each race.";
    case "Consistent":
      return "Rarely has bad races, maintaining reliable performance throughout the season.";
    case "Overachiever":
      return "Occasionally performs far beyond expectations, surprising everyone including its trainers.";
    case "Training Resistant":
      return "Stubbornly resists standard training methods, making improvement challenging.";
    case "Inconsistent":
      return "Performance varies wildly from race to race with little predictability.";
    case "Temperamental":
      return "Has a mind of its own and sometimes decides not to give full effort.";
    case "Spotlight Shy":
      return "Performs worse when all eyes are on it as the favorite.";
    default:
      return "A unique characteristic that affects performance in various ways.";
  }
};

const HorseCard: React.FC<HorseCardProps> = ({
  horse,
  isPlayerHorse = false,
  showAttributes = true,
  currentRace,
  onScout,
  playerMoney,
  showControls = true,
  onSelectHorse,
  isSelected = false,
  isDisabled = false,
  showScoutButton = true
}) => {
  const isOutdated = horse.lastUpdated < currentRace - 1;
  const statsToShow = isPlayerHorse || horse.lastUpdated > 0 ? horse.scoutedStats : { 
    displayedSpeed: "??", 
    control: "??", 
    recovery: "??", 
    endurance: "??" 
  };
  
  const handleSelectHorse = () => {
    if (onSelectHorse && !isDisabled) {
      onSelectHorse(horse.id);
    }
  };
  
  const renderTraitBadge = (trait: HorseAttribute) => (
    <TooltipProvider key={trait.name}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={`mr-1 mb-1 cursor-help ${
              trait.isPositive 
                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
            variant="outline"
          >
            {trait.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4">
          <p>{getTraitFlavorText(trait.name)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  
  return (
    <Card 
      className={`horse-card transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary" : ""
      } ${
        horse.hasInjury ? "bg-red-50" : ""
      } ${
        isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:shadow-md"
      }`}
      onClick={handleSelectHorse}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {horse.name}
              {isPlayerHorse && <Badge className="ml-2 bg-blue-600">Your Horse</Badge>}
            </CardTitle>
            <CardDescription>
              {isOutdated && !isPlayerHorse && (
                <div className="flex items-center text-amber-600 mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Outdated Info
                </div>
              )}
            </CardDescription>
          </div>
          
          {horse.hasInjury && (
            <Badge variant="outline" className="bg-red-100 text-red-800">
              {horse.injuryType === "mild" ? "Injured" : "Severely Injured"}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Speed</span>
              <span>{typeof statsToShow.displayedSpeed === "number" ? statsToShow.displayedSpeed : statsToShow.displayedSpeed}</span>
            </div>
            <Progress value={typeof statsToShow.displayedSpeed === "number" ? statsToShow.displayedSpeed : 0} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Control</span>
              <span>{typeof statsToShow.control === "number" ? statsToShow.control : statsToShow.control}</span>
            </div>
            <Progress value={typeof statsToShow.control === "number" ? statsToShow.control : 0} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Recovery</span>
              <span>{typeof statsToShow.recovery === "number" ? statsToShow.recovery : statsToShow.recovery}</span>
            </div>
            <Progress value={typeof statsToShow.recovery === "number" ? statsToShow.recovery : 0} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Endurance</span>
              <span>{typeof statsToShow.endurance === "number" ? statsToShow.endurance : statsToShow.endurance}</span>
            </div>
            <Progress value={typeof statsToShow.endurance === "number" ? statsToShow.endurance : 0} className="h-2" />
          </div>
          
          {showAttributes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Traits</h4>
                <div className="flex flex-wrap">
                  {isPlayerHorse ? (
                    horse.revealedAttributes.length > 0 ? (
                      horse.revealedAttributes.map(trait => renderTraitBadge(trait))
                    ) : (
                      <p className="text-sm text-muted-foreground">No traits discovered yet. Scout your horse to reveal traits.</p>
                    )
                  ) : (
                    horse.revealedAttributes.length > 0 ? (
                      horse.revealedAttributes.map(trait => renderTraitBadge(trait))
                    ) : (
                      <p className="text-sm text-muted-foreground">No traits discovered yet. Scout this horse to reveal traits.</p>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {showControls && showScoutButton && onScout && (
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex space-x-2 w-full">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onScout(horse.id, "basic");
              }}
              disabled={playerMoney < 300 || isDisabled}
            >
              <Eye className="w-4 h-4 mr-1" /> Basic Scout ($300)
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onScout(horse.id, "deep");
              }}
              disabled={playerMoney < 700 || isDisabled}
            >
              <Plus className="w-4 h-4 mr-1" /> Deep Scout ($700)
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default HorseCard;
