
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HorseCard from "@/components/HorseCard";
import { Horse } from "@/utils/gameLogic";

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
        <div className="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2">
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
      </CardContent>
    </Card>
  );
};

export default CompetitorsPanel;
