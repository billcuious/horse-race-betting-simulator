
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import HorseCard from "@/components/HorseCard";
import SeasonHistory from "@/components/SeasonHistory";
import { Horse, RaceResult } from "@/utils/gameLogic";
import { ChevronRightIcon } from "lucide-react";

interface CompetitorsPanelProps {
  competitors: Horse[];
  playerHorse: Horse;
  currentRace: number;
  selectedHorseId: string | null;
  onSelectHorse: (horseId: string | null) => void;
  onScout: (horseId: string, type: "basic" | "deep") => void;
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
  scoutCosts,
  isDisabled,
  playerMoney,
  seasonResults
}: CompetitorsPanelProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Competitors</CardTitle>
        <CardDescription>
          Stats shown are from last scouting. Scout horses to get updated information.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full flex justify-between items-center mb-4" variant="outline">
              <span>View All Competitors</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto" side="right">
            <SheetHeader>
              <SheetTitle>All Competitors</SheetTitle>
            </SheetHeader>
            <div className="pr-4 pb-20 max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
              
              {/* Season History section */}
              <div className="mt-8">
                <SeasonHistory raceResults={seasonResults} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Simplified view with just the "View All Competitors" button */}
        <Button className="w-full text-center" variant="secondary">
          Select a competitor to place a bet
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompetitorsPanel;
