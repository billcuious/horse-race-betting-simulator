
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Horse } from "@/utils/gameLogic";
import { getVisibleHorseStats, getHorseDisplayColor } from "@/utils/horsesData";
import { InfoIcon, AlertCircleIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  showScoutButton?: boolean;
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
  playerMoney,
  showScoutButton = true
}: HorseCardProps) => {
  const stats = getVisibleHorseStats(horse, currentRace, isPlayerHorse);
  const speedColor = getHorseDisplayColor(stats.displayedSpeed);
  const { t } = useLanguage();
  
  const canAffordBasicScout = playerMoney >= scoutCosts.basic;
  const canAffordDeepScout = playerMoney >= scoutCosts.deep;
  const canAffordOwnHorseScout = playerMoney >= scoutCosts.ownHorse;
  
  const statsAreOutdated = !isPlayerHorse && stats.lastUpdated < currentRace && stats.lastUpdated > 0;
  
  return (
    <Card className={`w-full transition-all ${isSelected ? 'border-racing-gold border-2' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{stats.name}</CardTitle>
          {stats.lastUpdated > 0 && !isPlayerHorse && (
            <Badge variant="outline" className={`text-xs ${statsAreOutdated ? 'text-yellow-600' : ''}`}>
              {statsAreOutdated ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <AlertCircleIcon className="h-3 w-3 mr-1 text-yellow-600" />
                        {t("scout.lastRace").replace("{{race}}", stats.lastUpdated.toString())}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{t("stats.outdated")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>{t("scout.lastRace").replace("{{race}}", stats.lastUpdated.toString())}</>
              )}
            </Badge>
          )}
        </div>
        {horse.hasInjury && (
          <Badge variant="destructive" className="self-start">
            {horse.injuryType === "mild" ? t("horse.mildInjury") : t("horse.majorInjury")}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{t("stats.speed")}</span>
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
              <span className="text-sm font-medium">{t("stats.control")}</span>
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
              <span className="text-sm font-medium">{t("stats.recovery")}</span>
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
              <span className="text-sm font-medium">{t("stats.endurance")}</span>
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
        
        {statsAreOutdated && !isPlayerHorse && (
          <div className="mt-3 text-xs text-yellow-600 flex items-center">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            {t("stats.outdatedWarning")}
          </div>
        )}
        
        {stats.revealedAttributes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">{t("stats.traits")}</h4>
            <div className="flex flex-wrap gap-1">
              {stats.revealedAttributes.map((trait) => (
                <HoverCard key={trait} openDelay={100} closeDelay={200}>
                  <HoverCardTrigger asChild>
                    <Badge variant="secondary" className="text-xs cursor-help hover:bg-secondary/80">
                      {t(`trait.${trait.replace(/\s+/g, '')}`, trait)}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72 p-4">
                    <p className="text-sm">{t(`traitDesc.${trait.replace(/\s+/g, '')}`, `${trait} ${t("trait.effectsPerformance")}`)}</p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        )}
        
        {stats.hasMoreAttributes && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center">
            <InfoIcon className="h-3 w-3 mr-1" />
            {t("trait.moreToDiscover")}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        {isPlayerHorse ? (
          <div className="flex w-full gap-2">
            {showScoutButton && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => onScout && onScout(horse.id, "deep")}
                disabled={isDisabled || !canAffordOwnHorseScout || !stats.hasMoreAttributes}
              >
                {t("scout.ownHorse").replace("{{cost}}", scoutCosts.ownHorse.toString())}
              </Button>
            )}
            
            {onSelect && (
              <Button 
                variant={isSelected ? "default" : "secondary"} 
                size="sm" 
                className="w-full" 
                onClick={() => onSelect(horse.id)}
                disabled={isDisabled || horse.missNextRace}
              >
                {isSelected ? t("betting.selected") : t("betting.selectForBet")}
              </Button>
            )}
          </div>
        ) : (
          <>
            {showScoutButton && (
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 text-xs"
                  onClick={() => onScout && onScout(horse.id, "basic")}
                  disabled={isDisabled || playerMoney < scoutCosts.basic}
                >
                  {t("scout.basic").replace("{{cost}}", scoutCosts.basic.toString())}
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => onScout && onScout(horse.id, "deep")}
                  disabled={isDisabled || playerMoney < scoutCosts.deep}
                >
                  {t("scout.deep").replace("{{cost}}", scoutCosts.deep.toString())}
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
                {isSelected ? t("betting.selected") : t("betting.selectForBet")}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default HorseCard;
