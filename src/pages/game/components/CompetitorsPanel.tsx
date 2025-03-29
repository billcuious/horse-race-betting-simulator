
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import HorseCard from "@/components/HorseCard";
import SeasonHistory from "@/components/SeasonHistory";
import TrainingOptions from "@/components/TrainingOptions";
import { Horse, RaceResult } from "@/utils/gameLogic";
import { ChevronRightIcon } from "lucide-react";

interface CompetitorsPanelProps {
  competitors: Horse[];
  playerHorse: Horse;
  currentRace: number;
  selectedHorseId: string | null;
  onSelectHorse: (horseId: string | null) => void;
  onScout: (horseId: string, type: "basic" | "deep") => void;
  onSelectTraining: (type: "general" | "speed" | "rest" | "sync") => void;
  trainingsUsed: Record<string, number>;
  scoutCosts: {
    basic: number;
    deep: number;
    ownHorse: number;
  };
  isDisabled: boolean;
  isTrainingDisabled: boolean;
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
  scoutCosts,
  isDisabled,
  isTrainingDisabled,
  playerMoney,
  seasonResults
}: CompetitorsPanelProps) => {
  return (
    <div className="space-y-6">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Competitors</CardTitle>
          <CardDescription>
            Stats shown are from last scouting. Scout horses to get updated information.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full flex justify-between items-center" variant="outline">
                <span>View All Competitors</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto" side="right">
              <SheetHeader>
                <SheetTitle>All Competitors</SheetTitle>
              </SheetHeader>
              <div className="pr-4 pb-20 max-h-[90vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                  {/* Player horse shown among competitors for betting */}
                  <HorseCard 
                    key={playerHorse.id}
                    horse={playerHorse}
                    currentRace={currentRace}
                    onSelectHorse={onSelectHorse}
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
                      onSelectHorse={onSelectHorse}
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
          
          {/* Select competitor instructions */}
          <Button 
            className="w-full text-center" 
            variant="secondary" 
            onClick={() => {
              const sheet = document.querySelector('[data-radix-trigger-for]');
              if (sheet) {
                (sheet as HTMLButtonElement).click();
              }
            }}
          >
            Select a competitor to place a bet
          </Button>
          
          {/* Training Options - moved here from HorseManagement */}
          <TrainingOptions 
            onSelectTraining={onSelectTraining}
            trainingsUsed={trainingsUsed}
            playerMoney={playerMoney}
            isDisabled={isTrainingDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorsPanel;
