
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import HorseCard from "@/components/HorseCard";
import SeasonHistory from "@/components/SeasonHistory";
import TrainingOptions from "@/components/TrainingOptions";
import { Horse, RaceResult } from "@/utils/gameLogic";
import { ChevronRightIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompetitorsPanelProps {
  competitors: Horse[];
  playerHorse: Horse;
  currentRace: number;
  selectedHorseId: string | null;
  onSelectHorse: (horseId: string | null) => void;
  onScout: (horseId: string, type: "basic" | "deep") => void;
  onSelectTraining: (type: "general" | "speed" | "rest" | "sync") => void;
  trainingsUsed: Record<string, number>;
  isTrainingDisabled: boolean;
  scoutCosts: {
    basic: number;
    deep: number;
    ownHorse: number;
  };
  isDisabled: boolean;
  playerMoney: number;
  seasonResults: { raceNumber: number; results: RaceResult[] }[];
}

const CompetitorsPanel = ({
  competitors,
  playerHorse,
  currentRace,
  selectedHorseId,
  onSelectHorse,
  onScout,
  onSelectTraining,
  trainingsUsed,
  isTrainingDisabled,
  scoutCosts,
  isDisabled,
  playerMoney,
  seasonResults
}: CompetitorsPanelProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t("competitors.title")}</CardTitle>
        <CardDescription>
          {t("competitors.scouting")}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              className="w-full flex justify-between items-center bg-racing-gold hover:bg-racing-gold/90 text-black font-medium" 
              variant="default"
            >
              <span>{t("competitors.viewAll")}</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto" side="right">
            <SheetHeader>
              <SheetTitle>{t("competitors.allCompetitors")}</SheetTitle>
            </SheetHeader>
            <div className="pr-4 pb-20 max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                {/* Player horse shown among competitors, now selectable for betting and without scouting options */}
                <HorseCard 
                  key={playerHorse.id}
                  horse={playerHorse}
                  currentRace={currentRace}
                  onSelect={onSelectHorse}
                  isSelected={selectedHorseId === playerHorse.id}
                  scoutCosts={scoutCosts}
                  isDisabled={isDisabled || playerHorse.missNextRace}
                  playerMoney={playerMoney}
                  isPlayerHorse={true}
                  showScoutButton={false} // Hide scout button for player's horse in competitors panel
                />
                
                {competitors.map((horse) => (
                  <HorseCard 
                    key={horse.id}
                    horse={horse}
                    currentRace={currentRace}
                    onScout={onScout}
                    onSelect={onSelectHorse}
                    isSelected={selectedHorseId === horse.id}
                    scoutCosts={scoutCosts}
                    isDisabled={isDisabled || horse.missNextRace}
                    playerMoney={playerMoney}
                  />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Season History button - now as a separate component */}
        <SeasonHistory raceResults={seasonResults} />
        
        {/* Select competitor instructions - changed from button to a text label */}
        <div className="w-full text-center p-2 bg-muted/30 rounded-md text-muted-foreground">
          {t("competitors.selectForBet")}
        </div>
        
        {/* Training options moved here from left column */}
        <div className="mt-6 w-full">
          <TrainingOptions 
            onSelectTraining={onSelectTraining}
            trainingsUsed={trainingsUsed}
            playerMoney={playerMoney}
            isDisabled={isTrainingDisabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsPanel;
