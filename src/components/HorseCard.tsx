
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Horse } from "@/utils/gameLogic";
import { getVisibleHorseStats, getHorseDisplayColor } from "@/utils/horsesData";
import { InfoIcon } from "lucide-react";

interface HorseCardProps {
  horse: Horse;
  currentRace: number;
  isPlayerHorse?: boolean;
  onScout?: (horseId: string, type: "basic" | "deep") => void;
  onSelect?: (horseId: string) => void;
  isSelected?: boolean;
  scoutCosts: {
    basic: number;
    deep: number;
    ownHorse: number;
  };
  isDisabled?: boolean;
  playerMoney: number;
}

const HorseCard = ({
  horse,
  currentRace,
  isPlayerHorse = false,
  onScout,
  onSelect,
  isSelected = false,
  scoutCosts,
  isDisabled = false,
  playerMoney
}: HorseCardProps) => {
  const stats = getVisibleHorseStats(horse, currentRace, isPlayerHorse);
  const speedColor = getHorseDisplayColor(stats.displayedSpeed);
  
  const canAffordBasicScout = playerMoney >= scoutCosts.basic;
  const canAffordDeepScout = playerMoney >= scoutCosts.deep;
  const canAffordOwnHorseScout = playerMoney >= scoutCosts.ownHorse;
  
  return (
    <Card className={`w-full transition-all ${isSelected ? 'border-racing-gold border-2' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{stats.name}</CardTitle>
          {stats.lastUpdated > 0 && !isPlayerHorse && (
            <Badge variant="outline" className="text-xs">
              Last Scouted: Race {stats.lastUpdated}
            </Badge>
          )}
        </div>
        {horse.hasInjury && (
          <Badge variant="destructive" className="self-start">
            {horse.injuryType === "mild" ? "Mild Injury" : "Major Injury"}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Speed</span>
              <span className="text-sm">{stats.displayedSpeed}</span>
            </div>
            <div className="stat-bar">
              <div 
                className={`stat-bar-fill stat-bar-fill-speed`} 
                style={{ width: `${stats.displayedSpeed}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Control</span>
              <span className="text-sm">{stats.control}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill stat-bar-fill-control" 
                style={{ width: `${stats.control}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Recovery</span>
              <span className="text-sm">{stats.recovery}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill stat-bar-fill-recovery" 
                style={{ width: `${stats.recovery}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Endurance</span>
              <span className="text-sm">{stats.endurance}</span>
            </div>
            <div className="stat-bar">
              <div 
                className="stat-bar-fill stat-bar-fill-endurance" 
                style={{ width: `${stats.endurance}%` }}
              />
            </div>
          </div>
        </div>
        
        {stats.revealedAttributes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Traits</h4>
            <div className="flex flex-wrap gap-1">
              {stats.revealedAttributes.map((trait) => (
                <Badge key={trait} variant="secondary" className="text-xs">{trait}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {stats.hasMoreAttributes && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center">
            <InfoIcon className="h-3 w-3 mr-1" />
            More traits to discover
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        {isPlayerHorse ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={() => onScout && onScout(horse.id, "deep")}
            disabled={isDisabled || !canAffordOwnHorseScout || !stats.hasMoreAttributes}
          >
            Scout Own Horse (${scoutCosts.ownHorse})
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={() => onScout && onScout(horse.id, "basic")}
              disabled={isDisabled || !canAffordBasicScout}
            >
              Scout (${scoutCosts.basic})
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={() => onScout && onScout(horse.id, "deep")}
              disabled={isDisabled || !canAffordDeepScout || !stats.hasMoreAttributes}
            >
              Deep Scout (${scoutCosts.deep})
            </Button>
          </div>
        )}
        
        {onSelect && (
          <Button 
            variant={isSelected ? "default" : "secondary"} 
            size="sm" 
            className="w-full" 
            onClick={() => onSelect(horse.id)}
            disabled={isDisabled || horse.missNextRace}
          >
            {isSelected ? "Selected" : "Select for Bet"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HorseCard;
