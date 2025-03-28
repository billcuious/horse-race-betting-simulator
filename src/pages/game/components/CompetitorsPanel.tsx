
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import HorseCard from "@/components/HorseCard";
import { Horse } from "@/utils/gameLogic";
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
  playerMoney
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
          <SheetContent className="w-full sm:max-w-md md:max-w-2xl overflow-y-auto" side="right">
            <SheetHeader>
              <SheetTitle>All Competitors</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pr-4 pb-20 max-h-[90vh] overflow-y-auto">
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
          </SheetContent>
        </Sheet>
        
        <div className="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2">
          {/* Player horse in main panel view */}
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
          
          {/* Show just a few competitors in the main panel */}
          {competitors.slice(0, 3).map((horse) => (
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
          
          {competitors.length > 3 && (
            <Card className="p-4 text-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary">View All {competitors.length} Competitors</Button>
                </SheetTrigger>
              </Sheet>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsPanel;
